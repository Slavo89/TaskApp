import { useState, useEffect } from 'react';
import { supabase } from '../../util/supabase';
import Auth from '../../components/Auth/Auth';
import Account from '../../components/Auth/Account';
import { View, StyleSheet } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { Colors } from '@/constants/Colors';

const HomePage = () => {
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<View style={styles.container}>
			{session && session.user ? (
				<View>
					<Account
						key={session.user.id}
						session={session}
					/>
				</View>
			) : (
				<Auth />
			)}
		</View>
	);
};

export default HomePage;

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: Colors.background },
});
