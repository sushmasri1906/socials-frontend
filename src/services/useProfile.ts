import axios from "axios";
import { api } from "../Constants/constants";
import { authTokenState } from "@/State/atoms";
import { useRecoilValue } from "recoil";
import { useHandleImage } from "./useHandleImage";

// Define a type for the error
// type FetchPostsError = {
// 	message: string;
// };

export const useProfile = () => {
	const { handleImageUpload } = useHandleImage();
	const token = useRecoilValue(authTokenState);

	const updateProfileImg = async (image: File) => {
		try {
			const url = await handleImageUpload(image, true);
			const response = await axios.put(
				`${api}/user/`,
				{ profilePicture: url },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error: unknown) {
			// Handle and type the error
			if (error instanceof Error) {
				throw new Error(`Failed to fetch posts: ${error.message}`);
			} else {
				throw new Error("An unknown error occurred");
			}
		}
	};

	return {
		updateProfileImg,
	};
};
