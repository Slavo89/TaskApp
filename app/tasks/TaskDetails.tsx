import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	Button,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ProcedureStep } from '@/components/UI/ProcedureModal';
import {
	completeTask,
	deleteTask,
	readTask,
	updateTaskStep,
} from '../../util/helpers';
import { useEffect, useContext, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { Icon } from '@rneui/themed';
import { TimerContext } from '@/store/timer-context';
import LoadingIndicator from '@/components/UI/LoadingIndicator';

type Params = {
	[key: string]: string;
};

interface TaskDetails {
	id: string;
	title: string;
	priority: string;
	procedure_steps: ProcedureStep[];
	completed: boolean;
}

const TaskDetails = () => {
	const { id, title } = useLocalSearchParams<Params>();
	const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
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

	// if (loading || !taskDetails) {
	// 	return (
	// 		<View style={styles.container}>
	// 			<Stack.Screen
	// 				options={{
	// 					headerTitle: taskDetails?.title,
	// 					headerStyle: {
	// 						backgroundColor: Colors.headerBackground,
	// 					},
	// 					headerTintColor: Colors.font,
	// 					headerBackTitleVisible: false,
	// 				}}
	// 			/>
	// 			<ActivityIndicator
	// 				size="large"
	// 				color={Colors.font}
	// 			/>
	// 		</View>
	// 	);
	// }

	const toggleStepCompletion = async (
		taskId: string | undefined,
		stepId: string
	) => {
		if (taskDetails?.completed) {
			return;
		}
		if (taskDetails) {
			const updatedSteps = taskDetails.procedure_steps.map((step) =>
				step.id === stepId ? { ...step, completed: !step.completed } : step
			);
			setTaskDetails({ ...taskDetails, procedure_steps: updatedSteps });
		}

		// Updating step
		const updatedSteps = taskDetails!.procedure_steps.map((step) => {
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
		router.back();
	};

	const deleteTaskHandler = (taskId: string | undefined) => {
		deleteTask(taskId);
		router.back();
	};

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerTitle: title,
					headerStyle: {
						backgroundColor: Colors.headerBackground,
					},
					headerTintColor: Colors.font,
					headerBackTitleVisible: false,
					headerRight: () =>
						!taskDetails?.completed ? (
							<Button
								title={isRunning ? 'Clear timer' : 'Start timer'}
								onPress={toggleTimer}
							/>
						) : (
							<Text style={styles.description}>Task Completed</Text>
						),
				}}
			/>

			{loading ? (
				<LoadingIndicator />
			) : (
				<View style={styles.content}>
					<FlatList
						style={{ marginBottom: 20 }}
						data={taskDetails?.procedure_steps}
						keyExtractor={(item) => item.id}
						showsVerticalScrollIndicator={false}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => toggleStepCompletion(id, item.id)}
							>
								<View
									style={[
										styles.stepContainer,
										item.completed && styles.completedStepContainer,
									]}
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
						ListEmptyComponent={
							<View style={styles.noProcedureContainer}>
								<Text style={styles.description}>No procedure added.</Text>
							</View>
						}
					/>
					{!taskDetails?.completed && (
						<View>
							{id === timerId && <Text style={styles.timer}>{timer}</Text>}

							<Button
								title="Complete Task"
								onPress={() => completeTaskHandler(id)}
							/>
						</View>
					)}
					<View style={{ marginTop: 5 }}>
						<Button
							title="Delete Task"
							onPress={() => deleteTaskHandler(id)}
						/>
					</View>
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
	content: {
		flex: 1,
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
	noProcedureContainer: {
		flex: 1,
		flexGrow: 1,
		marginTop: '80%',
		alignItems: 'center',
	},
});
