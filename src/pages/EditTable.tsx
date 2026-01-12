import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronRight, ChevronLeft, Layout, List, Database, Settings, Search, Palette, Zap, CheckCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';
import { PATHS } from '../utils/routes';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableColumn } from '../components/SortableColumn';

const STEPS = [
    { id: 1, label: 'Setup', icon: Layout },
    { id: 2, label: 'Source', icon: Database },
    { id: 3, label: 'Columns', icon: List },
    { id: 4, label: 'Options', icon: Settings },
    { id: 5, label: 'Search', icon: Search },
    { id: 6, label: 'Design', icon: Palette },
    { id: 7, label: 'Performance', icon: Zap },
    { id: 8, label: 'Publish', icon: CheckCircle },
];

const EditTable = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(!!id);
    const [tableData, setTableData] = useState({
        title: '',
        source_type: 'all',
        columns: [],
        config: {}
    });

    useEffect(() => {
        if (id) {
            loadTable(parseInt(id));
        }
    }, [id]);

    const loadTable = async (tableId: number) => {
        try {
            const data = await apiFetch<any>(`tables/${tableId}`);
            setTableData({
                title: data.title,
                ...data.config
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await apiFetch('tables', {
                method: 'POST',
                body: JSON.stringify({
                    id: id,
                    ...tableData
                })
            });
            alert('Table saved successfully!');
            navigate(PATHS.DASHBOARD);
        } catch (error) {
            alert('Failed to save table');
        }
    };

    // Sensors for DnD
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setTableData((prev) => {
                const oldIndex = prev.columns.findIndex((col: any) => col.id === active.id);
                const newIndex = prev.columns.findIndex((col: any) => col.id === over?.id);

                return {
                    ...prev,
                    columns: arrayMove(prev.columns, oldIndex, newIndex),
                };
            });
        }
    };

    // Initialize columns if empty
    useEffect(() => {
        if (loading) return;
        if (!tableData.columns || tableData.columns.length === 0) {
            setTableData(prev => ({
                ...prev,
                columns: [
                    { id: 'image', label: 'Image' },
                    { id: 'name', label: 'Product Name' },
                    { id: 'price', label: 'Price' },
                    { id: 'add-to-cart', label: 'Add to Cart' }
                ]
            }));
        }
    }, [loading]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Setup
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Table Name</label>
                            <input
                                type="text"
                                value={tableData.title}
                                onChange={(e) => setTableData({ ...tableData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. Summer Sale Products"
                            />
                            <p className="mt-1 text-sm text-gray-500">Give your table a descriptive name for internal use.</p>
                        </div>
                    </div>
                );

            case 2: // Source
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Select Products Source</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['all', 'category', 'specific'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setTableData({ ...tableData, source_type: type })}
                                        className={`p-4 border rounded-lg text-left transition-all ${tableData.source_type === type
                                            ? 'border-blue-500 ring-2 ring-blue-50 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="font-semibold capitalize text-gray-900">{type === 'all' ? 'All Products' : type}</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {type === 'all' && 'Display all published products from your store.'}
                                            {type === 'category' && 'Select specific categories or tags to display.'}
                                            {type === 'specific' && 'Manually select individual products.'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {tableData.source_type === 'category' && (
                            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
                                Category Selection Component will go here.
                            </div>
                        )}
                        {tableData.source_type === 'specific' && (
                            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-200">
                                Product Search Component will go here.
                            </div>
                        )}
                    </div>
                );



            case 3: // Columns
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-bold text-blue-800 mb-2">Column Manager</h3>
                            <p className="text-sm text-blue-700">
                                Drag and drop columns to reorder. These columns will be displayed in the frontend.
                            </p>
                        </div>
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={tableData.columns.map((c: any) => c.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {tableData.columns.map((col: any) => (
                                        <SortableColumn key={col.id} id={col.id} label={col.label} />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>
                );

            case 4: // Options
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">AJAX Loading</h3>
                                <p className="text-sm text-gray-500">Load products without refreshing the page.</p>
                            </div>
                            <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Quantity Picker</h3>
                                <p className="text-sm text-gray-500">Show quantity input next to add to cart.</p>
                            </div>
                            <input type="checkbox" className="toggle" />
                        </div>
                    </div>
                );

            case 5: // Search & Sort
                return (
                    <div className="space-y-6">
                        <div className="p-4 border rounded-lg">
                            <label className="block text-sm font-medium mb-2">Default Sort Order</label>
                            <select className="w-full border-gray-300 rounded-md">
                                <option>Newest First</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Name: A to Z</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Enable Search Box</h3>
                                <p className="text-sm text-gray-500">Allow users to search within the table.</p>
                            </div>
                            <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                    </div>
                );

            case 6: // Design
                return (
                    <div className="grid grid-cols-2 gap-8 h-full">
                        <div className="space-y-6 overflow-y-auto pr-4">
                            <h3 className="font-bold text-gray-800">Design Settings</h3>
                            <div>
                                <label className="block text-sm font-medium mb-2">Border Color</label>
                                <div className="flex gap-2">
                                    {['#e5e7eb', '#d1d5db', '#9ca3af', '#2563eb'].map(c => (
                                        <button key={c} className="w-8 h-8 rounded-full border shadow-sm" style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Header Background</label>
                                <div className="flex gap-2">
                                    {['#f9fafb', '#f3f4f6', '#eff6ff', '#f0fdf4'].map(c => (
                                        <button key={c} className="w-8 h-8 rounded-md border shadow-sm" style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-gray-400">Live Preview Area</div>
                        </div>
                    </div>
                );

            case 7: // Performance
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Lazy Load Images</h3>
                                <p className="text-sm text-gray-500">Improve initial page load time.</p>
                            </div>
                            <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h3 className="font-medium">Cache Results</h3>
                                <p className="text-sm text-gray-500">Cache query results for faster subsequent loads.</p>
                            </div>
                            <input type="checkbox" className="toggle" />
                        </div>
                    </div>
                );

            case 8: // Publish
                return (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Publish!</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Your table is configured and ready to go. Click the button below to save and get your shortcode.
                        </p>
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Save size={20} />
                            Publish Table
                        </button>
                    </div>
                );
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="flex h-[calc(100vh-100px)] -m-8 bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800">Table Builder</h2>
                    <p className="text-xs text-gray-400 mt-1">{id ? 'Editing Table' : 'New Table'}</p>
                </div>
                <nav className="p-4 space-y-1">
                    {STEPS.map((step) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStep(step.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : isCompleted
                                        ? 'text-gray-700 hover:bg-gray-50'
                                        : 'text-gray-400 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`p-1.5 rounded-md ${isActive ? 'bg-blue-100 text-blue-600' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                                    }`}>
                                    <Icon size={16} />
                                </div>
                                {step.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">{STEPS[currentStep - 1].label}</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                            disabled={currentStep === 1}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50"
                        >
                            Back
                        </button>
                        {currentStep < 8 ? (
                            <button
                                onClick={() => setCurrentStep(prev => Math.min(8, prev + 1))}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                            >
                                Next Step <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                            >
                                <Save size={16} /> Save & Publish
                            </button>
                        )}
                    </div>
                </header>

                {/* Step Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[500px]">
                        {renderStepContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};
