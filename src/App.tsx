import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from './components/ui/Toaster';
import AdminLayout from './layouts/AdminLayout';
import { routes } from './utils/routes';

const App = () => {
	return (
		<HashRouter>
			<ToastProvider>
				<AdminLayout>
					<Routes>
						{routes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={<route.element />}
							/>
						))}
					</Routes>
					<Toaster />
				</AdminLayout>
			</ToastProvider>
		</HashRouter>
	);
};

export default App;
