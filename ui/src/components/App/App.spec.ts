import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
describe("App", () => {
    let useStateMock: any;

    beforeEach(() => {
        const setStateMock = vi.fn();
        useStateMock = (useState: any) => [useState, setStateMock];
    });
    it("expect 2+3 = 5", async () => {
        expect(2+3).toBe(5);
    })
});