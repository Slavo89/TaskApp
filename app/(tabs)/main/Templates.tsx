import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	Button,
	Modal,
} from 'react-native';
import { useCallback, useContext, useState } from 'react';
import { Task, TasksContext } from '@/store/tasks-context';
import { addToTemplates } from '@/util/helpers';
import { Colors } from '@/constants/Colors';
import { router, Stack, useFocusEffect } from 'expo-router';
import AddTaskForm from '@/components/UI/AddTaskForm';
import { ProcedureStep } from '@/components/UI/ProcedureModal';
import LoadingIndicator from '@/components/UI/LoadingIndicator';
import NoUserScreen from '@/components/UI/NoUserScreen';

const Templates = () => {
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const { userId, getTemplates, templates } = useContext(TasksContext);

	const addToTemplatesHandler = (
		id: string,
		title: string,
		priority: string,
		procedureSteps: ProcedureStep[] | []
	) => {
		addToTemplates(id, userId, title, priority, procedureSteps);
		router.back();
	};

	const onPressHandler = (item: Task) => {
		const procedureSteps = JSON.stringify(item.procedure_steps);
		router.push({
			pathname: '/templates/EditTemplate',
			params: {
				id: item.id,
				title: item.title,
				priority: item.priority,
				procedure_steps: procedureSteps,
			},
		});
	};

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			getTemplates().finally(() => {
				setLoading(false);
			});
		}, [userId])
	);

	if (!userId) {
		return <NoUserScreen />;
	}

	return (
		<>
			{loading ? (
				<LoadingIndicator />
			) : (
				<View style={styles.content}>
					<Stack.Screen />
					{templates.length > 0 && (
						<FlatList
							data={templates}
							keyExtractor={(item) => item.id}
							showsVerticalScrollIndicator={false}
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() => {
										onPressHandler(item);
									}}
								>
									<View style={styles.container}>
										<Text style={styles.text}>{item.title}</Text>
										<Text style={styles.text}>
											{item.priority.toUpperCase()}
										</Text>
									</View>
								</TouchableOpacity>
							)}
						/>
					)}

					<Button
						title="Add template"
						onPress={() => setModalVisible(true)}
					/>

					<Modal
						visible={modalVisible}
						style={styles.modal}
						presentationStyle="overFullScreen"
						animationType="fade"
						onRequestClose={() => {
							setModalVisible(false);
						}}
					>
						<AddTaskForm
							onPressHandler={addToTemplatesHandler}
							buttonTitle="Save Template"
						/>
						<Button
							title="Close modal"
							onPress={() => setModalVisible(false)}
						/>
					</Modal>
				</View>
			)}
		</>
	);
};

export default Templates;

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingTop: 15,
		paddingHorizontal: 15,
		backgroundColor: Colors.background,
	},
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: Colors.headerBackground,
		marginTop: 10,
		padding: 15,
		borderWidth: 2,
		borderRadius: 5,
		borderColor: Colors.headerBackground,
	},
	text: {
		fontSize: 16,
		color: Colors.font,
	},
	emptyTemplatesContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modal: {
		flex: 1,
		backgroundColor: Colors.background,
	},
});
