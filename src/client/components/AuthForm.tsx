/** @file This dialog component is responsible for managing the authentication form which allows the user to login, register and reset their password. */
import {
	FormEventHandler,
	useContext,
	useEffect,
	useState,
} from 'react';

import Button from '@mui/material/Button/index.js';
import Dialog from '@mui/material/Dialog/index.js';
import DialogActions from '@mui/material/DialogActions/index.js';
import DialogContent from '@mui/material/DialogContent/index.js';
import DialogTitle from '@mui/material/DialogTitle/index.js';
import IconButton from '@mui/material/IconButton/index.js';
import InputAdornment from '@mui/material/InputAdornment/index.js';
// import LoadingButton from '@mui/lab/LoadingButton/index.js';
import Tab from '@mui/material/Tab/index.js';
import Tabs from '@mui/material/Tabs/index.js';
import TextField from '@mui/material/TextField/index.js';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined.js';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined.js';

import { PreferencesContext } from '../contexts/preferences.jsx';
import { UserContext } from '../contexts/user.jsx';
import multilingualDictionary from '../constants/multilingual-dictionary.js';
import { trpc } from '../hooks/trpc.js';

interface AuthFormProps {
	open: boolean;
	toggleOpen(): void;
}

export default function AuthForm({
	open,
	toggleOpen,
}: AuthFormProps): JSX.Element {
	const { dispatchUserAction } = useContext(UserContext);
	const { languageState } = useContext(PreferencesContext);
	const login = trpc.account.login.useMutation();
	const register = trpc.account.register.useMutation();
	const requestPasswordReset = trpc.account.requestPasswordReset.useMutation();
	const [selectedTab, setSelectedTab] = useState(0);
	const [emailInput, setEmailInput] = useState('');
	const [nameInput, setNameInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [passwordVisible, setPasswordVisible] = useState(false);

	const submitForm: FormEventHandler = (event) => {
		event.preventDefault();

		if (selectedTab === 0) {
			login.mutate({
				email: emailInput,
				password: passwordInput,
			});
		} else if (selectedTab === 1) {
			requestPasswordReset.mutate({ email: emailInput });
		} else if (selectedTab === 2) {
			register.mutate({
				email: emailInput,
				name: nameInput,
				password: passwordInput,
			});
		} else {
			throw new Error('Invalid tab number!');
		}
	};

	useEffect(
		() => {
			if (login.isSuccess) {
				dispatchUserAction({
					payload: {
						accessToken: login.data.accessToken,
						refreshToken: login.data.refreshToken,
						userID: login.data.userID,
						userName: login.data.userName,
					},
					type: 'Login',
				});
				toggleOpen();
			} else if (register.isSuccess) {
				dispatchUserAction({
					payload: {
						accessToken: register.data.accessToken,
						refreshToken: register.data.refreshToken,
						userID: register.data.userID,
						userName: register.data.userName,
					},
					type: 'Login',
				});
				toggleOpen();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[login.isSuccess, register.isSuccess],
	);

	return (
		<Dialog
			onClose={toggleOpen}
			open={open}
		>
			{requestPasswordReset.isSuccess
				? (
					<>
						<DialogTitle>
							Password Reset Link Sent
						</DialogTitle>
						<DialogContent>
							Check your email address.
						</DialogContent>
					</>
				)
				: (
					<form onSubmit={submitForm}>
						<DialogTitle>
							<Tabs
								aria-label="authentication-options"
								onChange={(event, chosenTab) => setSelectedTab(chosenTab)}
								value={selectedTab}
								variant="fullWidth"
							>
								<Tab
									aria-controls="authentication-options-tabpanel-0"
									id="login-tab"
									label={multilingualDictionary.Login[languageState]}
									tabIndex={0}
								/>
								<Tab
									aria-controls="authentication-options-tabpanel-1"
									id="password-reset-tab"
									label="Password Reset"
									tabIndex={0}
								/>
								<Tab
									aria-controls="authentication-options-tabpanel-2"
									id="register-tab"
									label={multilingualDictionary.Register[languageState]}
									tabIndex={0}
								/>
							</Tabs>
						</DialogTitle>

						<DialogContent>
							<div
								aria-labelledby="login-tab"
								className={selectedTab === 0
									? 'auth-form-tab'
									: undefined}
								hidden={selectedTab !== 0}
								id="authentication-options-tabpanel-0"
								role="tabpanel"
							>
								<TextField
									autoComplete="off"
									fullWidth
									label={multilingualDictionary.EmailAddress[languageState]}
									margin="normal"
									onChange={(event) => setEmailInput(event.target.value)}
									required={selectedTab === 0}
									type="email"
									value={emailInput}
								/>

								<TextField
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													edge="end"
													onClick={() => setPasswordVisible((prevState) => !prevState)}
												>
													{passwordVisible
														? <VisibilityOffOutlinedIcon />
														: <VisibilityOutlinedIcon />}
												</IconButton>
											</InputAdornment>
										),
									}}
									autoComplete="off"
									fullWidth
									label={multilingualDictionary.Password[languageState]}
									margin="normal"
									onChange={(event) => setPasswordInput(event.target.value)}
									required={selectedTab === 0}
									type={passwordVisible
										? 'text'
										: 'password'}
									value={passwordInput}
								/>
							</div>

							<div
								aria-labelledby="password-reset-tab"
								className={selectedTab === 1
									? 'auth-form-tab'
									: undefined}
								hidden={selectedTab !== 1}
								id="authentication-options-tabpanel-1"
								role="tabpanel"
							>
								<TextField
									autoComplete="off"
									fullWidth
									label={multilingualDictionary.EmailAddress[languageState]}
									margin="normal"
									onChange={(event) => setEmailInput(event.target.value)}
									required={selectedTab === 1}
									type="email"
									value={emailInput}
								/>
							</div>

							<div
								aria-labelledby="register-tab"
								className={selectedTab === 2
									? 'auth-form-tab'
									: undefined}
								hidden={selectedTab !== 2}
								id="authentication-options-tabpanel-2"
								role="tabpanel"
							>
								<TextField
									autoComplete="off"
									fullWidth
									label={multilingualDictionary.EmailAddress[languageState]}
									margin="normal"
									onChange={(event) => setEmailInput(event.target.value)}
									required={selectedTab === 2}
									type="email"
									value={emailInput}
								/>

								<TextField
									autoComplete="off"
									fullWidth
									label="User Name"
									margin="normal"
									onChange={(event) => setNameInput(event.target.value)}
									required={selectedTab === 2}
									type="text"
									value={nameInput}
								/>

								<TextField
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													edge="end"
													onClick={() => setPasswordVisible((prevState) => !prevState)}
												>
													{passwordVisible
														? <VisibilityOffOutlinedIcon />
														: <VisibilityOutlinedIcon />}
												</IconButton>
											</InputAdornment>
										),
									}}
									autoComplete="off"
									fullWidth
									label={multilingualDictionary.Password[languageState]}
									margin="normal"
									onChange={(event) => setPasswordInput(event.target.value)}
									required={selectedTab === 2}
									type={passwordVisible
										? 'text'
										: 'password'}
									value={passwordInput}
								/>
							</div>
						</DialogContent>
						<DialogActions>
							<Button type="submit">
								{/* <LoadingButton
								loading={login.isLoading || register.isLoading || requestPasswordReset.isLoading}
								type="submit"
							> */}
								{multilingualDictionary.Submit[languageState]}
								{/* </LoadingButton> */}
							</Button>
						</DialogActions>
					</form>
				)}
		</Dialog>
	);
}
