import { Colors } from '@/constants/Colors';
import TasksContextProvider from '@/store/tasks-context';
import TimerContextProvider from '@/store/timer-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

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
				<Toast />
			</TimerContextProvider>
		</TasksContextProvider>
	);
};

export default RootLayout;
