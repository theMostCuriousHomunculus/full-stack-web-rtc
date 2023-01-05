interface ReceiveICECandidateEventPayload {
	candidate: RTCIceCandidate;
	fromSocketID: string;
}

interface SendICECandidateEventPayload {
	candidate: RTCIceCandidate;
	toSocketID: string;
}

export type {
	ReceiveICECandidateEventPayload,
	SendICECandidateEventPayload,
};
