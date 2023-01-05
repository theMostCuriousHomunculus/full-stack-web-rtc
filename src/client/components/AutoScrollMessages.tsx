import {
	ReactNode,
	useContext,
	useRef,
	useState,
} from 'react';
import Button from '@mui/material/Button/index.js';
import Card from '@mui/material/Card/index.js';
import CardActions from '@mui/material/CardActions/index.js';
import CardContent from '@mui/material/CardContent/index.js';
import CardHeader from '@mui/material/CardHeader/index.js';
import Paper from '@mui/material/Paper/index.js';
import SendIcon from '@mui/icons-material/Send.js';
import TextField from '@mui/material/TextField/index.js';
import Typography from '@mui/material/Typography/index.js';
import { useTheme } from '@mui/material/styles/index.js';
import { v4 as uuidv4 } from 'uuid';

import Message from '../../types/message.js';
import { UserContext } from '../contexts/user.jsx';

interface AutoScrollMessagesProps {
	messages: Message[];
	submitFunction(message: Message): void;
	title?: ReactNode;
}

const AutoScrollMessages = ({
	messages, submitFunction, title, 
}: AutoScrollMessagesProps) => {
	const {
		userState: {
			authenticated,
			userID,
		},
	} = useContext(UserContext);
	const newMessageRef = useRef<HTMLInputElement>();
	const [newMessageText, setNewMessageText] = useState('');
	const {
		palette: {
			primary,
			secondary,
		},
	} = useTheme();

	const preach = () => {
		submitFunction({
			content: newMessageText,
			displayed: false,
			id: uuidv4(),
			sender: userID,
			timestamp: Date.now(),
		});
		setNewMessageText('');
		newMessageRef.current?.focus();
	};

	return (
		<Card
			style={{
				display: 'flex',
				flexDirection: 'column',
				maxHeight: '90vh',
			}}
		>
			{title && <CardHeader title={<Typography variant="h3">{title}</Typography>} />}
			<CardContent
				style={{
					flexGrow: 1,
					marginRight: 16,
					overflowY: 'auto',
				}}
			>
				<ul
					style={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{messages
						.map((message, index, array) => array[array.length - 1 - index])
						.map((message) => (
							<li
								key={message.id}
								style={{
									display: 'flex',
									flexDirection: message.sender === userID
										? 'row-reverse'
										: 'row',
									margin: '4px 0',
								}}
							>
								{/* <Avatar
									profile={message.author}
									size="small"
								/> */}
								<Paper
									style={{
										backgroundColor:
											message.sender === userID
												? primary.main
												: secondary.main,
										minWidth: '50%',
										overflowWrap: 'break-word',
										padding: '0 4px',
										textAlign: message.sender === userID
											? 'right'
											: 'left',
									}}
								>
									{message.content.split('\n').map((subString, index) => (
										<Typography
											color="white"
											key={index}
											variant="body1"
										>
											{subString}
										</Typography>
									))}
									<Typography
										color="white"
										variant="caption"
									>
										{new Date(message.timestamp).toLocaleString()}
									</Typography>
								</Paper>
							</li>
						))}
				</ul>
			</CardContent>
			{authenticated && (
				<CardActions
					style={{
						alignItems: 'stretch',
						columnGap: 8,
						flexDirection: 'row',
					}}
				>
					<TextField
						autoComplete="off"
						fullWidth
						inputRef={newMessageRef}
						multiline
						onChange={(event) => {
							if (event.target.value !== '\n') {
								setNewMessageText(event.target.value);
							}
						}}
						onKeyDown={(event) => {
							if (!event.shiftKey && event.key === 'Enter' && newMessageText.length > 0) preach();
						}}
						rows={2}
						type="text"
						value={newMessageText}
					/>
					<Button
						disabled={newMessageText.length === 0}
						onClick={() => {
							if (newMessageText.length > 0) preach();
						}}
						startIcon={<SendIcon />}
						variant="contained"
					/>
				</CardActions>
			)}
		</Card>
	);
};

export default AutoScrollMessages;
