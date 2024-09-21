import { useRecoilValue } from "recoil";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/Utils/firebase";
import { userIdState } from "@/State/atoms";

export const useHandleImage = () => {
	const currentUser = useRecoilValue(userIdState);

	const handleImageUpload = async (file: File) => {
		if (!file) return;
		if (!currentUser) {
			alert("You must be logged in to upload files.");
			return;
		}

		const storageRef = ref(storage, `images/${currentUser}/${file.name}`);
		await uploadBytes(storageRef, file);
		const url = await getDownloadURL(storageRef);
		return url;
	};

	return { handleImageUpload };
};
