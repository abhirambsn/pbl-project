import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App'
import React from 'react';

describe("App", () => {
    test("renders heading", async () => {
        React.useState = jest.fn().mockReturnValue([0, {}])
        render(App());
        expect(screen.getByRole("heading", { name: "App" })).toBeInTheDocument()
    })
});