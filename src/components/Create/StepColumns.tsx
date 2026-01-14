import React from 'react';
import { useTableStore } from '../../store/tableStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableColumn } from '../SortableColumn';

const StepColumns = () => {
    const { tableData, setTableData } = useTableStore();

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
            const oldIndex = tableData.columns.findIndex((col) => col.id === active.id);
            const newIndex = tableData.columns.findIndex((col) => col.id === over?.id);

            setTableData({
                columns: arrayMove(tableData.columns, oldIndex, newIndex),
            });
        }
    };

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
                        items={tableData.columns.map((c) => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {tableData.columns.map((col) => (
                            <SortableColumn key={col.id} id={col.id} label={col.label} />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};

export default StepColumns;
