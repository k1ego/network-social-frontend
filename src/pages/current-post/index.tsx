import { useParams } from 'react-router-dom';
import { useGetPostByIdQuery } from '../../app/services/postsApi';
import { Card } from '../../components/card';
import { GoBack } from '../../components/go-back';
import { CreateComment } from '../../components/create-comment';

export const CurrentPost = () => {
	const params = useParams<{ id: string }>();
	const { data } = useGetPostByIdQuery(params?.id ?? '');

	if (!data) {
		return <h1>Поста не существует</h1>;
	}

	const {
		content,
		id,
		authorId,
		comments,
		likes,
		author,
		likedByUser,
		createdAt,
	} = data;

	return (
		<>
			<GoBack />
			<Card
				cardFor='currentPost'
				avatarUrl={author.avatarUrl ?? ''}
				content={content}
				authorId={authorId}
				name={author.name ?? ''}
				id={id}
				commentsCount={comments.length}
				likeCount={likes.length}
				likedByUser={likedByUser}
				createdAt={createdAt}
			/>
			<div className="mt-10">
				<CreateComment />
			</div>
			<div className='mt-10'>
				{data.comments
					? data.comments.map(comment => (
							<Card
								cardFor='comment'
								key={comment.id}
								avatarUrl={comment.user.avatarUrl ?? ''}
								content={comment.content}
								name={comment.user.name ?? ''}
								authorId={comment.userId}
								commentId={comment.id}
								id={id}
							/>
						))
					: null}
			</div>
		</>
	);
};
