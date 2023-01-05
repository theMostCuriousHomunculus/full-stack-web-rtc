import {
	useContext,
	useEffect,
	useState,
} from 'react';

import AppBar from '@mui/material/AppBar/index.js';
import Dialog from '@mui/material/Dialog/index.js';
import DialogTitle from '@mui/material/DialogTitle/index.js';
import List from '@mui/material/List/index.js';
import ListItemButton from '@mui/material/ListItemButton/index.js';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined.js';
import Toolbar from '@mui/material/Toolbar/index.js';
import Typography from '@mui/material/Typography/index.js';

import NavigationButtonSet from './NavigationButtonSet.jsx';
import { PreferencesContext } from '../contexts/preferences.jsx';
import { UserContext } from '../contexts/user.jsx';
import multilingualDictionary from '../constants/multilingual-dictionary.js';
import { trpc } from '../hooks/trpc.js';

const Navigation = ({ children }: { children: JSX.Element }): JSX.Element => {
	const { dispatchUserAction } = useContext(UserContext);
	const { languageState } = useContext(PreferencesContext);
	const logout = trpc.account.logout.useMutation();
	const logoutAll = trpc.account.logoutAll.useMutation();
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

	useEffect(
		() => {
			if (logout.isSuccess) dispatchUserAction({ type: 'Logout' });
		},
		[dispatchUserAction, logout.isSuccess],
	);

	useEffect(
		() => {
			if (logoutAll.isSuccess) dispatchUserAction({ type: 'Logout' });
		},
		[dispatchUserAction, logoutAll.isSuccess],
	);
	
	return (
		<>
			<Dialog
				onClose={() => setLogoutDialogOpen((prevState) => !prevState)}
				open={logoutDialogOpen}
			>
				<DialogTitle>
					{multilingualDictionary.LogoutConfirmationDialogTitle[languageState]}
				</DialogTitle>
				<List>
					<ListItemButton
						onClick={() => {
							logout.mutate();
							setLogoutDialogOpen(false);
						}}
					>
						<Typography variant="button">
							{multilingualDictionary.LogoutThisDevice[languageState]}
						</Typography>
					</ListItemButton>

					<ListItemButton
						onClick={() => {
							logoutAll.mutate();
							setLogoutDialogOpen(false);
						}}
					>
						<Typography variant="button">
							{multilingualDictionary.LogoutAllDevices[languageState]}
						</Typography>
					</ListItemButton>

					<ListItemButton onClick={() => setLogoutDialogOpen(false)}>
						<Typography variant="button">
							{multilingualDictionary.CancelLogout[languageState]}
						</Typography>
					</ListItemButton>
				</List>
			</Dialog>

			<AppBar
				position="sticky"
				sx={{
					display: {
						lg: 'flex',
						md: 'flex',
						sm: 'none',
						xl: 'flex',
						xs: 'none',
					},
				}}
			>
				<Toolbar>
					<Typography
						component="div"
						sx={{
							display: {
								sm: 'block',
								xs: 'none',
							},
							flexGrow: 1,
						}}
						variant="h6"
					>
						<ShieldOutlinedIcon />
						{multilingualDictionary.AppName[languageState]}
					</Typography>
					<NavigationButtonSet setLogoutDialogOpen={setLogoutDialogOpen} />
				</Toolbar>
			</AppBar>
			{children}
			<AppBar
				position="fixed"
				sx={{
					bottom: 0,
					display: {
						md: 'none',
						sm: 'inherit',
					},
					top: 'auto',
				}}
			>
				<Toolbar component="nav">
					<NavigationButtonSet setLogoutDialogOpen={setLogoutDialogOpen} />
					{/* <StyledFab
						aria-label="add"
						color="secondary"
					>
						<AddIcon />
					</StyledFab> */}
					{/* <Box sx={{ flexGrow: 1 }} /> */}
				</Toolbar>
			</AppBar>
		</>
	);
};

export default Navigation;
