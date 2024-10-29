import { Button, Link } from '@nextui-org/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useLazyCurrentQuery, useLoginMutation } from '../app/services/userApi';
import { Input } from '../components/input';

type Login = {
	email: string;
	password: string;
};

type Props = {
	setSelected: (value: string) => void;
};

export const Login: React.FC<Props> = ({ setSelected }) => {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<Login>({
		mode: 'onChange',
		reValidateMode: 'onBlur',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const [login, { isLoading }] = useLoginMutation();
	const navigate = useNavigate();
	const [error, setError] = React.useState('');
	const [triggerCurrentCuery] = useLazyCurrentQuery();

	const onSubmit = async (data: Login) => {
		try {
			await login(data).unwrap()
		} catch (error) {}
	};

	return (
		<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
			<Input
				name='email'
				control={control}
				label='Email'
				type='email'
				required='Обязательное поле'
			/>
			<Input
				name='password'
				control={control}
				label='Пароль'
				type='password'
				required='Обязательное поле'
			/>

			<p className='text-center text-small'>
				Нет аккаунта?{' '}
				<Link
					size='sm'
					className='cursor-pointer'
					onPress={() => setSelected('sign-up')}
				>
					Зарегистируйтесь
				</Link>
			</p>
			<div className='flex gap-2 justify-end'>
				<Button fullWidth color='primary' type='submit' isLoading={isLoading}>
					Войти
				</Button>
			</div>
		</form>
	);
};
