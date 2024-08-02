import { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Priority, TasksContext } from '@/store/tasks-context';
import { addTask, addToTemplates } from '@/util/helpers';
import { Icon } from '@rneui/themed';
import TemplatesModal from '@/components/UI/TemplatesModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AddTaskForm from '@/components/UI/AddTaskForm';
import { ProcedureStep } from '@/components/UI/ProcedureModal';

const AddTask = () => {
	const [templateModalVisible, setTemplateModalVisible] =
		useState<boolean>(false);
	const [keepAsTemplate, setKeepAsTemplate] = useState<boolean>(false);
	const { userId } = useContext(TasksContext);

	const params = useLocalSearchParams();
	const dateString = typeof params.date === 'string' ? params.date : '';

	const addTaskHandler = (
		id: string,
		title: string,
		priority: Priority,
		procedureSteps: ProcedureStep[] | []
	) => {
		if (keepAsTemplate) {
			addToTemplates(id, userId, title, priority, procedureSteps);
		}

		// Logic of adding tasks
		addTask(id, userId, title, priority, procedureSteps, dateString);
		router.back();
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<GestureHandlerRootView style={styles.content}>
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
					<Button
						title="Add Task from Template"
						onPress={() => setTemplateModalVisible(true)}
					/>
				</View>
				<AddTaskForm
					buttonTitle="Add Task"
					onPressHandler={addTaskHandler}
				/>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Keep As a Template</Text>
					{!keepAsTemplate ? (
						<Icon
							name="check-box-outline-blank"
							color={Colors.font}
							size={32}
							onPress={() => {
								setKeepAsTemplate(true);
							}}
						/>
					) : (
						<Icon
							name="check-box"
							color={Colors.font}
							size={32}
							onPress={() => {
								setKeepAsTemplate(false);
							}}
						/>
					)}
				</View>

				<TemplatesModal
					visible={templateModalVisible}
					date={dateString}
					onClose={() => {
						setTemplateModalVisible(false);
					}}
				/>
			</GestureHandlerRootView>
		</SafeAreaView>
	);
};

export default AddTask;

const styles = StyleSheet.create({
	content: {
		flexGrow: 1,
		backgroundColor: Colors.background,
	},
	container: {
		marginVertical: 30,
		paddingHorizontal: 20,
	},
	label: {
		marginBottom: 8,
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.font,
		textAlign: 'center',
	},
	inputContainer: {
		marginVertical: 15,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});
