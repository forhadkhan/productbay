import { HashRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import { routes } from './utils/routes';

const App = () => {
    return (
        <HashRouter>
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
            </AdminLayout>
        </HashRouter>
    );
};

export default App;