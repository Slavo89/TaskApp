import {
	Dimensions,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	Pressable,
	Button,
} from 'react-native';
import { useContext, useMemo, useRef, useState } from 'react';
import Swiper from 'react-native-swiper';
import { format, add, startOfWeek, addWeeks } from 'date-fns';
import TaskList from '@/app/tasks/TaskList';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { TasksContext } from '@/store/tasks-context';
import NoUserScreen from '@/components/UI/NoUserScreen';

const { width } = Dimensions.get('screen');

const Schedule = () => {
	const [value, setValue] = useState<Date>(new Date());
	const [week, setWeek] = useState<number>(0);
	const swiper = useRef<Swiper | null>(null);
	const { userId } = useContext(TasksContext);

	const dateString = value.toLocaleDateString();

	const weeks = useMemo(() => {
		const startDate = addWeeks(startOfWeek(value, { weekStartsOn: 1 }), week);

		return [-2, -1, 0, 1, 2, 3].map((adj) => {
			return Array.from({ length: 7 }).map((_, index) => {
				const date = add(addWeeks(startDate, adj), { days: index });
				return {
					weekday: format(date, 'EEE'), // EEE for abbreviated day of week, EEEE for full day of week
					date: date,
				};
			});
		});
	}, [week]);

	const addTaskHandler = (selectedDate: string) => {
		router.push({
			pathname: '/tasks/AddTask',
			params: {
				date: selectedDate,
			},
		});
	};

	if (!userId) {
		return <NoUserScreen />;
	}

	return (
		<SafeAreaView style={styles.content}>
			<View style={styles.picker}>
				<Swiper
					index={2}
					ref={swiper}
					showsPagination={false}
					loop={false}
				>
					{weeks.map((dates, index) => (
						<View
							style={styles.itemRow}
							key={index}
						>
							{dates.map((item, dateIndex) => {
								const isActive =
									value.toDateString() === item.date.toDateString();

								return (
									<Pressable
										style={styles.itemContainer}
										onPress={() => setValue(item.date)}
										key={dateIndex}
									>
										<View
											style={[
												styles.item,
												isActive && {
													backgroundColor: '#111',
													borderColor: '#fff',
												},
											]}
										>
											<Text
												style={[
													styles.itemWeekday,
													isActive && {
														color: '#FCA311',
													},
												]}
											>
												{item.weekday}
											</Text>
											<Text
												style={[
													styles.itemDate,
													isActive && {
														color: '#FCA311',
													},
												]}
											>
												{item.date.getDate()}
											</Text>
										</View>
									</Pressable>
								);
							})}
						</View>
					))}
				</Swiper>
			</View>

			<View style={styles.tasksConteiner}>
				<Text style={styles.contentText}>{value.toDateString()}</Text>

				<View style={styles.placeholder}>
					<View style={styles.placeholderContent}>
						<TaskList date={dateString} />
					</View>
				</View>
				<Button
					title="Add Task"
					onPress={() => addTaskHandler(dateString)}
				/>
			</View>
		</SafeAreaView>
	);
};

export default Schedule;

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingVertical: 16,
		backgroundColor: Colors.background,
	},
	picker: {
		flex: 1,
		maxHeight: 74,
		flexDirection: 'row',
		alignItems: 'center',
	},
	itemRow: {
		width,
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginHorizontal: 1,
	},
	itemContainer: {
		flex: 1,
		height: 60,
	},
	item: {
		flex: 1,
		marginHorizontal: 4,
		paddingVertical: 6,
		paddingHorizontal: 4,
		borderWidth: 1,
		borderColor: Colors.border,
		borderRadius: 8,
		alignItems: 'center',
		flexDirection: 'column',
	},
	itemWeekday: {
		fontSize: 13,
		fontWeight: '500',
		color: Colors.font,
		marginBottom: 4,
	},
	itemDate: {
		fontSize: 15,
		fontWeight: '600',
		color: Colors.font,
	},
	tasksConteiner: {
		flex: 1,
		// paddingVertical: 24,
		paddingHorizontal: 16,
	},
	contentText: {
		fontSize: 17,
		fontWeight: '600',
		color: '#E5E5E5',
		marginBottom: 12,
	},
	placeholder: {
		flex: 1,
		height: 400,
		marginBottom: 15,
	},
	placeholderContent: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		borderStyle: 'dotted',
		borderRadius: 9,
	},
});
