import { Post } from "../types";
import { api } from "./api";

export const postApi = api.injectEndpoints({
	endpoints: builder => ({
		createPost: builder.mutation<void, FormData>({
			query: (formData) => ({
				url: '/posts',
				method: 'POST',
				body: formData,
			}),
		}),
		getAllPosts: builder.query<Post[], void>({
			query: () => ({
				url: "/posts",
				method: "GET",
			}),
		}),
		getPostById: builder.query<Post, string>({
			query: (id) => ({
				url: `/posts/${id}`,
				method: "GET",
			}),
		}),
		deletePost: builder.mutation<void, string>({
			query: (id) => ({
				url: `/posts/${id}`,
				method: "DELETE",
			}),
		}),
		getPostFile: builder.query<Blob, string>({
			query: (id) => ({
					url: `/posts/${id}/file`,
					method: "GET",
					responseHandler: (response) => response.blob(), // Получаем файл как Blob
			}),
	}),
	}),
});


export const {
	useCreatePostMutation,
	useGetAllPostsQuery,
	useGetPostByIdQuery,
	useGetPostFileQuery,
	useDeletePostMutation,
	useLazyGetAllPostsQuery,
	useLazyGetPostByIdQuery,
} = postApi;

export const {
	endpoints: { createPost, getAllPosts, getPostById, deletePost },
} = postApi;