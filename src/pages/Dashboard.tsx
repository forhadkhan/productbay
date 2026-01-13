import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Product Tables</h1>
                <Link to="/new" >
                    <span className="border border-blue-600 px-4 py-2 rounded hover:bg-blue-700 hover:text-white">Create New Table</span>
                </Link>
            </div>
            <div className="p-6 text-xl text-center text-gray-500">
                No tables found. Create one to get started!
            </div>
        </div>
    );
};
export default Dashboard;
