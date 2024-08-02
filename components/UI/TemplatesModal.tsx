import {
	StyleSheet,
	View,
	Modal,
	TouchableOpacity,
	Text,
	Alert,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@rneui/themed';
import { addTask, fetchTemplateTasks } from '@/util/helpers';
import { Task, TasksContext } from '@/store/tasks-context';
import { FlatList } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

interface TemplateModalProps {
	visible: boolean;
	onClose: () => void;
	date: string;
}

const TemplatesModal: React.FC<TemplateModalProps> = ({
	visible,
	onClose,
	date,
}) => {
	const [templates, setTemplates] = useState<Task[]>([]);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const { userId } = useContext(TasksContext);

	const templateList = async () => {
		const fetchedTasks = await fetchTemplateTasks(userId);

		if (fetchedTasks) {
			setTemplates(fetchedTasks.templates);
		}
	};
	useEffect(() => {
		if (!userId) {
			return;
		}
		if (visible) {
			templateList();
		}
	}, [userId, visible]);

	const addTaskHandler = () => {
		if (selectedTask) {
			addTask(
				selectedTask!.id,
				userId,
				selectedTask!.title,
				selectedTask!.priority,
				selectedTask!.procedure_steps,
				date
			);
			setSelectedTask(null);
			router.back();
		} else {
			Alert.alert('No Template Selected!');
		}
	};

	const closeModalHandler = () => {
		onClose();
		setSelectedTask(null);
	};

	return (
		<Modal
			visible={visible}
			presentationStyle="overFullScreen"
			onRequestClose={onClose}
			animationType="fade"
		>
			<View style={styles.content}>
				<FlatList
					data={templates}
					keyExtractor={(item) => item.id}
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => {
								setSelectedTask(item);
							}}
						>
							<View
								style={[
									styles.container,
									selectedTask?.id === item.id && styles.marked,
								]}
							>
								<Text style={styles.text}>{item.title}</Text>
								<Text style={styles.text}>{item.priority.toUpperCase()}</Text>
							</View>
						</TouchableOpacity>
					)}
					ListEmptyComponent={
						<View style={styles.emptyTemplatesContainer}>
							<Text style={styles.text}>You have no templates.</Text>
						</View>
					}
				/>
			</View>
			<View style={styles.btnContainer}>
				{templates.length > 0 && (
					<Button
						title="Add Task"
						onPress={addTaskHandler}
					/>
				)}
			</View>
			<View style={styles.btnContainer}>
				<Button
					title="Close modal"
					onPress={closeModalHandler}
				/>
			</View>
		</Modal>
	);
};

export default TemplatesModal;

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
	marked: {
		borderColor: Colors.border,
		elevation: 20,
	},
	btnContainer: {
		paddingTop: 10,
		backgroundColor: Colors.background,
	},
	emptyTemplatesContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
