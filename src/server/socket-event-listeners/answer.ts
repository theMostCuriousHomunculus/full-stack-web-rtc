import { Socket } from 'socket.io';

import {
	ReceiveSDPEventPayload,
	SendSDPEventPayload,
} from '../../types/socket-event-payloads/sdp.js';

function socketAnswerEventListener(
	this: Socket,
	{
		sdp,
		toSocketID,
	}: SendSDPEventPayload,
) {
	this
		.to(toSocketID)
		.emit(
			'answer',
			{
				fromSocketID: this.id,
				sdp,
			} as ReceiveSDPEventPayload,
		);
}

export default socketAnswerEventListener;
