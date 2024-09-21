// Base URL for the API
export const api = "http://localhost:5000/ig";

// Authentication endpoints
export const register = `${api}/auth/register`;
export const login = `${api}/auth/login`;

// User endpoints
export const usersAll = `${api}/user/all`;
export const userSearch = `${api}/user`;

// Profile endpoints
export const getProfile = `${api}/user/profile`;
export const getUserProfile = (userId: string) =>
	`${api}/user/profile/${userId}`;
export const updateUserProfile = (userId: string) =>
	`${api}/user/profile/${userId}`;
export const deleteUserById = (userId: string) =>
	`${api}/user/profile/${userId}`;

// Follow/Unfollow endpoints
export const followUser = (userId: string) => `${api}/user/follow/${userId}`;
export const unfollowUser = (userId: string) =>
	`${api}/user/unfollow/${userId}`;

//posts
export const getUserPosts = (userId: string) => `${api}/posts/${userId}`;
