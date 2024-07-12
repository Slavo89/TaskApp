import React, { useContext, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	Alert,
	SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Stack, router } from 'expo-router';
import AddProcedureModal, {
	ProcedureStep,
} from '@/components/UI/ProcedureModal';
import { Colors } from '@/constants/Colors';
import { Priority, TasksContext } from '@/store/tasks-context';
import { addTask } from '@/util/helpers';

function generateBigIntId() {
	const randomInt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
	return BigInt(randomInt).toString();
}

const AddTask = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [priority, setPriority] = useState<Priority>('weekly');
	const [procedureSteps, setProcedureSteps] = useState<ProcedureStep[]>([]);
	const { userId, getTasks } = useContext(TasksContext);

	const saveProcedureSteps = (steps: ProcedureStep[]) => {
		setProcedureSteps(steps);
	};
	const addTaskHandler = () => {
		// Form Validation
		if (title.trim() === '' || description.trim() === '') {
			Alert.alert(
				'Validation Error',
				'Both title and description are required.'
			);
			return;
		}
		if (title.trim() === '') {
			Alert.alert('Validation Error', 'Title is required');
			return;
		}
		if (description.trim() === '') {
			Alert.alert('Validation Error', 'Description is required');
			return;
		}

		const id = generateBigIntId();

		// Logic of adding tasks
		addTask(id, userId, title, description, priority, procedureSteps);
		getTasks();
		// Resseting form fields
		setTitle('');
		setDescription('');
		setPriority('weekly');
		setProcedureSteps([]);
		router.back();
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.content}>
				<Stack.Screen
					options={{
						headerTitle: 'Add Task',
						headerStyle: {
							backgroundColor: Colors.headerBackground,
						},
						headerTintColor: Colors.font,
						headerBackTitleVisible: false,
					}}
				/>
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
					<Text style={styles.label}>Description</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter description"
						placeholderTextColor={Colors.font}
						clearButtonMode="always"
						cursorColor={Colors.font}
						value={description}
						onChangeText={setDescription}
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
						{/* <Picker.Item
							label="Important"
							value="important"
							style={styles.picker}
						/> */}
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
						{/* <Picker.Item
							label="Keep"
							value="keep"
							style={styles.picker}
						/>
						<Picker.Item
							label="Self Improvement"
							value="self-improvement"
							style={styles.picker}
						/> */}
					</Picker>
				</View>

				<View style={styles.procedureInputContainer}>
					<Text style={styles.label}>Add Procedure Steps (Optional)</Text>
					<Button
						title="+"
						onPress={() => setModalVisible(true)}
					/>
				</View>
				<View style={styles.container}>
					<Button
						title="Add Task"
						onPress={addTaskHandler}
					/>
				</View>

				<AddProcedureModal
					visible={modalVisible}
					procedureSteps={procedureSteps}
					onSaveProcedureSteps={saveProcedureSteps}
					onClose={() => {
						setModalVisible(false);
					}}
				/>
			</View>
		</SafeAreaView>
	);
};

export default AddTask;

const styles = StyleSheet.create({
	content: {
		flexGrow: 1,
		padding: 20,
		backgroundColor: Colors.background,
	},
	container: {
		marginVertical: 15,
	},
	label: {
		marginBottom: 8,
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.font,
		textAlign: 'center',
	},
	input: {
		height: 40,
		borderColor: Colors.border,
		color: Colors.font,
		borderWidth: 1,
		marginBottom: 16,
		paddingHorizontal: 8,
	},
	picker: {
		color: Colors.font,
		backgroundColor: Colors.background,
		height: 110,
		// marginVertical: 5,
	},
	procedureInputContainer: {
		marginTop: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
});
