import { useState } from 'react';

import {
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';
import {
	Route,
	Routes,
} from 'react-router-dom';
import { httpBatchLink } from '@trpc/client';

import './App.css';

import About from './screens/About.jsx';
import Conversation from './screens/Conversation.jsx';
import { ConversationProvider } from './contexts/conversation.jsx';
import Navigation from './components/Navigation.jsx';
import { PreferencesProvider } from './contexts/preferences.jsx';
import Profile from './screens/Profile.jsx';
import { UserProvider } from './contexts/user.js';
import { trpc } from './hooks/trpc.js';

function App() {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					headers() {
						return {
							authorization: localStorage.getItem('accessToken')
								? `Bearer ${localStorage.getItem('accessToken')}`
								: undefined, 
						};
					},
					url: 'http://localhost:6969/trpc',
				}),
			],
		}));

	return (
		<trpc.Provider
			client={trpcClient}
			queryClient={queryClient}
		>
			<QueryClientProvider client={queryClient}>
				<PreferencesProvider>
					<UserProvider>
						<Navigation>
							<main>
								<Routes>
									<Route
										element={<About />}
										path="/"
									/>
									<Route
										element={
											<ConversationProvider>
												<Conversation />
											</ConversationProvider>
										}
										path="/conversation/:participantIDs"
									/>
									<Route
										element={<Profile />}
										path="/profile/:profileID"
									/>
								</Routes>
							</main>
						</Navigation>
					</UserProvider>
				</PreferencesProvider>
			</QueryClientProvider>
		</trpc.Provider>
	);
}

export default App;
