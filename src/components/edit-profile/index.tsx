import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
} from '@nextui-org/react';
import React, { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdOutlineEmail } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useUpdateUserMutation } from '../../app/services/userApi';
import { User } from '../../app/types';
import { hasErrorField } from '../../utils/has-error-field';
import { ErrorMessage } from '../error-message';
import { Input } from '../input';
import { ThemeContext } from '../theme-provider';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	user?: User;
};

export const EditProfile: React.FC<Props> = ({ isOpen, onClose, user }) => {
	const { theme } = useContext(ThemeContext);
	const [updateUser, { isLoading }] = useUpdateUserMutation();
	const [error, setError] = React.useState('');
	const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
	const { id } = useParams<{ id: string }>();

	const { handleSubmit, control } = useForm<User>({
		mode: 'onChange',
		reValidateMode: 'onBlur',
		defaultValues: {
			email: user?.email,
			name: user?.name,
			dateOfBirth: user?.dateOfBirth,
			bio: user?.bio,
			location: user?.location,
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files !== null) {
			setSelectedFile(e.target.files[0]);
		}
	};

	const onSubmit = async (data: User) => {
		if (id) {
			try {
				const formData = new FormData();
				data.name && formData.append('name', data.name);
				data.email &&
					data.email !== user?.email &&
					formData.append('email', data.email);
				data.dateOfBirth &&
					formData.append(
						'dateOfBirth',
						new Date(data.dateOfBirth).toISOString()
					);
				data.bio && formData.append('bio', data.bio);
				data.location && formData.append('location', data.location);
				selectedFile && formData.append('avatar', selectedFile);

				await updateUser({ userData: formData, id }).unwrap();
				onClose();
			} catch (error) {
				if (hasErrorField(error)) {
					setError(error.data.error);
				}
			}
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			className={`${theme} text-foreground`}
			backdrop="blur"
		>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							Изменение профиля
						</ModalHeader>
						<ModalBody>
							<form
								className='flex flex-col gap-4'
								onSubmit={handleSubmit(onSubmit)}
							>
								<Input
									control={control}
									name='email'
									label='Email'
									type='email'
									endContent={<MdOutlineEmail />}
								/>
								<Input control={control} name='name' label='Имя' type='name' />
								<input
									type='file'
									name='avatarUrl'
									placeholder='Выберите файл'
									onChange={handleFileChange}
								/>
								<Input
									control={control}
									name='dateOfBirth'
									label='Дата рождения'
									type='date'
									placeholder='Выберите дату рождения'
								/>
								<Controller
									name='bio'
									control={control}
									render={({ field }) => (
										<Textarea
											{...field}
											rows={4}
											placeholder='Расскажите о себе'
										/>
									)}
								/>
								<Input
									control={control}
									name='location'
									label='Местоположение'
									type='text'
								/>
								<ErrorMessage error={error} />
								<div className='flex gap-2 justify-end'>
									<Button
										fullWidth
										color='primary'
										type='submit'
										isLoading={isLoading}
									>
										Обновить профиль
									</Button>
								</div>
							</form>
						</ModalBody>
						<ModalFooter>
							<Button color='danger' variant='light' onPress={onClose}>
								Закрыть
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
