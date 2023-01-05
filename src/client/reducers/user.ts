import cloneDeep from 'lodash.clonedeep';

export interface UserState {
	accessToken: string;
	authenticated: boolean;
	buds: Bud[];
	conversations: Conversation[];
	refreshToken: string;
	userID: string;
	userName: string;
}

export const unauthenticatedUserState: UserState = {
	accessToken: '',
	authenticated: false,
	buds: [],
	conversations: [],
	refreshToken: '',
	userID: '',
	userName: '',
};

export interface Bud {
	socketIDs: string[];
	userID: string;
	userName:string;
}

export interface Conversation {
	id: string;
	messages: Message[];
	// maybe an object later with avatar?
	participants: string[];
}

export interface Message {
	content: string;
	displayed: boolean;
	id: string;
	sender: string;
	timestamp: Date;
}

type BudConnected = {
	payload: {
		socketID: string;
		userID: string;
	};
	type: 'BudConnected';
};

type BudDisconnected = {
	payload: {
		socketID: string;
		userID: string;
	};
	type: 'BudDisconnected';
};

type ConversationMessageDisplayed = {
	payload: {
		conversationID: string;
		messageID: string;
	};
	type: 'ConversationMessageDisplayed';
}

type Login = {
	payload: {
		accessToken: string;
		refreshToken: string;
		userID: string;
		userName: string;
	};
	type: 'Login';
};

type Logout = {
	type: 'Logout';
};

type NewConversation = {
	payload: Conversation;
	type: 'NewConversation';
};

type NewConversationMessage = {
	payload: Message & { conversationID: string };
	type: 'NewConversationMessage';
};

type Ping = {
	type: 'Ping';
};

export type UserAction = BudConnected
	| BudDisconnected
	| ConversationMessageDisplayed
	| Login
	| Logout
	| NewConversation
	| NewConversationMessage
	| Ping;

export default function userReducer(
	state: UserState,
	action: UserAction,
): UserState {
	switch(action.type) {
		case 'ConversationMessageDisplayed': {
			const {
				payload: {
					conversationID,
					messageID,
				},
			} = action;
			const clonedState: UserState = cloneDeep(state);
			const message = clonedState.conversations
				.find(
					(conversation) => conversation.id === conversationID,
				)
				?.messages
				.find(
					(message) => message.id === messageID,
				);
			
			if (message) message.displayed = true;

			return clonedState;
		}
		case 'Login': {
			localStorage.setItem(
				'accessToken',
				action.payload.accessToken,
			);
			localStorage.setItem(
				'refreshToken',
				action.payload.refreshToken,
			);
			return {
				...state,
				authenticated: true,
				...action.payload,
			};
		}
		case 'Logout': {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			return unauthenticatedUserState;
		}
		case 'BudConnected': {

			return state;
		}
		case 'NewConversation': {

			return {
				...state,
				conversations: [action.payload, ...state.conversations],
			};
		}
		case 'NewConversationMessage': {
			return state;
		}
		default:
			return state;
	}
}
