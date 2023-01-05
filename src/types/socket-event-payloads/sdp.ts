interface ReceiveSDPEventPayload {
	fromSocketID: string;
	sdp: RTCSessionDescription;
}

interface SendSDPEventPayload {
	sdp: RTCSessionDescription;
	toSocketID: string;
}

export type {
	ReceiveSDPEventPayload,
	SendSDPEventPayload,
};
