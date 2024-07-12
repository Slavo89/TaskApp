import { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchUser, fetchUserTasks } from '../util/helpers';

export type Priority = 'daily' | 'weekly' | 'monthly';

export interface Task {
	id: string;
	title: string;
	description: string;
	// date: Date;
	priority: Priority;
	procedure_steps: [] | null;
	completed: boolean;
}

interface TasksContextProviderProps {
	children: ReactNode;
}

interface TasksContextProps {
	userId: string | undefined;
	setUserId: (userId: string | undefined) => void;
	tasks: Task[];
	setTasks: (tasks: Task[]) => void;
	getTasks: () => void;
}

export const TasksContext = createContext<TasksContextProps>({
	userId: undefined,
	tasks: [] as Task[],
	setUserId: () => {},
	setTasks: () => {},
	getTasks: () => {},
});

export const TasksContextProvider: React.FC<TasksContextProviderProps> = ({
	children,
}) => {
	const [userId, setUserId] = useState<string | undefined>(undefined);
	const [tasks, setTasks] = useState<Task[]>([]);

	const refreshTasks = async () => {
		if (!userId) return;
		const fetchedTasks = await fetchUserTasks(userId);
		if (fetchedTasks) {
			setTasks(fetchedTasks);
		}
	};

	useEffect(() => {
		const getUserId = async () => {
			const fetchedUser = await fetchUser();
			if (fetchedUser) {
				setUserId(fetchedUser.user.id);
				// console.log(fetchedUser);
			}
		};

		getUserId();
	}, []);

	const getTasks = async () => {
		const fetchedTasks = await fetchUserTasks(userId);
		if (fetchedTasks) {
			setTasks(fetchedTasks);
		}
	};

	useEffect(() => {
		if (!userId) {
			return;
		}
		getTasks();
	}, [userId]);

	const value = {
		userId: userId,
		tasks: tasks,
		setUserId: setUserId,
		setTasks: setTasks,
		getTasks: getTasks,
	};

	return (
		<TasksContext.Provider value={value}>{children}</TasksContext.Provider>
	);
};

export default TasksContextProvider;
