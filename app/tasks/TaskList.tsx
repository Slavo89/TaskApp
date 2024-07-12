import { StyleSheet, Text, View, SectionList, Pressable } from 'react-native';
import { useState, useContext } from 'react';
import TaskItem from './TaskItem';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { TasksContext, Task, Priority } from '@/store/tasks-context';



const TaskList = () => {
	const { tasks } = useContext(TasksContext);
	const [expandedSections, setExpandedSections] = useState<
		Record<Priority, boolean>
	>({
		daily: false,
		weekly: false,
		monthly: false,
	});
	// console.log(tasks[0]);

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

	tasks.forEach((task) => {
		groupedTasks[task.priority].push(task);
	});

	const sections = Object.keys(groupedTasks).map((priority) => ({
		title: priority,
		data: groupedTasks[priority as Priority],
	}));

	return (
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
								description={item.description}
								// date={item.date}
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
						style={({ pressed }) => [styles.button, pressed && styles.pressed]}
					>
						<Text style={styles.header}>{title.toUpperCase()}</Text>
					</Pressable>
				)}
			/>
		</View>
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
