import { ProcedureStep } from '@/components/UI/ProcedureModal';
import { supabase } from './supabase';
import { Task } from '@/store/tasks-context';
import Toast from 'react-native-toast-message';

export const fetchUser = async () => {
	const { data, error } = await supabase.auth.getUser();
	if (error) {
		Toast.show({
			type: 'error',
			text1: 'Could not logged you in: ',
			text2: error.message,
		});
		// console.error('Error fetching user:', error.message);
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
		Toast.show({
			type: 'error',
			text1: 'Error fetching tasks: ',
			text2: error.message,
		});
		// console.error('Error fetching tasks:', error.message);
		return [];
	}
	return todos;
};

export const addTask = async (
	id: string,
	userId: string | undefined,
	title: string,
	priority: string,
	procedureSteps: ProcedureStep[] | null,
	date: string
) => {
	const { data, error } = await supabase
		.from('tasks')
		.insert([
			{
				id,
				user_id: userId,
				title,
				priority,
				procedure_steps: procedureSteps,
				created_at: date,
			},
		])
		.select();

	if (error) {
		Toast.show({
			type: 'error',
			text1: 'Error adding task: ',
			text2: error.message,
		});
		// console.error('Error adding task:', error.message);
		return null;
	}

	Toast.show({
		type: 'success',
		text1: 'Task Added',
		text2: 'Your task has been added successfully!',
	});
};

export const readTask = async (id: string) => {
	let { data, error } = await supabase.from('tasks').select('*').eq('id', id);
	if (error) {
		Toast.show({
			type: 'error',
			text1: 'Error fetching task: ',
			text2: error.message,
		});
		// console.error('Error fetching task:', error.message);
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
		Toast.show({
			type: 'error',
			text1: 'Error updating step: ',
			text2: error.message,
		});
		// console.error('Error updating step:', error.message);
		return;
	}
};

export const completeTask = async (taskId: string | undefined) => {
	const { data, error } = await supabase
		.from('tasks')
		.update({ completed: true })
		.eq('id', taskId);

	if (error) {
		Toast.show({
			type: 'error',
			text1: 'Error updating task: ',
			text2: error.message,
		});
		// console.error('Error updating task:', error.message);
		return;
	}

	Toast.show({
		type: 'success',
		text1: 'Task Completed',
		text2: 'Your task has been completed!',
	});
};
export const deleteTask = async (taskId: string | undefined) => {
	const { error } = await supabase.from('tasks').delete().eq('id', taskId);
	if (error) {
		Toast.show({
			type: 'error',
			text1: 'Error deleting task: ',
			text2: error.message,
		});
		// console.error('Error deleting task:', error.message);
		return;
	}
	Toast.show({
		type: 'success',
		text1: 'Task Deleted',
		text2: 'Your task has been deleted!',
	});
};

export const fetchTemplateTasks = async (userId: string | undefined) => {
	let { data, error } = await supabase
		.from('profiles')
		.select('templates')
		.eq('id', userId)
		.single();
	if (error) {
		Toast.show({
			type: 'error',
			text1: 'Error fetching existing templates: ',
			text2: error.message,
		});
		// console.error('Error fetching existing templates:', error.message);
		return null;
	}
	return data;
};

export const addToTemplates = async (
	id: string,
	userId: string | undefined,
	title: string,
	priority: string,
	procedureSteps: ProcedureStep[] | null
) => {
	// Fetching existing templates
	const tasks = await fetchTemplateTasks(userId);
	let templates;
	if (tasks) {
		templates = tasks.templates;
	}

	// Adding new template to list
	const newTemplate = {
		id,
		title,
		priority,
		procedure_steps: procedureSteps,
	};

	templates.push(newTemplate);

	// Updating templates
	const { data, error } = await supabase
		.from('profiles')
		.update({
			templates: templates,
		})
		.eq('id', userId)
		.select();

	if (error) {
		Toast.show({
			type: 'error',
			text1: 'Error adding templates: ',
			text2: error.message,
		});
		// console.error('Error adding templates:', error.message);
		return null;
	}

	Toast.show({
		type: 'success',
		text1: 'Template Added',
		text2: 'Your template has been added successfully!',
	});
	return data;
};

export const editTemplate = async (
	id: string,
	userId: string | undefined,
	title: string,
	priority: string,
	procedureSteps: ProcedureStep[] | null
) => {
	const tasks = await fetchTemplateTasks(userId);
	let templates;
	if (tasks) {
		templates = tasks.templates;
	}

	templates = templates.map((template: Task) => {
		if (template.id === id) {
			return {
				...template,
				title,
				priority,
				procedure_steps: procedureSteps,
			};
		}
		return template;
	});

	// Updating templates
	const { data, error } = await supabase
		.from('profiles')
		.update({
			templates: templates,
		})
		.eq('id', userId)
		.select();

	if (error) {
		Toast.show({
			type: 'error',
			text1: 'Error editing templates: ',
			text2: error.message,
		});
		// console.error('Error editing templates:', error.message);
		return null;
	}

	Toast.show({
		type: 'success',
		text1: 'Template Updated',
		text2: 'Your template has been updated!',
	});
	return data;
};

export const deleteTemplate = async (
	id: string,
	userId: string | undefined
) => {
	const tasks = await fetchTemplateTasks(userId);
	let templates;
	if (tasks) {
		templates = tasks.templates;
	}

	// Deleting template
	templates = templates.filter((template: Task) => template.id !== id);

	// Aktualizowanie templatków
	const { data, error } = await supabase
		.from('profiles')
		.update({
			templates: templates,
		})
		.eq('id', userId)
		.select();

	if (error) {
		Toast.show({
			type: 'error',
			text1: 'Error deleting template: ',
			text2: error.message,
		});
		// console.error('Error deleting template:', error.message);
		return null;
	}

	Toast.show({
		type: 'success',
		text1: 'Template Deleted',
		text2: 'Your template has been deleted!',
	});
	return data;
};
