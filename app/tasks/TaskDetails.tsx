import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	Button,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ProcedureStep } from '@/components/UI/ProcedureModal';
import { completeTask, readTask, updateTaskStep } from '../../util/helpers';
import { useEffect, useContext, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { Icon } from '@rneui/themed';
import { TimerContext } from '@/store/timer-context';

type Params = {
	[key: string]: string;
};

interface TaskDetails {
	id: string;
	title: string;
	description: string;
	priority: string;
	procedure_steps: ProcedureStep[];
	completed: boolean;
}

const TaskDetails = () => {
	const { id } = useLocalSearchParams<Params>();
	const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { startTimer, stopTimer, timer, isRunning, timerId } =
		useContext(TimerContext);

	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				setLoading(true);
				const data = await readTask(id);
				if (data && data.length > 0) {
					setTaskDetails(data[0]);
				}
				setLoading(false);
			}
		};
		fetchData();
	}, [id]);

	if (loading || !taskDetails) {
		return (
			<ActivityIndicator
				size="large"
				color="#0000ff"
			/>
		);
	}

	const toggleStepCompletion = async (
		taskId: string | undefined,
		stepId: string
	) => {
		if (taskDetails.completed) {
			return;
		}
		if (taskDetails) {
			const updatedSteps = taskDetails.procedure_steps.map((step) =>
				step.id === stepId ? { ...step, completed: !step.completed } : step
			);
			setTaskDetails({ ...taskDetails, procedure_steps: updatedSteps });
		}

		// Updating step
		const updatedSteps = taskDetails.procedure_steps.map((step) => {
			if (step.id === stepId) {
				return { ...step, completed: !step.completed };
			}
			return step;
		});

		updateTaskStep(taskId, updatedSteps);
	};

	const toggleTimer = () => {
		if (!isRunning) {
			startTimer(id);
		} else {
			stopTimer();
		}
	};

	const completeTaskHandler = (taskId: string | undefined) => {
		completeTask(taskId);
	};

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerTitle: taskDetails?.title,
					headerStyle: {
						backgroundColor: Colors.headerBackground,
					},
					headerTintColor: Colors.font,
					headerBackTitleVisible: false,
					headerRight: () =>
						!taskDetails.completed ? (
							<Button
								title={isRunning ? 'Clear timer' : 'Start timer'}
								onPress={toggleTimer}
							/>
						) : <Text style={styles.description}>Task Completed</Text>,
				}}
			/>
			{/* <View>
				<Text style={styles.description}>{taskDetails?.description}</Text>
			</View> */}

			<FlatList
				style={{ marginBottom: 20 }}
				data={taskDetails?.procedure_steps}
				keyExtractor={(item) => item.id}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => toggleStepCompletion(id, item.id)}>
						<View
							style={[
								styles.stepContainer,
								item.completed && styles.completedStepContainer,
							]}
							key={item.id}
						>
							<Text
								style={[
									styles.stepText,
									item.completed && styles.completedText,
								]}
							>
								{item.stepDescription}
							</Text>
							{item.completed && (
								<Icon
									name="check"
									color="green"
									size={14}
								/>
							)}
						</View>
					</TouchableOpacity>
				)}
				// ListEmptyComponent={<Text>No steps set</Text>}
			/>
			{!taskDetails.completed && (
				<View>
					{id === timerId && <Text style={styles.timer}>{timer}</Text>}

					<Button
						title="Complete Task"
						onPress={() => completeTaskHandler(id)}
					/>
				</View>
			)}
		</View>
	);
};

export default TaskDetails;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: Colors.background,
	},
	description: {
		fontSize: 16,
		color: Colors.font,
	},
	timer: {
		fontSize: 20,
		marginBottom: 32,
		color: Colors.font,
		textAlign: 'center',
	},
	stepContainer: {
		marginBottom: 10,
		padding: 10,
		lineHeight: 12,
		borderRadius: 5,
		borderWidth: 5,
		borderColor: 'transparent',
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
	},
	completedStepContainer: {
		borderColor: 'green',
	},
	stepText: {
		fontSize: 14,
		color: 'black',
		fontWeight: 'bold',
		marginRight: 'auto',
	},
	completedText: {
		textDecorationLine: 'line-through',
	},
});
