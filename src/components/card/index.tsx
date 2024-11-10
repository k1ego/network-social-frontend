import React, { useState } from 'react';

import {
	CardBody,
	CardFooter,
	CardHeader,
	Card as NextUiCard,
	Spinner,
} from '@nextui-org/react';
import { FaRegComment } from 'react-icons/fa';
import { FcDislike } from 'react-icons/fc';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteCommentMutation } from '../../app/services/commentsApi';
import {
	useLikePostMutation,
	useUnlikePostMutation,
} from '../../app/services/likesApi';
import {
	useDeletePostMutation,
	useLazyGetAllPostsQuery,
	useLazyGetPostByIdQuery,
} from '../../app/services/postsApi';
import { selectCurrentUser } from '../../features/user/userSlice';
import { formatToClientDate } from '../../utils/format-to-client-date';
import { hasErrorField } from '../../utils/has-error-field';
import { ErrorMessage } from '../error-message';
import { MetaInfo } from '../meta-info';
import { Typography } from '../typography';
import { User } from '../user';

type Props = {
	avatarUrl: string;
	name: string;
	authorId: string;
	content: string;
	commentId?: string;
	likeCount?: number;
	commentsCount?: number;
	createdAt?: Date;
	id?: string;
	cardFor: 'comment' | 'post' | 'currentPost';
	likedByUser?: boolean;
};

export const Cards: React.FC<Props> = ({
	avatarUrl = '',
	name = '',
	authorId = '',
	content = '',
	commentId = '',
	likeCount = 0,
	commentsCount = 0,
	createdAt,
	id = '',
	cardFor = 'post',
	likedByUser = false,
}) => {
	const [likePost] = useLikePostMutation();
	const [unlikePost] = useUnlikePostMutation();
	const [triggerGetAllPosts] = useLazyGetAllPostsQuery();
	const [triggerGetPostById] = useLazyGetPostByIdQuery();
	const [deletePost, deletePostStatus] = useDeletePostMutation();
	const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation();
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const currentUser = useSelector(selectCurrentUser);

	// Функция для перезапроса данных из места удаления
	const refetchPosts = async () => {
		switch (cardFor) {
			case 'post':
				await triggerGetAllPosts().unwrap();
				break;
			case 'currentPost':
				await triggerGetAllPosts().unwrap();
				break;
			case 'comment':
				await triggerGetPostById(id).unwrap();
				break;
			default:
				throw new Error('Неверный аргумент cardFor');
		}
	};

	const handleClick = async () => {
		try {
			likedByUser
				? await unlikePost(id).unwrap()
				: await likePost({ postId: id }).unwrap();

				if (cardFor === 'currentPost') {
					await triggerGetPostById(id).unwrap();
				}

				if (cardFor === 'post') {
					await triggerGetAllPosts().unwrap();
				}
				
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error);
			} else {
				setError(error as string);
			}
		}
	};

	const handleDelete = async () => {
		try {
			switch (cardFor) {
				case 'post':
					await deletePost(id).unwrap();
					await refetchPosts();
					break;
				case 'currentPost':
					await deletePost(id).unwrap();
					navigate('/');
					break;
				case 'comment':
					await deleteComment(commentId).unwrap();
					await refetchPosts();
					break;
				default:
					throw new Error('Неверный аргумент cardFor');
			}
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error);
			} else {
				setError(error as string);
			}
		}
	};

	return (
		<NextUiCard className='mb-5'>
			<CardHeader className='justify-between items-center bg-transparent'>
				<Link to={`/users/${authorId}`}>
					<User
						name={name}
						className='text-small font-semibold leading-non text-default-600'
						avatarUrl={avatarUrl}
						description={
							createdAt && formatToClientDate(createdAt)
						}
					/>
				</Link>
				{authorId === currentUser?.id && (
					<div className='cursor-pointer' onClick={handleDelete}>
						{deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
							<Spinner />
						) : (
							<RiDeleteBinLine />
						)}
					</div>
				)}
			</CardHeader>
			<CardBody className='px-3 py-2 mb-5'>
				<Typography>{content}</Typography>
			</CardBody>
			{cardFor !== 'comment' && (
				<CardFooter className='gap-3'>
					<div className='flex gap-5 items-center'>
						<div onClick={handleClick}>
							<MetaInfo
								count={likeCount}
								Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
							/>
						</div>
						<Link to={`/posts/${id}`} className='cursor-pointer'>
							<MetaInfo count={commentsCount} Icon={FaRegComment} />
						</Link>
					</div>
					<ErrorMessage error={error} />
				</CardFooter>
			)}
		</NextUiCard>
	);
};
