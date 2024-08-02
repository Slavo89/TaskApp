import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '@/constants/Colors';
import { Icon } from '@rneui/themed';
import { Priority } from '@/store/tasks-context';
import ProcedureModal, { ProcedureStep } from './ProcedureModal';

interface AddTaskFormProps {
	buttonTitle: string;
	onPressHandler: (
		id: string,
		title: string,
		priority: Priority,
		procedureSteps: ProcedureStep[]
	) => void;
	editingId?: string;
	editingTitle?: string;
	editingPriority?: Priority | undefined;
	editingProcedureSteps?: ProcedureStep[];
}

function generateBigIntId() {
	const randomInt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
	return BigInt(randomInt).toString();
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
	buttonTitle,
	onPressHandler,
	editingId,
	editingTitle,
	editingPriority,
	editingProcedureSteps,
}) => {
	const [title, setTitle] = useState('');
	const [priority, setPriority] = useState<Priority>('weekly');
	const [procedureSteps, setProcedureSteps] = useState<ProcedureStep[]>([]);
	const [procedureModalVisible, setProcedureModalVisible] =
		useState<boolean>(false);

	const saveProcedureSteps = (steps: ProcedureStep[]) => {
		setProcedureSteps(steps);
	};

	const saveFormDataHandler = () => {
		//Form Validation
		let id;
		if (editingId) {
			id = editingId;
		} else {
			id = generateBigIntId();
		}

		if (title.trim() === '') {
			Alert.alert('Validation Error', 'Title is required');
			return;
		}

		onPressHandler(id, title, priority, procedureSteps);

		// Resseting form fields
		setTitle('');
		setPriority('weekly');
		setProcedureSteps([]);
	};

	useEffect(() => {
		if (editingTitle) {
			setTitle(editingTitle);
		}
		if (editingPriority) {
			setPriority(editingPriority);
		}
		if (editingProcedureSteps) {
			setProcedureSteps(editingProcedureSteps);
		}
	}, []);

	return (
		<View style={styles.content}>
			<View style={styles.container}>
				<Text style={styles.label}>Title</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter title"
					placeholderTextColor={Colors.font}
					clearButtonMode="always"
					cursorColor={Colors.font}
					value={title}
					onChangeText={setTitle}
				/>
			</View>
			<View style={styles.container}>
				<Text style={styles.label}>Priority</Text>
				<Picker
					selectedValue={priority}
					onValueChange={(itemValue) => setPriority(itemValue as Priority)}
					itemStyle={styles.picker}
					mode="dropdown"
					dropdownIconColor={Colors.font}
					selectionColor={Colors.font}
				>
					<Picker.Item
						label="Daily"
						value="daily"
						style={styles.picker}
					/>
					<Picker.Item
						label="Weekly"
						value="weekly"
						style={styles.picker}
					/>
					<Picker.Item
						label="Monthly"
						value="monthly"
						style={styles.picker}
					/>
				</Picker>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>Add Procedure Steps (Optional)</Text>
				<Icon
					name="add-box"
					color={Colors.font}
					size={32}
					onPress={() => setProcedureModalVisible(true)}
				/>
			</View>
			<View style={styles.container}>
				<Button
					title={buttonTitle}
					onPress={saveFormDataHandler}
				/>
			</View>
			<ProcedureModal
				visible={procedureModalVisible}
				procedureSteps={procedureSteps}
				onSaveProcedureSteps={saveProcedureSteps}
				onClose={() => setProcedureModalVisible(false)}
			/>
		</View>
	);
};

export default AddTaskForm;

const styles = StyleSheet.create({
	content: {
		flexGrow: 1,
		padding: 20,
		backgroundColor: Colors.background,
	},
	container: {
		marginVertical: 30,
	},
	picker: {
		color: Colors.font,
		backgroundColor: Colors.background,
		height: 110,
		// marginVertical: 5,
	},
	label: {
		marginBottom: 8,
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.font,
		textAlign: 'center',
	},
	inputContainer: {
		marginTop: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	input: {
		height: 40,
		borderColor: Colors.border,
		color: Colors.font,
		borderWidth: 1,
		marginBottom: 16,
		paddingHorizontal: 8,
	},
});
