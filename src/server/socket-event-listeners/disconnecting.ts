import { Socket } from 'socket.io';

import PeerInfoPayload from '../../types/socket-event-payloads/peer-info.js';

function socketDisconnectingEventListener(this: Socket) {
	this.rooms.forEach(
		(room) => {
			this
				.to(room)
				.emit(
					'peer-disconnected',
					{
						name: this.data.userName,
						socketID: this.id,
					} as PeerInfoPayload,
				);
		},
	);
}

export default socketDisconnectingEventListener;
