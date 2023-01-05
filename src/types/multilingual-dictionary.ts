import { Language } from './language.js';

interface MultilingualDictionary {
	/** Tooltip text for the icon button navigation link to the page with information about the app */
	About: Record<Language, string>;
	/** Text displayed when user tries to join a conversation they are not invited to */
	AccessDenied: Record<Language, string>;
	/** Tooltip text for the icon button to turn on push notifications */
	AllowNotifications: Record<Language, string>;
	/** A general term for a group of loyal friends, possibly sharing a common goal */
	AppName: Record<Language, string>;
	/** Button text to cancel logging out and close the logout dialog */
	CancelLogout: Record<Language, string>;
	/** Tooltip text for the icon button to switch the app into dark mode */
	DarkMode: Record<Language, string>;
	/** Tooltip text for the icon button to turn off push notifications */
	DisallowNotifications: Record<Language, string>;
	/** Label text for the email address input on the authentication form */
	EmailAddress: Record<Language, string>;
	/** Tooltip text for the icon button to install the application onto the user's device */
	InstallApp: Record<Language, string>;
	/** Tooltip text for the icon button to open a menu which can switch all the static text content on the site to a supported language */
	Language: Record<Language, string>;
	/** Tooltip text for the icon button to switch the app into light mode */
	LightMode: Record<Language, string>;
	/** Tooltip text for the icon button to display the login form */
	Login: Record<Language, string>;
	/** Tooltip text for the icon button which will log the user out of the application */
	Logout: Record<Language, string>;
	/** Button text to log the user out of all devices currently logged in to their account */
	LogoutAllDevices: Record<Language, string>;
	/** Logout confirmation dialog title text */
	LogoutConfirmationDialogTitle: Record<Language, string>;
	/** Button text to log the user out of this device only */
	LogoutThisDevice: Record<Language, string>;
	/** Tooltip text for the icon button navigation link to the page with information about the currently logged in user */
	MyProfile: Record<Language, string>;
	/** Label text for the password input on the authentication form */
	Password: Record<Language, string>;
	/** Button text to display the register tab on the authentication form */
	Register: Record<Language, string>;
	/** Tooltip text for the speed dial action to broadcast the user's camera video and audio feed to everyone in the conversation */
	ShareCamera: Record<Language, string>;
	/** Tooltip text for the speed dial action to broadcast the user's microphone audio feed to everyone in the conversation */
	ShareMicrophone: Record<Language, string>;
	/** Tooltip text for the speed dial action to broadcast the user's screen to everyone in the conversation */
	ShareScreen: Record<Language, string>;
	/** Tooltip text for the speed dial action to stop broadcasting the user's camera video feed to everyone in the conversation */
	StopSharingCamera: Record<Language, string>;
	/** Tooltip text for the speed dial action to stop broadcasting the user's microphone audio feed to everyone in the conversation */
	StopSharingMicrophone: Record<Language, string>;
	/** Tooltip text for the speed dial action to stop broadcasting the user's screen to everyone in the conversation */
	StopSharingScreen: Record<Language, string>;
	/** Button text to submit a form */
	Submit: Record<Language, string>;
	/** Label text for the user name input on the authentication form */
	UserName: Record<Language, string>;
}

export default MultilingualDictionary;
