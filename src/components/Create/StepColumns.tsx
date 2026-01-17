import { StepHeading } from './StepHeading';
import { SortableColumn } from '../SortableColumn';
import { useTableStore } from '../../store/tableStore';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';

interface StepProps {
    showValidation?: boolean;
}

const StepColumns = ({ showValidation }: StepProps) => {
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
            <StepHeading title="Column Manager" />
            <p className="text-sm text-blue-700 mt-0">
                Drag and drop columns to reorder. These columns will be displayed in the frontend.
            </p>
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
