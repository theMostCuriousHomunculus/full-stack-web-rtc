import { Socket } from 'socket.io';

import {
	ReceiveICECandidateEventPayload,
	SendICECandidateEventPayload,
} from '../../types/socket-event-payloads/ice-candidate.js';

function socketICECandidateEventListener(
	this: Socket,
	{
		candidate,
		toSocketID,
	}: SendICECandidateEventPayload,
) {
	this
		.to(toSocketID)
		.emit(
			'ice-candidate',
			{
				candidate,
				fromSocketID: this.id,
			} as ReceiveICECandidateEventPayload,
		);
}

export default socketICECandidateEventListener;
