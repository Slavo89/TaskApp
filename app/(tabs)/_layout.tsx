import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TabsLayout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {
					backgroundColor: Colors.background,
				},
				// tabBarInactiveBackgroundColor: Colors.background,
				// tabBarActiveBackgroundColor: Colors.background,
				tabBarActiveTintColor: '#fff',
				tabBarInactiveTintColor: '#9c9c9c',
				tabBarHideOnKeyboard: true,
				tabBarLabelPosition: 'beside-icon',
			}}
		>
			<Tabs.Screen
				name="calendar/Schedule"
				options={{
					headerTitle: 'Your Schedule',
					title: 'Schedule',
					tabBarIcon: ({ color }) => (
						<FontAwesome
							name="calendar"
							size={18}
							color={color}
						/>
					),
					headerStyle: {
						backgroundColor: Colors.headerBackground,
					},
					headerTintColor: Colors.font,
				}}
			/>

			<Tabs.Screen
				name="calendar/SecondPage"
				options={{
					headerTitle: 'Second Page',
					title: 'Second',
					tabBarIcon: ({ color }) => (
						<FontAwesome
							name="question"
							size={18}
							color={color}
						/>
					),
					headerStyle: {
						backgroundColor: Colors.headerBackground,
					},
					headerTintColor: Colors.font,
				}}
			/>

			<Tabs.Screen
				name="index"
				options={{
					headerTitle: 'User Page',
					title: 'User Page',
					tabBarIcon: ({ color }) => (
						<FontAwesome
							size={18}
							name="user"
							color={color}
						/>
					),
					headerStyle: {
						backgroundColor: Colors.headerBackground,
					},
					headerTintColor: Colors.font,
				}}
			/>
		</Tabs>
	);
};

export default TabsLayout;
