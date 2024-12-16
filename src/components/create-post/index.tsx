import { Button, Textarea, Input } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { IoMdCreate } from 'react-icons/io';
import {
	useCreatePostMutation,
	useLazyGetAllPostsQuery,
} from '../../app/services/postsApi';
import { ErrorMessage } from '../error-message';
import { useState } from 'react';

export const CreatePost = () => {
	const [createPost] = useCreatePostMutation();
	const [triggerAllPosts] = useLazyGetAllPostsQuery();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
	} = useForm();

	const error = errors?.post?.message as string;

	// Обработчик для выбора файла
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSelectedFile(e.target.files[0]);
		}
	};

	const onSubmit = handleSubmit(async data => {
		try {
			const formData = new FormData();
			formData.append('content', data.post);
			if (selectedFile) {
				formData.append('file', selectedFile); // Добавляем файл
			}

			await createPost(formData).unwrap();
			setValue('post', '');
			setSelectedFile(null); // Сбрасываем выбранный файл
			await triggerAllPosts().unwrap();
		} catch (error) {
			console.log(error);
		}
	});

	return (
		<form className='flex-grow' onSubmit={onSubmit}>
			<Controller
				name='post'
				control={control}
				defaultValue=''
				rules={{ required: 'Обязательное поле' }}
				render={({ field }) => (
					<Textarea
						{...field}
						labelPlacement='outside'
						placeholder='О чем думаете?'
						className='mb-5'
					/>
				)}
			/>

			{/* Поле для загрузки файла */}
			<Input
				type='file'
				onChange={handleFileChange}
				className='mb-5'
			/>

			{errors && <ErrorMessage error={error} />}
			<Button
				color='success'
				className='flex-end'
				endContent={<IoMdCreate />}
				type='submit'
			>
				Добавить пост
			</Button>
		</form>
	);
};
