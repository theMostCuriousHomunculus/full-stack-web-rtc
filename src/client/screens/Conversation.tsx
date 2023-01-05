import { useContext } from 'react';

import Paper from '@mui/material/Paper/index.js';
import Typography from '@mui/material/Typography/index.js';
import { useParams } from 'react-router-dom';

import AutoScrollMessages from '../components/AutoScrollMessages.jsx';
import CameraFeed from '../components/CameraFeed.jsx';
import ConversationActions from '../components/ConversationActions.jsx';
import { ConversationContext } from '../contexts/conversation.jsx';
import Peer from '../components/Peer.jsx';
import { PreferencesContext } from '../contexts/preferences.jsx';
import { UserContext } from '../contexts/user.jsx';
import multilingualDictionary from '../constants/multilingual-dictionary.js';

const Conversation = (): JSX.Element => {
	const {
		peersRef,
		textMessages,
		setTextMessages,
	} = useContext(ConversationContext);
	const { languageState } = useContext(PreferencesContext);
	const {
		userState: {
			authenticated,
			userID,
		},
	} = useContext(UserContext);
	const { participantIDs } = useParams();

	if (
		!authenticated
		|| !participantIDs?.includes(userID)
	) {
		return (
			<Paper>
				<Typography variant="h1">
					{multilingualDictionary.AccessDenied[languageState]}
				</Typography>
			</Paper>
		);
	}

	return (
		<>
			<Paper sx={{ position: 'relative' }}>
				<ConversationActions />
				<CameraFeed />
				{Object
					.entries(peersRef.current)
					.map(
						([socketID, connection]) => (
							<Peer
								connection={connection}
								key={socketID}
							/>
						),
					)}
			</Paper>
			<AutoScrollMessages
				messages={textMessages}
				submitFunction={(message) => {
					setTextMessages(
						(prevState) => {
							return [...prevState, message].sort(
								(a, b) => {
									if (a.timestamp > b.timestamp) return -1;
									if (a.timestamp < b.timestamp) return 1;
									return 0;
								},
							);
						},
					);
					Object
						.values(peersRef.current)
						.forEach(
							({ textChatChannel }) => textChatChannel?.send(JSON.stringify(message)),
						);
				}}
			/>
		</>
	);
};

export default Conversation;
