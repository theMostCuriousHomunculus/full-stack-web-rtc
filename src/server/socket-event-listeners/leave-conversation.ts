import { Socket } from 'socket.io';

import PeerInfoPayload from '../../types/socket-event-payloads/peer-info.js';

function socketLeaveConversationEventListener(
	this: Socket,
	participantIDs: string,
) {
	this.leave(participantIDs);
	this.to(participantIDs).emit(
		'peer-disconnected',
		{
			name: this.data.userName,
			socketID: this.id,
		} as PeerInfoPayload,
	);
}

export default socketLeaveConversationEventListener;
