import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';

const NoUserScreen = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>You must be logged in to view this tab!</Text>
		</View>
	);
};

export default NoUserScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.background,
	},
	text: {
        color: Colors.font,
        fontSize: 16,
	},
});
