import { Input as NextInput } from '@nextui-org/react';
import { Control, useController } from 'react-hook-form';

type Props = {
	name: string;
	label: string;
	placeholder?: string;
	type?: string;
	control: Control<any>;
	required?: string;
	endContent?: JSX.Element;
};

export const Input: React.FC<Props> = ({
	name,
	label,
	placeholder,
	type,
	control,
	required = '',
	endContent,
}) => {
	const {
		field,
		fieldState: { invalid },
		formState: { errors },
	} = useController({ name, control, rules: { required }, defaultValue: '' });
	return (
		<NextInput
			id={name}
			label={label}
			placeholder={placeholder}
			type={type}
			value={field.value}
			name={field.name}
			isInvalid={invalid}
			onChange={field.onChange}
			onBlur={field.onBlur}
			errorMessage={`${errors[name]?.message ?? ''}`}
		/>
	);
};
