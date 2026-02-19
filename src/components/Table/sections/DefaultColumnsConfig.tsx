import { __ } from '@wordpress/i18n';
import type { Column } from '@/types';
import ColumnEditor from './ColumnEditor';

export interface DefaultColumnsConfigProps {
    columns: Column[];
    onChange: (columns: Column[]) => void;
}

export const DefaultColumnsConfig = ({ columns, onChange }: DefaultColumnsConfigProps) => {

    // Helpers to manage the local array of columns for the settings
    // (Since we are modifying the 'columns' array in the settings object directly)

    const handleAddColumn = (column: Column) => {
        onChange([...columns, column]);
    };

    const handleRemoveColumn = (columnId: string) => {
        onChange(columns.filter(col => col.id !== columnId));
    };

    const handleReorderColumns = (oldIndex: number, newIndex: number) => {
        const newColumns = [...columns];
        const [removed] = newColumns.splice(oldIndex, 1);
        newColumns.splice(newIndex, 0, removed);

        // Update order property
        const reordered = newColumns.map((col, index) => ({
            ...col,
            advanced: { ...col.advanced, order: index + 1 }
        }));

        onChange(reordered);
    };

    const handleUpdateColumn = (columnId: string, updates: Partial<Column>) => {
        onChange(columns.map(col =>
            col.id === columnId ? { ...col, ...updates } : col
        ));
    };

    return (
        <div>
            <ColumnEditor
                columns={columns}
                onAddColumn={handleAddColumn}
                onRemoveColumn={handleRemoveColumn}
                onReorderColumns={handleReorderColumns}
                onUpdateColumn={handleUpdateColumn}
            />
        </div>
    );
};

export default DefaultColumnsConfig;