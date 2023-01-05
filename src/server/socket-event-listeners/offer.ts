import { Socket } from 'socket.io';

import {
	ReceiveSDPEventPayload,
	SendSDPEventPayload,
} from '../../types/socket-event-payloads/sdp.js';

function socketOfferEventListener(
	this: Socket,
	{
		sdp,
		toSocketID,
	}: SendSDPEventPayload,
) {
	this
		.to(toSocketID)
		.emit(
			'offer',
			{
				fromSocketID: this.id,
				sdp,
			} as ReceiveSDPEventPayload,
		);
}

export default socketOfferEventListener;
