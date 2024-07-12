import { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimerContextProviderProps {
	children: ReactNode;
}

interface TimerContextProps {
	timer: string;
	timerId: string | undefined;
	isRunning: boolean;
	startTimer: (id: string | undefined) => void;
	stopTimer: () => void;
}

export const TimerContext = createContext<TimerContextProps>({
	timer: '00.00',
	timerId: undefined,
	isRunning: false,
	startTimer: () => {},
	stopTimer: () => {},
});

export const TimerContextProvider: React.FC<TimerContextProviderProps> = ({
	children,
}) => {
	const [timer, setTimer] = useState(0);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [formattedTimer, setFormattedTimer] = useState('00:00');
	const [timerId, setTimerId] = useState<string | undefined>(undefined);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		const loadTimer = async () => {
			try {
				const storedStartTime = await AsyncStorage.getItem('startTime');
				if (storedStartTime !== null) {
					const parsedStartTime = JSON.parse(storedStartTime);
					setStartTime(parsedStartTime);

					if (parsedStartTime !== null) {
						const elapsedTime = Math.floor(
							(Date.now() - parsedStartTime) / 1000
						);
						setTimer(elapsedTime);
						setIsRunning(true);
					}
				}
			} catch (error) {
				console.error('Failed to load timer from storage: ', error);
			}
		};

		loadTimer();
	}, []);

	useEffect(() => {
		const storeTimer = async () => {
			try {
				await AsyncStorage.setItem('timer', JSON.stringify(timer));
			} catch (error) {
				console.error('Failed to save timer to storage: ', error);
			}
		};

		storeTimer();
	}, [timer]);

	useEffect(() => {
		if (isRunning) {
			const interval = setInterval(() => {
				if (startTime !== null) {
					const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
					setFormattedTimer(formatTime(elapsedTime));
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [isRunning, startTime]);


	const startTimer = async (id: string | undefined) => {
		setTimerId(id);
		const currentTime = Date.now();
		try {
			await AsyncStorage.setItem('startTime', JSON.stringify(currentTime));
			setStartTime(currentTime);
			setIsRunning(true);
		} catch (error) {
			console.error('Failed to save start time to storage:', error);
		}
	};

	const stopTimer = async () => {
		setIsRunning(false);
		setFormattedTimer('00.00')
		setStartTime(null);
		try {
			await AsyncStorage.removeItem('startTime');
		} catch (error) {
			console.error('Failed to remove start time from storage:', error);
		}
	};

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`;
	};

	const value = {
		timer: formattedTimer,
		timerId,
		isRunning,
		startTimer,
		stopTimer,
	};

	return (
		<TimerContext.Provider value={value}>{children}</TimerContext.Provider>
	);
};

export default TimerContextProvider;
