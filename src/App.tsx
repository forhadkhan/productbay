/**
 * Root App component that sets up the routing and global providers.
 * Handles HashRouter, ToastProvider, and the main AdminLayout.
 */
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from './components/ui/Toaster';
import AdminLayout from './layouts/AdminLayout';
import { routes } from './utils/routes';
import { SlotFillProvider } from '@wordpress/components';
import { useExtensionStore } from './store/extensionStore';

const ExtensionFills = () => {
    const fills = useExtensionStore((state) => state.fills);
    return (
        <>
            {fills.map((Fill, i) => <Fill key={i} />)}
        </>
    );
};

const App = () => {
	return (
		<HashRouter>
			<SlotFillProvider>
				<ExtensionFills />
				<ToastProvider>
					<AdminLayout>
						<Routes>
							{routes.map((route, index) => (
								<Route
									key={index}
									path={route.path}
									element={<route.element />}
								/>
							))}
						</Routes>
						<Toaster />
					</AdminLayout>
				</ToastProvider>
			</SlotFillProvider>
		</HashRouter>
	);
};

export default App;
