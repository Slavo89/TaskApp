import { useState, useEffect, useContext } from 'react';
import { supabase } from '../../util/supabase';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Session } from '@supabase/supabase-js';
import { TasksContext } from '@/store/tasks-context';
import { Colors } from '@/constants/Colors';

export default function Account({ session }: { session: Session }) {
	const [loading, setLoading] = useState(true);
	const { setUserId, setTasks } = useContext(TasksContext);
	const [username, setUsername] = useState('');

	useEffect(() => {
		if (session) getProfile();
	}, [session]);

	async function getProfile() {
		try {
			setLoading(true);
			if (!session?.user) throw new Error('No user on the session!');

			const { data, error, status } = await supabase
				.from('profiles')
				.select(`username`)
				.eq('id', session?.user.id)
				.single();
			if (error && status !== 406) {
				throw error;
			}

			if (data) {
				setUsername(data.username);
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	}

	const signOutHandler = () => {
		setTasks([]);
		setUserId('');
		supabase.auth.signOut();
	};

	async function updateProfile({ username }: { username: string }) {
		try {
			setLoading(true);
			if (!session?.user) throw new Error('No user on the session!');

			const updates = {
				id: session?.user.id,
				username,
				updated_at: new Date(),
			};

			const { error } = await supabase.from('profiles').upsert(updates);

			if (error) {
				throw error;
			}
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert(error.message);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Hello {username}!</Text>
			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Input
					label="Email"
					value={session?.user?.email}
					disabled
					style={styles.input}
					cursorColor={Colors.font}
				/>
			</View>
			<View style={styles.verticallySpaced}>
				<Input
					label="Username"
					value={username || ''}
					onChangeText={(text) => setUsername(text)}
					style={styles.input}
					cursorColor={Colors.font}
				/>
			</View>

			<View style={[styles.verticallySpaced, styles.mt20]}>
				<Button
					title={loading ? 'Loading ...' : 'Update'}
					onPress={() => updateProfile({ username })}
					disabled={loading}
				/>
			</View>

			<View style={styles.verticallySpaced}>
				<Button
					title="Sign Out"
					onPress={signOutHandler}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 40,
		padding: 12,
	},
	verticallySpaced: {
		paddingTop: 4,
		paddingBottom: 4,
		alignSelf: 'stretch',
	},
	mt20: {
		marginTop: 20,
	},
	input: {
		color: Colors.font,
		marginLeft: 10,
	},
	heading: {
		color: Colors.font,
		fontSize: 20,
		textAlign: 'center',
		marginBottom: 50,
	},
});
