import { Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import { MdAlternateEmail } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../constants';
import { selectCurrentUser } from '../../features/user/userSlice';

export const Profile = () => {
	const current = useSelector(selectCurrentUser);

	if (!current) {
		return null;
	}

	const { name, email, avatarUrl, id } = current;

	return (
		<Card className='py-4 w-[302px]'>
			<CardHeader className='pv-0 pt-2 px-4 flex-col items-center'>
				<Image
					alt='Card profile'
					src={`${BASE_URL}${avatarUrl}`}
					className='object-cover rounded-xl'
					width={370}
				/>
			</CardHeader>
			<CardBody>
				<Link to={`/users/${id}`}>
					<h4 className='font-bold text-large mb-2'>{name}</h4>
				</Link>
				<p className='text-default-500 flex items-center gap-2'>
					<MdAlternateEmail />
					{email}
				</p>
			</CardBody>
		</Card>
	);
};
