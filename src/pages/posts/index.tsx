import { useGetAllPostsQuery } from '../../app/services/postsApi';
import { Cards } from '../../components/card';
import { CreatePost } from '../../components/create-post';

export const Posts = () => {
	const { data } = useGetAllPostsQuery();
	return (
		<>
			<div className='mb-10 w-full'>
				<CreatePost />
			</div>
			{data && data.length > 0
				? data.map(
						({
							content,
							author,
							id,
							authorId,
							comments,
							likes,
							likedByUser,
							createdAt,
						}) => (
							<Cards
								key={id}
								avatarUrl={author.avatarUrl ?? ''}
								content={content}
								name={author.name ?? ''}
								authorId={authorId}
								id={id}
								commentsCount={comments.length}
								likeCount={likes.length}
								likedByUser={likedByUser}
								createdAt={createdAt}
								cardFor='post'
							/>
						)
					)
				: null}
		</>
	);
};
