import { Button, Textarea } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { IoMdCreate } from 'react-icons/io';
import {
	useCreatePostMutation,
	useLazyGetAllPostsQuery,
} from '../../app/services/postsApi';
import { ErrorMessage } from '../error-message';

export const CreatePost = () => {
	const [createPost] = useCreatePostMutation();
	const [triggerAllPosts] = useLazyGetAllPostsQuery();

	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
	} = useForm();

	const error = errors?.post?.message as string;

	const onSubmit = handleSubmit(async data => {
		try {
			await createPost({ content: data.post }).unwrap();
			setValue('post', '');
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
