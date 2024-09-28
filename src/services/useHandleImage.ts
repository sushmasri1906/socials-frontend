import { useRecoilValue } from "recoil";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/Utils/firebase";
import { userState } from "@/State/atoms";

export const useHandleImage = () => {
	const currentUser = useRecoilValue(userState);

	const handleImageUpload = async (file: File, profile?: boolean) => {
		if (!file) return;
		if (!currentUser) {
			alert("You must be logged in to upload files.");
			return;
		}
		let storageRef;
		if (profile) {
			storageRef = ref(
				storage,
				`images/${currentUser._id}/profile/${file.name}`
			);
		} else {
			storageRef = ref(storage, `images/${currentUser._id}/${file.name}`);
		}

		await uploadBytes(storageRef, file);
		const url = await getDownloadURL(storageRef);
		return url;
	};

	return { handleImageUpload };
};
