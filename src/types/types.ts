export type User = {
	_id: string;
	username: string;
	email: string;
	profilePicture: string;
	bio: string;
	isFollowing?: boolean;
	followers: string[];
	following: string[];
	posts: string[];
};

export type Comment = {
	user: string;
	text: string;
	profileId?: string;
	username: string;
	profileImage?: string;
	createdAt: Date;
	_id: string;
};

export type Post = {
	_id: string;
	user: string;
	caption?: string;
	imageUrl: string;
	likes: string[];
	location?: string;
	taggedUsers: string[];
	createdAt: Date;
	updatedAt: Date;
	comments: Comment[];
};
