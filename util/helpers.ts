import { ProcedureStep } from '@/components/UI/ProcedureModal';
import { supabase } from './supabase';

export const fetchUser = async () => {
	const { data, error } = await supabase.auth.getUser();
	if (error) {
		console.error('Error fetching user:', error.message);
		return null;
	}
	return data;
};

export const fetchUserTasks = async (userId: string | undefined) => {
	const { data: todos, error } = await supabase
		.from('tasks')
		.select()
		.eq('user_id', userId);

	if (error) {
		console.error('Error fetching tasks:', error.message);
		return [];
	}
	return todos;
};

export const addTask = async (
	id: string,
	userId: string | undefined,
	title: string,
	description: string,
	priority: string,
	procedureSteps: ProcedureStep[] | null
) => {
	const { data, error } = await supabase
		.from('tasks')
		.insert([
			{
				id,
				user_id: userId,
				title,
				description,
				priority,
				procedure_steps: procedureSteps,
			},
		])
		.select();
	if (error) {
		console.error('Error adding task:', error.message);
		return null;
	}
	// console.log(data);
	return data;
};

export const readTask = async (id: string) => {
	let { data, error } = await supabase.from('tasks').select('*').eq('id', id);
	if (error) {
		console.error('Error fetching task:', error.message);
		return;
	}

	return data;
};

export const updateTaskStep = async (
	taskId: string | undefined,
	updatedData: ProcedureStep[]
) => {
	const { data, error } = await supabase
		.from('tasks')
		.update({ procedure_steps: updatedData })
		.eq('id', taskId);

	if (error) {
		console.error('Error updating step:', error.message);
		return;
	}
};

export const completeTask = async (taskId: string | undefined) => {
	const { data, error } = await supabase
		.from('tasks')
		.update({ completed: true })
		.eq('id', taskId);

	if (error) {
		console.error('Error updating step:', error.message);
		return;
	}
};