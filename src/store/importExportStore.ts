import { create } from 'zustand';
import type { ProductTable } from '@/types';

/**
 * Interface for the Import/Export Store
 */
interface ImportExportStore {
	/** Whether the import modal is currently visible */
	importModalOpen: boolean;
	/** Whether the export modal is currently visible */
	exportModalOpen: boolean;
	/** IDs of tables selected for export */
	exportTableIds: number[];
	/** List of all available tables (for selection in export modal) */
	availableTables: ProductTable[];

	/** Opens the import modal */
	openImportModal: () => void;
	/** Closes the import modal */
	closeImportModal: () => void;
	/**
	 * Opens the export modal
	 * @param tables All available tables to choose from
	 * @param preSelectedIds Optional IDs to pre-select for export
	 */
	openExportModal: (tables: ProductTable[], preSelectedIds?: number[]) => void;
	/** Closes the export modal and resets selection */
	closeExportModal: () => void;
	/** Toggles selection of a table ID for export */
	toggleTableSelection: (id: number) => void;
	/** Sets the entire export selection */
	setExportSelection: (ids: number[]) => void;
}

/**
 * useImportExportStore
 *
 * Store for managing the state of the Import/Export UI.
 * This store is used by both the Free plugin (to trigger modals)
 * and the Pro plugin (to render the modal content via SlotFill).
 *
 * @since 1.2.0
 */
export const useImportExportStore = create<ImportExportStore>((set) => ({
	importModalOpen: false,
	exportModalOpen: false,
	exportTableIds: [],
	availableTables: [],

	openImportModal: () =>
		set({
			importModalOpen: true,
			exportModalOpen: false,
		}),

	closeImportModal: () =>
		set({
			importModalOpen: false,
		}),

	openExportModal: (tables, preSelectedIds = []) =>
		set({
			exportModalOpen: true,
			importModalOpen: false,
			availableTables: tables,
			exportTableIds: preSelectedIds,
		}),

	closeExportModal: () =>
		set({
			exportModalOpen: false,
			exportTableIds: [],
		}),

	toggleTableSelection: (id) =>
		set((state) => ({
			exportTableIds: state.exportTableIds.includes(id)
				? state.exportTableIds.filter((pId) => pId !== id)
				: [...state.exportTableIds, id],
		})),

	setExportSelection: (ids) =>
		set({
			exportTableIds: ids,
		}),
}));
