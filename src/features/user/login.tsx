import { Button, Link } from '@nextui-org/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
	useLazyCurrentQuery,
	useLoginMutation,
} from '../../app/services/userApi';
import { ErrorMessage } from '../../components/error-message';
import { Input } from '../../components/input';
import { hasErrorField } from '../../utils/has-error-field';

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
	const [triggerCurrentQuery] = useLazyCurrentQuery();

	const onSubmit = async (data: Login) => {
		try {
			await login(data).unwrap();
			await triggerCurrentQuery().unwrap();
			navigate('/');
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error);
			}
		}
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
			<ErrorMessage error={error} />
			<p className='text-center text-small'>
				Нет аккаунта?{' '}
				<Link
					size='sm'
					className='cursor-pointer'
					onPress={() => setSelected('sign-up')}
				>
					Зарегистрироваться
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
