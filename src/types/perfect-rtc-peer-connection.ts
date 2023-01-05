interface IPerfectRTCPeerConnection extends RTCPeerConnection {
	makingOffer: boolean;
	name: string;
	polite: boolean;
	textChatChannel?: RTCDataChannel;
}

export default IPerfectRTCPeerConnection;
