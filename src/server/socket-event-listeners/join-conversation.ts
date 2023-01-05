import { Socket } from 'socket.io';

import PeerInfoPayload from '../../types/socket-event-payloads/peer-info.js';

function socketJoinConversationEventListener(
	this: Socket,
	participantIDs: string,
) {
	// ensure only invited users can join the conversation
	if (participantIDs.includes(this.data.userID)) {
		this.join(participantIDs);
		this.to(participantIDs).emit(
			'peer-joined',
			{
				name: this.data.userName,
				socketID: this.id,
			} as PeerInfoPayload,
		);
	} else {
		this._error(new Error('Access Denied.'));
	}
}

export default socketJoinConversationEventListener;
