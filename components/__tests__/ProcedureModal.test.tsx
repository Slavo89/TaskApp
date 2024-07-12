import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProcedureModal, { ProcedureStep } from '../UI/ProcedureModal';

const mockOnSaveProcedureSteps = jest.fn();
const mockOnClose = jest.fn();
const procedureSteps: ProcedureStep[] = [];

jest.mock('react-native-keyboard-aware-scroll-view', () => {
	return {
		KeyboardAwareScrollView: jest.fn().mockImplementation(({children}) => children)
	}
});

jest.mock('react-native-gesture-handler', () => {
	const actual = jest.requireActual('react-native-gesture-handler');
	return {
		...actual,
		// Add mock implementation for specific modules if needed
	};
});

describe('ProcedureModal', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders correctly', () => {
		const { getByText } = render(
			<ProcedureModal
				visible={true}
				procedureSteps={procedureSteps}
				onSaveProcedureSteps={mockOnSaveProcedureSteps}
				onClose={mockOnClose}
			/>
		);
		expect(getByText('Procedure Steps')).toBeTruthy();
	});

	it('adds a new step when Add next step button is pressed', () => {
		const { getByPlaceholderText, getByText, queryAllByPlaceholderText } =
			render(
				<ProcedureModal
					visible={true}
					procedureSteps={procedureSteps}
					onSaveProcedureSteps={mockOnSaveProcedureSteps}
					onClose={mockOnClose}
				/>
			);

		const input = getByPlaceholderText('Enter step description');
		fireEvent.changeText(input, 'New Step');
		fireEvent.press(getByText('Add next step'));

		const stepInputs = queryAllByPlaceholderText('Enter step description');
		expect(stepInputs.length).toBe(2);
		expect(stepInputs[0].props.value).toBe('New Step');
	});

	it('edits an existing step description', () => {
		const initialSteps: ProcedureStep[] = [
			{ id: '1', description: 'Step 1' },
			{ id: '2', description: 'Step 2' },
		];
		const { getByDisplayValue, queryByDisplayValue } = render(
			<ProcedureModal
				visible={true}
				procedureSteps={initialSteps}
				onSaveProcedureSteps={mockOnSaveProcedureSteps}
				onClose={mockOnClose}
			/>
		);

		const step1Input = getByDisplayValue('Step 1');
		fireEvent.changeText(step1Input, 'Updated Step 1');

		expect(queryByDisplayValue('Updated Step 1')).toBeTruthy();
	});

	it('saves procedure steps and closes the modal', () => {
		const { getByPlaceholderText, getByText } = render(
			<ProcedureModal
				visible={true}
				procedureSteps={procedureSteps}
				onSaveProcedureSteps={mockOnSaveProcedureSteps}
				onClose={mockOnClose}
			/>
		);

		const input = getByPlaceholderText('Enter step description');
		fireEvent.changeText(input, 'New Step');
		fireEvent.press(getByText('Add next step'));

		fireEvent.press(getByText('Save and go back'));

		expect(mockOnSaveProcedureSteps).toHaveBeenCalledWith([
			{ id: '0', description: 'New Step' },
		]);
		expect(mockOnClose).toHaveBeenCalled();
	});
});
