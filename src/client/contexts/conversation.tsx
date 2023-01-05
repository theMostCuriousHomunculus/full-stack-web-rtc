import {
	Dispatch,
	MutableRefObject,
	ReactElement,
	SetStateAction,
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';

import {
	ReceiveICECandidateEventPayload,
	SendICECandidateEventPayload,
} from '../../types/socket-event-payloads/ice-candidate.js';
import {
	ReceiveSDPEventPayload,
	SendSDPEventPayload,
} from '../../types/socket-event-payloads/sdp.js';
import IPerfectRTCPeerConnection from '../../types/perfect-rtc-peer-connection.js';
import Message from '../../types/message.js';
import PeerInfoPayload from '../../types/socket-event-payloads/peer-info.js';
import { UserContext } from '../contexts/user.jsx';
import rtcConfiguration from '../constants/rtc-configuration.js';

interface ConversationContextValue {
	cameraStreamRef: MutableRefObject<MediaStream | undefined>;
	micStreamRef: MutableRefObject<MediaStream | undefined>;
	peersRef: MutableRefObject<
		Record<
			Socket['id'],
			IPerfectRTCPeerConnection
		>
	>;
	setSharingCamera: Dispatch<SetStateAction<boolean>>;
	setSharingMic: Dispatch<SetStateAction<boolean>>;
	setSharingScreen: Dispatch<SetStateAction<boolean>>;
	setTextMessages: Dispatch<SetStateAction<Array<Message>>>;
	sharingCamera: boolean;
	sharingMic: boolean;
	sharingScreen: boolean;
	textMessages: Array<Message>;
}

export const ConversationContext = createContext<ConversationContextValue>({
	cameraStreamRef: { current: undefined },
	micStreamRef: { current: undefined },
	peersRef: { current: {} },
	setSharingCamera(){
		return;
	},
	setSharingMic(){
		return;
	},
	setSharingScreen(){
		return;
	},
	setTextMessages(){
		return;
	},
	sharingCamera: false,
	sharingMic: false,
	sharingScreen: false,
	textMessages: [],
});

export const ConversationProvider = ({ children }: { children: ReactElement }): ReactElement => {
	const {
		connected,
		socketRef,
		userState: { userID },
	} = useContext(UserContext);
	const { participantIDs } = useParams();
	const peersRef = useRef<
		Record<
			Socket['id'],
			IPerfectRTCPeerConnection
		>
	>({});
	const cameraStreamRef = useRef<MediaStream>();
	const micStreamRef = useRef<MediaStream>();
	const [, setPeersCount] = useState(0);
	const [sharingCamera, setSharingCamera] = useState(false);
	const [sharingMic, setSharingMic] = useState(false);
	const [sharingScreen, setSharingScreen] = useState(false);
	const [textMessages, setTextMessages] = useState<Array<Message>>([]);

	useEffect(
		() => {
			if (userID) {
				/** @tutorial https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation */
				class PerfectRTCPeerConnection extends RTCPeerConnection implements IPerfectRTCPeerConnection {
					makingOffer: boolean;
					name: string;
					polite: boolean;
					textChatChannel: RTCDataChannel | undefined;

					constructor({
						// eslint-disable-next-line react/prop-types
						name,
						// eslint-disable-next-line react/prop-types
						polite,
						// eslint-disable-next-line react/prop-types
						socketID,
					}: {
						name: string;
						polite: boolean;
						socketID: string;
					}) {
						super(rtcConfiguration);
						this.makingOffer = false;
						this.name = name;
						this.polite = polite;

						const receiveMessage = (messageEvent: MessageEvent) => {
							setTextMessages(
								(prevState) => {
									return [...prevState, JSON.parse(messageEvent.data)].sort(
										(a, b) => {
											if (a.timestamp > b.timestamp) return -1;
											if (a.timestamp < b.timestamp) return 1;
											return 0;
										},
									);
								},
							);
						};

						if (polite) {
							this.textChatChannel = this.createDataChannel('text-chat');
							this.textChatChannel.onmessage = receiveMessage;
						} else {
							this.ondatachannel = ({ channel }) => {
								if (channel.label === 'text-chat') {
									this.textChatChannel = channel;
									this.textChatChannel.onmessage = receiveMessage;
								}
							};
						}

						this.onicecandidate = (rtcPeerConnectionIceEvent) => {
							if (rtcPeerConnectionIceEvent.candidate) {
								socketRef.current?.emit(
									'ice-candidate',
									{
										candidate: rtcPeerConnectionIceEvent.candidate,
										toSocketID: socketID,
									} as SendICECandidateEventPayload,
								);
							}
						};

						const makeOffer = async () => {
							try {
								this.makingOffer = true;
								await this.setLocalDescription();
								socketRef.current?.emit(
									'offer',
									{
										sdp: this.localDescription,
										toSocketID: socketID,
									} as SendSDPEventPayload,
								);
							} catch (error) {
								console.error(error);
							} finally {
								this.makingOffer = false;
							}
						};

						this.onnegotiationneeded = makeOffer;

						if (polite) makeOffer();

						setPeersCount((prevState) => prevState + 1);
					}
				}

				socketRef.current?.emit(
					'join-conversation',
					participantIDs,
				);

				socketRef.current?.on(
					'answer',
					({
						fromSocketID,
						sdp,
					}: ReceiveSDPEventPayload) => {
						peersRef.current[fromSocketID].setRemoteDescription(sdp);
					},
				);

				socketRef.current?.on(
					'ice-candidate',
					({
						candidate: {
							candidate,
							sdpMLineIndex,
							sdpMid,
							usernameFragment,
						},
						fromSocketID,
					}: ReceiveICECandidateEventPayload) => {
						const { current: { [fromSocketID]: connection } } = peersRef;
						try {
							connection.addIceCandidate({
								candidate,
								sdpMLineIndex,
								sdpMid,
								usernameFragment,
							});
						} catch (error) {
							if (
								connection.polite
								|| (
									!connection.makingOffer
									&& connection.signalingState === 'stable'
								)
							) {
								console.error(error);
							}
						}
					},
				);

				socketRef.current?.on(
					'offer',
					async ({
						fromSocketID,
						sdp,
					}: ReceiveSDPEventPayload) => {
						try {
							const { current: { [fromSocketID]: connection } } = peersRef;
							if (
								connection.polite
								|| (
									!connection.makingOffer
									&& connection.signalingState === 'stable'
								)
							) {
								await connection.setRemoteDescription(sdp);
								await connection.setLocalDescription();
								socketRef.current?.emit(
									'answer',
										{
											sdp: connection.localDescription,
											toSocketID: fromSocketID,
										} as SendSDPEventPayload,
								);
							}
						} catch (error) {
							console.error(error);
						}
					},
				);

				socketRef.current?.on(
					'peer-disconnected',
					({
						name,
						socketID,
					}: PeerInfoPayload) => {
						console.log(`${name} left the conversation`);
						delete peersRef.current[socketID];
						setPeersCount((prevState) => prevState - 1);
					},
				);

				socketRef.current?.on(
					'peer-joined',
					({
						name,
						socketID,
					}: PeerInfoPayload) => {
						console.log(`${name} joined the conversation`);
						socketRef.current?.emit(
							'welcome',
							socketID,
						);
						peersRef.current[socketID] = new PerfectRTCPeerConnection({
							name,
							polite: true,
							socketID,
						});
					},
				);

				socketRef.current?.on(
					'welcome',
					({
						name,
						socketID,
					}: PeerInfoPayload) => {
						console.log(`${name} welcomed you to the conversation`);
						peersRef.current[socketID] = new PerfectRTCPeerConnection({
							name,
							polite: false,
							socketID,
						});
					},
				);

				return () => {
					socketRef
						.current
						?.emit(
							'leave-conversation',
							participantIDs,
						);
					cameraStreamRef
						.current
						?.getTracks()
						.forEach(
							(track) => track.stop(),
						);
					micStreamRef
						.current
						?.getAudioTracks()[0]
						.stop();
					socketRef.current?.off('answer');
					socketRef.current?.off('ice-candidate');
					socketRef.current?.off('offer');
					socketRef.current?.off('peer-disconnected');
					socketRef.current?.off('peer-joined');
					socketRef.current?.off('welcome');
				};
			}
		},
		[
			connected,
			participantIDs,
			userID,
		],
	);

	return (
		<ConversationContext.Provider
			value={{
				cameraStreamRef,
				micStreamRef,
				peersRef,
				setSharingCamera,
				setSharingMic,
				setSharingScreen,
				setTextMessages,
				sharingCamera,
				sharingMic,
				sharingScreen,
				textMessages,
			}}
		>
			{children}
		</ConversationContext.Provider>
	);
};
