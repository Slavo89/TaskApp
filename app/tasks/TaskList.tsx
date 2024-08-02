import { StyleSheet, Text, SectionList, View, Pressable } from 'react-native';
import { useState, useContext, useCallback } from 'react';
import TaskItem from './TaskItem';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { TasksContext, Task, Priority } from '@/store/tasks-context';
import { useFocusEffect } from 'expo-router';
import LoadingIndicator from '@/components/UI/LoadingIndicator';

interface Props {
	date: string;
}
const TaskList = ({ date }: Props) => {
	const { tasks, getTasks } = useContext(TasksContext);
	const [loading, setLoading] = useState<boolean>(false);
	const [expandedSections, setExpandedSections] = useState<
		Record<Priority, boolean>
	>({
		daily: false,
		weekly: false,
		monthly: false,
	});

	const toggleSectionHandler = (priority: Priority) => {
		setExpandedSections((prev) => ({
			...prev,
			[priority]: !prev[priority],
		}));
	};

	const groupedTasks: Record<Priority, Task[]> = {
		daily: [],
		weekly: [],
		monthly: [],
	};

	useFocusEffect(
		useCallback(() => {
			setLoading(true);
			getTasks().finally(() => {
				setLoading(false);
			});
		}, [date])
	);

	tasks.forEach((task) => {
		if (task.priority === 'daily' && task.created_at === date) {
			groupedTasks[task.priority].push(task);
		} else if (task.priority !== 'daily' && task.completed === false) {
			groupedTasks[task.priority].push(task);
		}
	});

	const sections = Object.keys(groupedTasks).map((priority) => ({
		title: priority,
		data: groupedTasks[priority as Priority],
	}));

	return (
		<>
			{loading ? (
				<LoadingIndicator />
			) : (
				<View style={styles.content}>
					<SectionList
						sections={sections}
						showsVerticalScrollIndicator={false}
						stickySectionHeadersEnabled={false}
						keyExtractor={(item) => item.id}
						renderItem={({ item, section }) => {
							if (!expandedSections[section.title as Priority]) {
								return null;
							}
							return (
								<Animated.View entering={SlideInLeft}>
									<TaskItem
										id={item.id}
										title={item.title}
										priority={item.priority}
										procedure_steps={item.procedure_steps}
										completed={item.completed}
									/>
								</Animated.View>
							);
						}}
						renderSectionHeader={({ section: { title } }) => (
							<Pressable
								onPress={() => {
									toggleSectionHandler(title as Priority);
								}}
								style={({ pressed }) => [
									styles.button,
									pressed && styles.pressed,
								]}
							>
								<Text style={styles.header}>{title.toUpperCase()}</Text>
							</Pressable>
						)}
					/>
				</View>
			)}
		</>
	);
};

export default TaskList;

const styles = StyleSheet.create({
	content: {
		flex: 1,
		padding: 16,
	},
	button: {
		paddingVertical: 12,
		marginTop: 35,
		backgroundColor: Colors.headerBackground,
		borderRadius: 8,
		// borderWidth: 2,
		// borderColor: '#000',
		overflow: 'hidden',
	},
	pressed: {
		opacity: 0.75,
	},

	header: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.font,
	},
});
