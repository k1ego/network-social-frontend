import { Button, Textarea } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { IoMdCreate } from 'react-icons/io';
import { GoPaperclip } from 'react-icons/go';
import { IoCloseCircleOutline } from 'react-icons/io5'; 
import {
	useCreatePostMutation,
	useLazyGetAllPostsQuery,
} from '../../app/services/postsApi';
import { ErrorMessage } from '../error-message';
import { useRef, useState } from 'react';

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

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSelectedFile(e.target.files[0]);
		}
	};

	const handleIconClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemoveFile = () => {
		setSelectedFile(null); 
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const onSubmit = handleSubmit(async data => {
		try {
			const formData = new FormData();
			formData.append('content', data.post);
			if (selectedFile) {
				formData.append('file', selectedFile);
			}

			await createPost(formData).unwrap();
			setValue('post', '');
			setSelectedFile(null);
			await triggerAllPosts().unwrap();
		} catch (error) {
			console.log(error);
		}
	});

	return (
		<form className='flex-grow' onSubmit={onSubmit}>
			<div className='flex items-center mb-5 gap-3'>
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
							className='flex-grow'
						/>
					)}
				/>

				{/* Иконка скрепки */}
				<div
					onClick={handleIconClick}
					className='cursor-pointer text-blue-500 hover:text-blue-700'
					title='Прикрепить файл'
				>
					<GoPaperclip size={24} />
				</div>

				{/* Скрытый input для загрузки файла */}
				<input
					type='file'
					ref={fileInputRef}
					onChange={handleFileChange}
					className='hidden'
				/>
			</div>

			{/* Отображение выбранного файла с крестиком */}
			{selectedFile && (
				<div className='flex items-center gap-2 mb-3 text-default-500'>
					<p className='text-sm'>{selectedFile.name}</p>
					<button
						type='button'
						onClick={handleRemoveFile}
						className='text-red-500 hover:text-red-700'
						title='Удалить файл'
					>
						<IoCloseCircleOutline size={20} />
					</button>
				</div>
			)}

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
