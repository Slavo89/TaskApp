import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useContext } from 'react';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { TimerContext } from '@/store/timer-context';

interface TaskItemProps {
	id: string | undefined;
	title: string;
	priority: string;
	procedure_steps: [] | null;
	completed: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ id, title, completed }) => {
	const { timerId, timer } = useContext(TimerContext);

	const onPressHandler = () => {
		router.push({
			pathname: '/tasks/TaskDetails',
			params: {
				id,
				title,
			},
		});
	};

	return (
		<Pressable
			style={[styles.content, completed && styles.completed]}
			onPress={onPressHandler}
		>
			<View style={styles.container}>
				<Text style={styles.title}>{title}</Text>
				{timerId == id && timer !== '00.00' && (
					<Text style={styles.timer}>{timer}</Text>
				)}
			</View>
		</Pressable>
	);
};

export default TaskItem;

const styles = StyleSheet.create({
	content: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginTop: 10,
		backgroundColor: Colors.headerBackground,
		borderRadius: 8,
		position: 'static',
	},
	completed: {
		backgroundColor: 'grey',
		opacity: 0.3,
	},
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	title: {
		fontSize: 16,
		fontWeight: 'bold',
		color: Colors.font,
	},
	timer: {
		// fontSize: 20,
		// marginBottom: 32,
		color: Colors.font,
		// textAlign: 'center',
	},
});
