import { Button, Card, Image, useDisclosure } from '@nextui-org/react';
import { useEffect } from 'react';
import { CiEdit } from 'react-icons/ci';
import {
	MdOutlinePersonAddAlt1,
	MdOutlinePersonAddDisabled,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
	useFollowUserMutation,
	useUnfollowUserMutation,
} from '../../app/services/followApi';
import {
	useGetUserByIdQuery,
	useLazyCurrentQuery,
	useLazyGetUserByIdQuery,
} from '../../app/services/userApi';
import { CountInfo } from '../../components/count-info';
import { GoBack } from '../../components/go-back';
import { ProfileInfo } from '../../components/profile-info';
import { BASE_URL } from '../../constants';
import { resetUser, selectCurrentUser } from '../../features/user/userSlice';
import { formatToClientDate } from '../../utils/format-to-client-date';
import { EditProfile } from '../../components/edit-profile';

export const UserProfile = () => {
	const { id } = useParams<{ id: string }>();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const currentUser = useSelector(selectCurrentUser);
	const { data } = useGetUserByIdQuery(id ?? '');
	const [followUser] = useFollowUserMutation();
	const [unfollowUser] = useUnfollowUserMutation();
	const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery();
	const [triggerCurrentQuery] = useLazyCurrentQuery();
	const dispatch = useDispatch();

	useEffect(() => () => {
		dispatch(resetUser());
	}, []);

	const handleFollow = async () => {
		try {
			if (id) {
				data?.isFollowing
					? await unfollowUser(id).unwrap()
					: await followUser({ followingId: id }).unwrap();

				await triggerGetUserByIdQuery(id).unwrap();
				await triggerCurrentQuery().unwrap();
			}
		} catch (error) {
			console.error(error);
		}
	};

	if (!data) return null;

	const handleClose = async () => {
		try {
			if (id) {
				await triggerGetUserByIdQuery(id).unwrap();
				await triggerCurrentQuery().unwrap();
				onClose();
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<GoBack />
			<div className='flex items-stretch gap-4'>
				<Card className='flex flex-col items-center text-center space-y-4 p-5 flex-2'>
					<Image
						src={`${BASE_URL}${data.avatarUrl}`}
						alt={data.name}
						width={200}
						height={200}
						className='border-4 border-white'
					/>
					<div className='flex flex-col text-2xl font-bold gap-4 items-center'>
						{data.name}
						{currentUser?.id !== id ? (
							<Button
								color={data.isFollowing ? 'default' : 'primary'}
								variant='flat'
								className='gap-2'
								onClick={handleFollow}
								endContent={
									data.isFollowing ? (
										<MdOutlinePersonAddDisabled />
									) : (
										<MdOutlinePersonAddAlt1 />
									)
								}
							>
								{data.isFollowing ? 'Отписаться' : 'Подписаться'}
							</Button>
						) : (
							<Button endContent={<CiEdit />} onClick={() => onOpen()}>Редактировать</Button>
						)}
					</div>
				</Card>
				<Card className='flex flex-col space-y-4 p-5 flex-1'>
					<ProfileInfo title='Почта:' info={data.email} />
					<ProfileInfo title='Местоположение:' info={data.location} />
					<ProfileInfo
						title='Дата рождения:'
						info={formatToClientDate(data.dateOfBirth)}
					/>
					<ProfileInfo title='Обо мне:' info={data.bio} />

					<div className='flex gap-2'>
						<CountInfo count={data.followers.length} title='Подписчики' />
						<CountInfo count={data.following.length} title='Подписки' />
					</div>
				</Card>
			</div>
			<EditProfile isOpen={isOpen} onClose={handleClose} user={data} />
		</>
	);
};
