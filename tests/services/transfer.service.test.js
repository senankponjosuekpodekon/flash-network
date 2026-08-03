import { describe, it, expect, vi, beforeEach } from "vitest";
import transferService from "../../src/services/transfer.service.js";

vi.mock("../../src/repositories/balance.repository.js", () => ({
    default: {
        getBalance: vi.fn(),
        transfer: vi.fn(),
        credit: vi.fn(),
        debit: vi.fn(),
        ensureBalance: vi.fn(),
    },
}));

vi.mock("../../src/repositories/transaction.repository.js", () => ({
    default: {
        create: vi.fn(),
        exists: vi.fn(),
        findByUserId: vi.fn(),
        confirm: vi.fn(),
    },
}));

vi.mock("../../src/repositories/user.repository.js", () => ({
    default: {
        findByEmail: vi.fn(),
        create: vi.fn(),
    },
}));

import balanceRepository from "../../src/repositories/balance.repository.js";
import transactionRepository from "../../src/repositories/transaction.repository.js";
import userRepository from "../../src/repositories/user.repository.js";

describe("TransferService", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getInternalBalance should return balance as string", async () => {
        balanceRepository.getBalance.mockResolvedValue(BigInt(500));

        const result = await transferService.getInternalBalance(1);

        expect(result.balance).toBe("500");
        expect(result.unit).toBe("FLASH");
    });

    it("transfer should throw if recipient not found", async () => {
        userRepository.findByEmail.mockResolvedValue(null);

        await expect(
            transferService.transfer(1, "nonexistent@test.com", 100)
        ).rejects.toThrow("Recipient not found");
    });

    it("transfer should throw if transferring to self", async () => {
        userRepository.findByEmail.mockResolvedValue({ id: 1, email: "self@test.com" });

        await expect(
            transferService.transfer(1, "self@test.com", 100)
        ).rejects.toThrow("Cannot transfer to yourself");
    });

    it("transfer should throw if amount is zero or negative", async () => {
        userRepository.findByEmail.mockResolvedValue({ id: 2, email: "other@test.com" });

        await expect(
            transferService.transfer(1, "other@test.com", 0)
        ).rejects.toThrow("Amount must be positive");

        await expect(
            transferService.transfer(1, "other@test.com", -100)
        ).rejects.toThrow("Amount must be positive");
    });

    it("transfer should succeed with valid params", async () => {
        userRepository.findByEmail.mockResolvedValue({ id: 2, email: "other@test.com" });
        balanceRepository.transfer.mockResolvedValue(undefined);
        transactionRepository.create.mockResolvedValue({ id: 1 });

        const result = await transferService.transfer(1, "other@test.com", 100);

        expect(result.transferred).toBe("100");
        expect(result.to).toBe("other@test.com");
        expect(balanceRepository.transfer).toHaveBeenCalledWith(1, 2, BigInt(100));
        expect(transactionRepository.create).toHaveBeenCalledTimes(2);
    });
});
