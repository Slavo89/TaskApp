import { StyleSheet, ActivityIndicator, View } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';

const LoadingIndicator = () => {
	return (
		<View style={styles.loadingView}>
			<ActivityIndicator
				size="large"
				color={Colors.font}
			/>
		</View>
	);
};

export default LoadingIndicator;

const styles = StyleSheet.create({
	loadingView: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: Colors.background,
	},
});
