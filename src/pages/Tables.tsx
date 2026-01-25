import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Plus, Search, Trash2, Copy, Edit, ExternalLink } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { PATHS } from '../utils/routes';

interface Table {
    id: number;
    title: string;
    shortcode: string;
    date: string;
    status: string;
}

const Tables = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            const data = await apiFetch<Table[]>('tables');
            setTables(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this table?')) return;
        try {
            await apiFetch(`tables/${id}`, { method: 'DELETE' });
            loadTables();
        } catch (error) {
            alert('Failed to delete table');
        }
    };

    const copyShortcode = (shortcode: string) => {
        navigator.clipboard.writeText(shortcode);
        alert('Shortcode copied!');
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading tables...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">All Tables</h1>
                <Link to={PATHS.NEW} className="bg-wp-btn hover:bg-wp-btn-hover text-white px-4 py-2 rounded-md font-medium flex items-center gap-2">
                    <Plus size={18} />
                    Create New
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Table Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shortcode</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tables.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                    No tables found. Create your first one.
                                </td>
                            </tr>
                        ) : (
                            tables.map((table) => (
                                <tr key={table.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-wp-text text-base">{table.title}</div>
                                        <div className="text-xs text-gray-400 mt-0.5 capitalize">{table.status}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => copyShortcode(table.shortcode)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded border border-gray-300 flex items-center gap-1 font-mono transition-colors"
                                        >
                                            {table.shortcode}
                                            <Copy size={12} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(table.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                to={`/edit/${table.id}`}
                                                className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded"
                                                title="Edit Table"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(table.id)}
                                                className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded"
                                                title="Delete Table"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Tables;
