import { describe, it, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'

describe("App", () => {
    it("expect 2+3 = 5", async () => {
        expect(2+3).toBe(5);
    })
});