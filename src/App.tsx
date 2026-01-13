import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import { routes } from './utils/routes';

const App = () => {
    return (
        <HashRouter>
            <div className="productbay-app bg-gray-50 min-h-screen">
                <Navbar />
                <div className="p-8 max-w-7xl mx-auto">
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={<route.element />}
                            />
                        ))}
                    </Routes>
                </div>
            </div>
        </HashRouter>
    );
};

export default App;