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
				tabBarActiveTintColor: '#fff',
				tabBarInactiveTintColor: '#9c9c9c',
				tabBarHideOnKeyboard: true,
				tabBarLabelPosition: 'beside-icon',
			}}
		>
			<Tabs.Screen
				name="main/Schedule"
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
				name="main/Templates"
				options={{
					headerTitle: 'Templates Manager',
					title: 'Templates',
					tabBarIcon: ({ color }) => (
						<FontAwesome
							name="folder-open"
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
