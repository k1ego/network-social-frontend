import React from 'react'

import {Card as NextUiCard} from '@nextui-org/react'

type Props = {
	avatarUrl: string
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
}

export const Card: React.FC<Props> = ({
	avatarUrl = "",
	name = "",
	authorId = "",
	content = "",
	commentId = "",
	likeCount = 0,
	commentsCount = 0,
	createdAt: Date,
	id = '',
	cardFor = 'post',
	likedByUser = false,
}) => {
	return (
		<div>Card</div>
	)
}
