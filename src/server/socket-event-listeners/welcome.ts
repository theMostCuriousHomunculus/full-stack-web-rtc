import { Socket } from 'socket.io';

import PeerInfoPayload from '../../types/socket-event-payloads/peer-info.js';

function socketWelcomeEventListener(
	this: Socket,
	toSocketID: string,
) {
	this
		.to(toSocketID)
		.emit(
			'welcome',
			{
				name: this.data.userName,
				socketID: this.id,
			} as PeerInfoPayload,
		);
}

export default socketWelcomeEventListener;
