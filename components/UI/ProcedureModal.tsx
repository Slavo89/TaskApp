import {
	StyleSheet,
	Text,
	View,
	Modal,
	SafeAreaView,
	TextInput,
	Button,
	Animated,
} from 'react-native';
import { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
	GestureHandlerRootView,
	TouchableOpacity,
	RectButton,
} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors } from '@/constants/Colors';

export interface ProcedureStep {
	id: string;
	stepDescription: string;
	completed: boolean;
}

interface ProcedureModalProps {
	visible: boolean;
	procedureSteps: ProcedureStep[];
	onSaveProcedureSteps: (steps: ProcedureStep[]) => void;
	onClose: () => void;
}

const ProcedureModal: React.FC<ProcedureModalProps> = ({
	visible,
	procedureSteps,
	onSaveProcedureSteps,
	onClose,
}) => {
	const [description, setDescription] = useState('');
	const [steps, setSteps] = useState<ProcedureStep[]>([]);

	useEffect(() => {
		if (visible) {
			setSteps(procedureSteps);
		}
	}, [visible]);

	const addStepHandler = () => {
		if (description.trim() === '') {
			return;
		}
		const newStep: ProcedureStep = {
			id: steps.length.toString(),
			stepDescription: description,
			completed: false,
		};
		setSteps((prevSteps) => [...prevSteps, newStep]);
		setDescription('');
	};

	const editStepDescriptionsHandler = (text: string, id: string) => {
		setSteps((prevSteps) =>
			prevSteps.map((step) =>
				step.id === id ? { ...step, stepDescription: text } : step
			)
		);
	};

	const deleteStepHandler = (id: string) => {
		setSteps((prevSteps) => prevSteps.filter((step) => step.id !== id));
	};

	const saveAndCloseModalHandler = () => {
		const updatedSteps = steps;
		if (description.trim() !== '') {
			const newStep: ProcedureStep = {
				id: updatedSteps.length.toString(),
				stepDescription: description,
				completed: false,
			};
			updatedSteps.push(newStep);
			setDescription('');
		}

		onSaveProcedureSteps(steps);
		onClose();
	};

	const renderLeftActions = (
		_progress: Animated.AnimatedInterpolation<number>,
		dragX: Animated.AnimatedInterpolation<number>
	) => {
		const scale = dragX.interpolate({
			inputRange: [0, 80],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		});
		return (
			<RectButton style={styles.leftAction}>
				{/* Change it to some icons */}
				<Animated.View style={[{ transform: [{ scale }] }]} />
			</RectButton>
		);
	};

	const renderRightActions = (id: string) => {
		return (
			<TouchableOpacity
				style={{
					height: 40,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'red',
					paddingHorizontal: 15,
					width: '100%',
					borderRadius: 5,
				}}
				onPress={() => {
					console.log('PRESSED ' + id);
					deleteStepHandler(id);
				}}
			>
				<Text
					style={{
						fontSize: 12,
						color: '#fff',
					}}
				>
					X
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<Modal
			visible={visible}
			presentationStyle="overFullScreen"
			animationType="fade"
			onRequestClose={() => {
				onClose();
			}}
		>
			<SafeAreaView style={styles.content}>
				<KeyboardAwareScrollView
					enableOnAndroid
					enableAutomaticScroll
					keyboardDismissMode="on-drag"
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.listContainer}>
						<Text style={styles.label}>Procedure Steps</Text>
						{steps &&
							steps.map((item) => (
								<GestureHandlerRootView
									key={item.id}
									style={{ flex: 1 }}
								>
									<Swipeable
										friction={2}
										overshootFriction={8}
										rightThreshold={80}
										renderLeftActions={renderLeftActions}
										renderRightActions={() => renderRightActions(item.id)}
									>
										<Animated.View style={{ height: 60 }}>
											<TextInput
												style={styles.input}
												placeholder="Enter step description"
												placeholderTextColor={Colors.font}
												clearButtonMode="always"
												cursorColor={Colors.font}
												value={item.stepDescription}
												onChangeText={(text) =>
													editStepDescriptionsHandler(text, item.id)
												}
											/>
										</Animated.View>
									</Swipeable>
								</GestureHandlerRootView>
							))}
						<TextInput
							style={styles.input}
							placeholder="Enter step description"
							placeholderTextColor={Colors.font}
							clearButtonMode="always"
							cursorColor={Colors.font}
							value={description}
							onChangeText={(text) => setDescription(text)}
						/>
					</View>
					<View style={styles.btnContainer}>
						<Button
							title="Add next step"
							onPress={() => {
								addStepHandler();
							}}
						/>
						<Button
							title="Save and go back"
							onPress={saveAndCloseModalHandler}
						/>
						<Button
							title="Cancel"
							onPress={() => {
								setSteps(procedureSteps);
								onClose();
							}}
						/>
					</View>
				</KeyboardAwareScrollView>
			</SafeAreaView>
		</Modal>
	);
};

export default ProcedureModal;

const styles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: Colors.background,
	},
	label: {
		fontSize: 18,
		color: Colors.font,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	input: {
		height: 40,
		borderColor: Colors.border,
		borderWidth: 1,
		marginBottom: 16,
		paddingHorizontal: 8,
		color: Colors.font,
		overflow: 'hidden',
	},
	listContainer: {
		flex: 1,
		marginTop: 10,
		padding: 20,
	},
	btnContainer: {
		height: 130,
		marginVertical: 10,
		paddingHorizontal: 20,
		flex: 1,
		justifyContent: 'space-between',
	},

	leftAction: {
		flex: 1,
		backgroundColor: 'red',
		overflow: 'hidden',
		height: 40,
		justifyContent: 'flex-end',
		alignItems: 'center',
		// flexDirection: 'row',
	},
	// actionIcon: {
	// 	width: 30,
	// 	marginHorizontal: 10,
	// 	backgroundColor: 'plum',
	// 	height: 20,
	// },
});
