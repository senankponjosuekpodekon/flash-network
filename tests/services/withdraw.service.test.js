import { describe, it, expect, vi, beforeEach } from "vitest";

const mockContract = {
    transfer: vi.fn(() => ({
        send: vi.fn().mockResolvedValue("txid123"),
    })),
    balanceOf: vi.fn(() => ({
        call: vi.fn().mockResolvedValue(BigInt(1000000)),
    })),
};

vi.mock("../../src/config/tron.js", () => ({
    default: {
        setPrivateKey: vi.fn(),
        address: {
            fromPrivateKey: vi.fn().mockReturnValue("TOWNER123"),
        },
        contract: vi.fn(() => ({
            at: vi.fn().mockResolvedValue(mockContract),
        })),
    },
    createTronWeb: vi.fn(() => ({
        contract: vi.fn(() => ({
            at: vi.fn().mockResolvedValue(mockContract),
        })),
    })),
    getFlashContract: vi.fn(() => Promise.resolve(mockContract)),
}));

vi.mock("../../src/repositories/wallet.repository.js", () => ({
    default: {
        findByUserId: vi.fn(),
        findSecureByUserId: vi.fn(),
        findByAddress: vi.fn(),
    },
}));

vi.mock("../../src/utils/crypto.js", () => ({
    decrypt: vi.fn().mockReturnValue("decrypted-private-key"),
}));

import withdrawService from "../../src/services/withdraw.service.js";
import walletRepository from "../../src/repositories/wallet.repository.js";
import balanceRepository from "../../src/repositories/balance.repository.js";

vi.mock("../../src/repositories/balance.repository.js", () => ({
    default: {
        debit: vi.fn(),
        credit: vi.fn(),
        getBalance: vi.fn(),
        ensureBalance: vi.fn(),
    },
}));

describe("WithdrawService", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        process.env.FLASH_CONTRACT_ADDRESS = "TFLASH123";
    });

    it("should throw if no destination address when contract address missing", async () => {
        delete process.env.FLASH_CONTRACT_ADDRESS;

        await expect(
            withdrawService.withdraw(1, null, 100)
        ).rejects.toThrow("Destination address required");
    });

    it("should throw if no destination address", async () => {
        await expect(
            withdrawService.withdraw(1, null, 100)
        ).rejects.toThrow("Destination address required");
    });

    it("should throw if amount is zero or negative", async () => {
        await expect(
            withdrawService.withdraw(1, "TDEST123", 0)
        ).rejects.toThrow("Amount must be positive");
    });

    it("should throw if wallet not found", async () => {
        walletRepository.findSecureByUserId.mockResolvedValue(null);

        await expect(
            withdrawService.withdraw(1, "TDEST123", 100)
        ).rejects.toThrow("Wallet not found");
    });

    it("should re-credit balance if on-chain transfer fails", async () => {
        walletRepository.findSecureByUserId.mockResolvedValue({
            id: 1,
            address: "TWALLET123",
            encrypted_private_key: "encrypted",
        });
        balanceRepository.debit.mockResolvedValue(BigInt(900));

        const { createTronWeb } = await import("../../src/config/tron.js");
        createTronWeb.mockReturnValue({
            contract: vi.fn(() => ({
                at: vi.fn().mockResolvedValue({
                    transfer: vi.fn(() => ({
                        send: vi.fn().mockRejectedValue(new Error("Broadcast failed")),
                    })),
                    balanceOf: vi.fn(() => ({
                        call: vi.fn().mockResolvedValue(BigInt(1000000)),
                    })),
                }),
            })),
        });

        await expect(
            withdrawService.withdraw(1, "TDEST123", 100)
        ).rejects.toThrow("Withdrawal failed, balance restored");

        expect(balanceRepository.credit).toHaveBeenCalledWith(1, BigInt(100));
    });
});
