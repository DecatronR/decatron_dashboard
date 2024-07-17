import React from 'react';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CreateStatesForm from "src/sections/state/create-states-form";
import { createState } from 'src/sections/state/stateApiCalls';

vi.mock('src/sections/state/stateApiCalls');

describe("CreateStateForm", () => {
    it("creates new state on button click", async () => {
        render(<CreateStatesForm />);

        const button = screen.getByRole('button', { name: /create/i });
        const input = screen.getByRole('textbox');

        expect(button).toHaveTextContent('Create');

        fireEvent.change(input, { target: { value: 'NewState' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(createState).toHaveBeenCalledWith({ state: 'NewState' });
        });

        // Mock the API call
        const mockApiResponse = { success: true };
        createState.mockResolvedValueOnce(mockApiResponse);

        // Assert that the API call was triggered
        expect(createState).toHaveBeenCalledTimes(1);
        expect(createState).toHaveBeenCalledWith({ state: 'NewState' });

        // Assert that the success message is displayed
        const successMessage = await screen.findByText(/State created successfully/i);
        expect(successMessage).toBeInTheDocument();
    });

    it("displays success message when state is created successfully", async () => {
        render(<CreateStatesForm />);

        const button = screen.getByRole('button', { name: /create/i });
        const input = screen.getByRole('textbox');

        expect(button).toHaveTextContent('Create');

        fireEvent.change(input, { target: { value: 'NewState' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(createState).toHaveBeenCalledWith({ state: 'NewState' });
        });

        // Mock the API call
        const mockApiResponse = { success: true };
        createState.mockResolvedValueOnce(mockApiResponse);

        // Assert that the API call was triggered
        expect(createState).toHaveBeenCalledTimes(1);
        expect(createState).toHaveBeenCalledWith({ state: 'NewState' });

        // Assert that the success message is displayed
        const successMessage = await screen.findByText(/State created successfully/i);
        expect(successMessage).toBeInTheDocument();
    });
});
