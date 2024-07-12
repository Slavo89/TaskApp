import { useState, useEffect } from 'react';
import { supabase } from '../../util/supabase';
import Auth from '../../components/Auth/Auth';
import Account from '../../components/Auth/Account';
import { View } from 'react-native';
import { Session } from '@supabase/supabase-js';


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
		<View>
			{session && session.user ? (
				<Account
					key={session.user.id}
					session={session}
				/>
			) : (
				<Auth />
			)}
		</View>
	);
};

export default HomePage;
