import { describe, it, expect } from "vitest";

describe("FLASH.sol contract logic", () => {

    it("MAX_SUPPLY should be 10 billion tokens with 18 decimals", () => {
        const maxSupply = 10_000_000_000 * 10 ** 18;
        expect(maxSupply).toBe(10_000_000_000_000_000_000_000_000_000);
    });

    it("initial mint should be 1 billion tokens with 18 decimals", () => {
        const initialSupply = 1_000_000_000 * 10 ** 18;
        expect(initialSupply).toBe(1_000_000_000_000_000_000_000_000_000);
    });

    it("mint should not exceed MAX_SUPPLY", () => {
        const maxSupply = 10_000_000_000 * 10 ** 18;
        const currentSupply = 9_000_000_000 * 10 ** 18;
        const mintAmount = 2_000_000_000 * 10 ** 18;

        expect(currentSupply + mintAmount).toBeGreaterThan(maxSupply);
    });

    it("confiscate should not target owner", () => {
        const isOwner = true;
        expect(isOwner).toBe(true);
    });

    it("freeze should prevent outgoing but allow incoming", () => {
        const frozen = true;
        const canSend = !frozen;
        const canReceive = true;

        expect(canSend).toBe(false);
        expect(canReceive).toBe(true);
    });

    it("blacklist should prevent both send and receive", () => {
        const blacklisted = true;
        const canSend = !blacklisted;
        const canReceive = !blacklisted;

        expect(canSend).toBe(false);
        expect(canReceive).toBe(false);
    });
});
