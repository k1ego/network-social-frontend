import { Button, Link } from '@nextui-org/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRegisterMutation } from '../app/services/userApi';
import { ErrorMessage } from '../components/error-message';
import { Input } from '../components/input';
import { hasErrorField } from '../utils/has-error-field';

type Register = {
	email: string;
	password: string;
	name: string;
};

type Props = {
	setSelected: (value: string) => void;
};

export const Register: React.FC<Props> = ({ setSelected }) => {
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<Register>({
		mode: 'onChange',
		reValidateMode: 'onBlur',
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	const [register, { isLoading }] = useRegisterMutation();
	const [error, setError] = React.useState('');

	const onSubmit = async (data: Register) => {
		try {
			await register(data).unwrap();
			setSelected('login');
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error);
			}
		}
	};

	return (
		<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
			<Input
				name='name'
				control={control}
				label='Имя'
				type='text'
				required='Обязательное поле'
			/>
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
				Уже есть аккаунт?{' '}
				<Link
					size='sm'
					className='cursor-pointer'
					onPress={() => setSelected('login')}
				>
					Войти
				</Link>
			</p>
			<div className='flex gap-2 justify-end'>
				<Button fullWidth color='primary' type='submit' isLoading={isLoading}>
					Зарегистрироваться
				</Button>
			</div>
		</form>
	);
};
