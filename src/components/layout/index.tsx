import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { selectIsAuthenticated, selectUser } from '../../features/user/userSlice';
import { Container } from '../container';
import { Header } from '../header';
import { NavBar } from '../nav-bar';
import { useEffect } from 'react';

export const Layout = () => {
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const user = useSelector(selectUser);
	const navigate = useNavigate();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/auth');
		}
	}, [])
	return (
		<>
			<Header />
			<Container>
				<div className='flex-2 p-4'>
					<NavBar />
				</div>
				<div className='flex-1 p-4'>
					<Outlet />
				</div>
			</Container>
		</>
	);
};
