import {
	useEffect,
	useRef,
} from 'react';
import Box from '@mui/material/Box/index.js';
import Typography from '@mui/material/Typography/index.js';

import IPerfectRTCPeerConnection from '../../types/perfect-rtc-peer-connection.js';

interface PeerProps {
	connection: IPerfectRTCPeerConnection;
}

const Peer = ({ connection }: PeerProps): JSX.Element => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(
		() => {
			connection.ontrack = (rtcTrackEvent) => {
				rtcTrackEvent.track.onunmute = () => {
					if (
						videoRef.current
						&& !videoRef.current.srcObject
					) {
						// eslint-disable-next-line prefer-destructuring
						videoRef.current.srcObject = rtcTrackEvent.streams[0];
					}
				};
			};
		},
		[],
	);

	return (
		<Box
			component="span"
			sx={{ position: 'relative' }}
		>
			<Typography
				align="center"
				component="span"
				sx={{
					'-webkit-text-stroke-color': 'black',
					'-webkit-text-stroke-width': 1,
					fontSize: '2rem',
					left: '50%',
					position: 'absolute',
					transform: 'translateX(-50%)',
					zIndex: 1,
				}}
				variant="subtitle1"
			>
				{connection.name}
			</Typography>
			<video
				aria-label={connection.name}
				autoPlay
				controls
				ref={videoRef}
				style={{
					display: 'inline',
					height: 'auto',
					width: '50%',
				}}
			/>
		</Box>
	);
};

export default Peer;
