import { StyleSheet, Button, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Priority, Task, TasksContext } from '@/store/tasks-context';
import { ProcedureStep } from '@/components/UI/ProcedureModal';
import AddTaskForm from '@/components/UI/AddTaskForm';
import { Colors } from '@/constants/Colors';
import { deleteTemplate, editTemplate } from '@/util/helpers';
import Toast from 'react-native-toast-message';

const EditTemplate = () => {
	const params = useLocalSearchParams();
	const { userId } = useContext(TasksContext);
	const [template, setTemplate] = useState({
		id: params.id as string,
		title: params.title as string,
		priority: params.priority as Priority,
		procedure_steps: params.procedure_steps
			? JSON.parse(params.procedure_steps as string)
			: [],
	});

	const editTemplateHandler = (
		id: string,
		title: string,
		priority: Priority,
		procedureSteps: ProcedureStep[] | []
	) => {
		editTemplate(id, userId, title, priority, procedureSteps);
		router.back();
	};

	const deleteTemplateHandler = (id: string) => {
		deleteTemplate(id, userId);
		router.back();
	};

	return (
		<View style={styles.content}>
			<Stack.Screen
				options={{
					headerTitle: `Edit ${params.title}`,
					headerStyle: {
						backgroundColor: Colors.headerBackground,
					},
					headerTintColor: Colors.font,
					headerBackTitleVisible: false,
				}}
			/>

			<AddTaskForm
				editingId={template.id}
				editingTitle={template.title}
				editingPriority={template.priority}
				// editingProcedureSteps={JSON.parse(template.procedure_steps)}
				editingProcedureSteps={template.procedure_steps}
				buttonTitle="Edit Template"
				onPressHandler={editTemplateHandler}
			/>
			<Button
				title="Delete Template"
				onPress={() => deleteTemplateHandler(template.id)}
				// onPress={() => console.log('')}
			/>
		</View>
	);
};

export default EditTemplate;

const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
});
