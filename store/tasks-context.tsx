import { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchTemplateTasks, fetchUser, fetchUserTasks } from '../util/helpers';
import { Text, View } from 'react-native';

export type Priority = 'daily' | 'weekly' | 'monthly';

export interface Task {
	id: string;
	title: string;
	priority: Priority;
	procedure_steps: [] | null;
	completed: boolean;
	created_at: string;
}

interface TasksContextProviderProps {
	children: ReactNode;
}

interface TasksContextProps {
	userId: string | undefined;
	setUserId: (userId: string | undefined) => void;
	tasks: Task[];
	setTasks: (tasks: Task[]) => void;
	getTasks: () => Promise<void>;
	templates: Task[];
	setTemplates: (tasks: Task[]) => void;
	getTemplates: () => Promise<void>;
}

export const TasksContext = createContext<TasksContextProps>({
	userId: undefined,
	tasks: [] as Task[],
	setUserId: () => {},
	setTasks: () => {},
	getTasks: async () => {},
	templates: [] as Task[],
	setTemplates: () => {},
	getTemplates: async () => {},
});

export const TasksContextProvider: React.FC<TasksContextProviderProps> = ({
	children,
}) => {
	const [userId, setUserId] = useState<string | undefined>(undefined);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [templates, setTemplates] = useState<Task[]>([]);

	useEffect(() => {
		const getUserId = async () => {
			const fetchedUser = await fetchUser();
			if (fetchedUser) {
				setUserId(fetchedUser.user.id);
			}
		};

		getUserId();
	}, []);

	const getTasks = async () => {
		if (!userId) return;

		const fetchedTasks = await fetchUserTasks(userId);

		if (fetchedTasks) {
			setTasks(fetchedTasks);
		}
	};

	const getTemplates = async () => {
		if (!userId) return;

		const fetchedTemplates = await fetchTemplateTasks(userId);

		if (fetchedTemplates) {
			setTemplates(fetchedTemplates.templates);
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
		templates: templates,
		setTemplates: setTemplates,
		getTemplates: getTemplates,
	};

	return (
		<TasksContext.Provider value={value}>{children}</TasksContext.Provider>
	);
};

export default TasksContextProvider;
