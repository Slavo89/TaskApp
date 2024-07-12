import { Colors } from '@/constants/Colors';
import TasksContextProvider from '@/store/tasks-context';
import TimerContextProvider from '@/store/timer-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const RootLayout = () => {
	return (
		<TasksContextProvider>
			<TimerContextProvider>
				<StatusBar style="dark" />
				<Stack>
					<Stack.Screen
						name="(tabs)"
						options={{
							headerShown: false,
							headerStyle: {
								backgroundColor: Colors.headerBackground,
							},
							headerTintColor: Colors.font,
							headerBackTitleVisible: false,
						}}
					/>
				</Stack>
			</TimerContextProvider>
		</TasksContextProvider>
	);
};

export default RootLayout;
