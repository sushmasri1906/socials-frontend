import { atom } from "recoil";

// Atom for storing the authentication token
export const authTokenState = atom<string | null>({
	key: "authTokenState",
	default: null,
});

// Atom for storing user login information
export const loginDataState = atom<{ email: string; password: string } | null>({
	key: "loginDataState",
	default: null,
});

export const searchResultsState = atom<any[]>({
	key: "searchResultsState",
	default: [],
});

export const postsState = atom<any[]>({
	key: "postsState",
	default: [],
});

export const userIdState = atom<string | null>({
	key: "userIdState",
	default: null,
});
