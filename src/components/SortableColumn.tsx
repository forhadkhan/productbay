import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { List, Settings, GripVertical } from 'lucide-react';

interface Props {
    id: string;
    label: string;
}

export function SortableColumn({ id, label }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="p-4 flex items-center justify-between hover:bg-gray-50 bg-white border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
                <button {...attributes} {...listeners} className="text-gray-400 cursor-move hover:text-gray-600">
                    <GripVertical size={16} />
                </button>
                <span className="font-medium text-gray-700">{label}</span>
            </div>
            <button className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition-colors">
                <Settings size={16} />
            </button>
        </div>
    );
}
