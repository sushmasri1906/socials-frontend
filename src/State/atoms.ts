import { User } from "@/types/types";
import { atom } from "recoil";

// Atom for storing the authentication token
export const authTokenState = atom<string | null>({
	key: "authTokenState",
	default: null,
});

export const userState = atom<User>({
	key: "userState",
	default: {
		_id: "",
		username: "",
		email: "",
		profilePicture: "",
		bio: "",
		followers: [],
		following: [],
		posts: [],
	},
});
