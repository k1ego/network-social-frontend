import { Card, CardBody } from '@nextui-org/react';
import React from 'react'
import { Link } from 'react-router-dom';
import { User } from '../../components/user';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/user/userSlice';

export const Following = () => {
	const currentUser = useSelector(selectCurrentUser);

	if (!currentUser) {
		return null;
	}

	return currentUser.following.length > 0 ? (
		<div className='gap-5 flex flex-col'>
			{currentUser.following.map(user => (
				<Link to={`/users/${user.following.id}`} key={user.following.id}>
					<Card>
						<CardBody className='block'>
							<User
								name={user.following.name ?? ''}
								avatarUrl={user.following.avatarUrl ?? ''}
								description={user.following.email ?? ''}
							/>
						</CardBody>
					</Card>
				</Link>
			))}
		</div>
	) : (
		<h1>У вас нет подписок</h1>
	);
}
