import React, {
	Dispatch,
	MutableRefObject,
	SetStateAction,
	useContext,
	useEffect,
	useRef,
} from 'react';
import { useParams } from 'react-router-dom';

import AnswerEventPayload from '../../types/socket-event-payloads/answer.js';
import ICECandidateEventPayload from '../../types/socket-event-payloads/ice-candidate.js';
import Message from '../../types/message.js';
import OfferEventPayload from '../../types/socket-event-payloads/offer.js';
import { UserContext } from '../contexts/user.jsx';
import iceServers from '../constants/ice-servers.js';

interface PeerProps {
	mostRecentSentMessageState?: Message;
	setTextChatState: Dispatch<SetStateAction<Message[]>>;
	socketID: string;
	socketName: string;
	streamRef: MutableRefObject<MediaStream | undefined>;
}

const Peer = ({
	mostRecentSentMessageState,
	setTextChatState,
	socketID,
	socketName,
	streamRef,
}: PeerProps): JSX.Element => {
	const { socketRef } = useContext(UserContext);
	const { participantIDs } = useParams();
	const textChatChannel = useRef<RTCDataChannel>();
	const peerRef = useRef<RTCPeerConnection>();
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(
		() => {
			peerRef.current = new RTCPeerConnection(iceServers);
			streamRef.current
				?.getTracks()
				.forEach(
					(track) => {
						peerRef.current?.addTrack(
							track,
							streamRef.current as MediaStream,
						);
					},
				);

			textChatChannel.current = peerRef.current.createDataChannel('text-chat');
			textChatChannel.current.onmessage = (messageEvent: MessageEvent) => {
				setTextChatState((prevState) => [...prevState, JSON.parse(messageEvent.data) as Message].sort(
					(a, b) => {
						if (a.timestamp > b.timestamp) return -1;
						if (a.timestamp < b.timestamp) return 1;
						return 0;
					},
				));
			};

			peerRef.current.onicecandidate = (rtcPeerConnectionIceEvent) => {
				if (rtcPeerConnectionIceEvent.candidate) {
					socketRef.current?.emit(
						'ice-candidate',
						{
							candidate: rtcPeerConnectionIceEvent.candidate,
							participantIDs,
						} as ICECandidateEventPayload,
					);
				}
			};

			peerRef.current.onnegotiationneeded = () => {
				(async () => {
					const offer = await peerRef.current?.createOffer();
					await peerRef.current?.setLocalDescription(offer);
					socketRef.current?.emit(
						'offer',
						{
							participantIDs,
							sdp: peerRef.current?.localDescription,
						} as OfferEventPayload,
					);
				})();
			};

			peerRef.current.ontrack = (rtcTrackEvent) => {
				const { streams: [stream] } = rtcTrackEvent;
				if (videoRef.current) videoRef.current.srcObject = stream;
			};

			socketRef.current?.on(
				`${socketID}-answer`,
				({ sdp }) => {
					(async () => {
						try {
							console.log('answer');
							await peerRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
						} catch (error) {
							console.log(error);
						}
					})();
				},
			);

			socketRef.current?.on(
				`${socketID}-ice-candidate`,
				({ candidate }) => {
					if (peerRef.current?.remoteDescription) {
						console.log('ice-candidate');
						peerRef.current.addIceCandidate(candidate);
					} else {
						const timer = setInterval(
							() => {
								if (peerRef.current?.remoteDescription) {
									clearInterval(timer);
									peerRef.current.addIceCandidate(candidate);
								}
							},
							100,
						);
					}
				},
			);

			socketRef.current?.on(
				`${socketID}-offer`,
				({ sdp }) => {
					(async () => {
						try {
							console.log('offer');
							await peerRef.current?.setRemoteDescription(new RTCSessionDescription(sdp));
							const answer = await peerRef.current?.createAnswer();
							await peerRef.current?.setLocalDescription(answer);
							socketRef.current?.emit(
								'answer',
								{
									participantIDs,
									sdp: peerRef.current?.localDescription,
								} as AnswerEventPayload,
							);
						} catch (error) {
							console.log(error);
						}
					})();
				},
			);

			return () => {
				peerRef.current?.close();
				socketRef.current?.off(`${socketID}-answer`);
				socketRef.current?.off(`${socketID}-ice-candidate`);
				socketRef.current?.off(`${socketID}-offer`);
			};
		},
		[],
	);

	useEffect(
		() => {
			if (textChatChannel.current && mostRecentSentMessageState) {
				console.log(mostRecentSentMessageState);
				textChatChannel.current.send(JSON.stringify(mostRecentSentMessageState));
			}
		},
		[mostRecentSentMessageState],
	);

	return (
		<video
			autoPlay
			controls
			ref={videoRef}
		/>
	);
};

export default Peer;
