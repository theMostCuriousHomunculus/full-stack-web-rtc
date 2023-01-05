import { Socket } from 'socket.io';

import { FastifyServer } from '../index.js';
import socketAnswerEventListener from './answer.js';
import socketDisconnectingEventListener from './disconnecting.js';
import socketICECandidateEventListener from './ice-candidate.js';
import socketJoinConversationEventListener from './join-conversation.js';
import socketLeaveConversationEventListener from './leave-conversation.js';
import socketOfferEventListener from './offer.js';
import socketWelcomeEventListener from './welcome.js';

function socketConnectionEventListener(this: FastifyServer, socket: Socket) {
	socket.on(
		'answer',
		socketAnswerEventListener.bind(socket),
	);

	socket.on(
		'disconnecting',
		socketDisconnectingEventListener.bind(socket),
	);

	socket.on(
		'ice-candidate',
		socketICECandidateEventListener.bind(socket),
	);

	socket.on(
		'join-conversation',
		socketJoinConversationEventListener.bind(socket),
	);

	socket.on(
		'leave-conversation',
		socketLeaveConversationEventListener.bind(socket),
	);

	socket.on(
		'offer',
		socketOfferEventListener.bind(socket),
	);

	// socket.on(
	// 	'ping',
	// 	() => {
	// 		(async () => {
	// 			const sockets = await fastify.io.fetchSockets();
	// 			sockets.forEach(() => { /* do something */ });
	// 		})();
	// 	},
	// );

	socket.on(
		'welcome',
		socketWelcomeEventListener.bind(socket),
	);
}

export default socketConnectionEventListener;
