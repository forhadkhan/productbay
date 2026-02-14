import { apiFetch } from '@/utils/api';
import { PATHS, WC_PRODUCTS_PATH } from '@/utils/routes';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/context/ToastContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSystemStore } from '@/store/systemStore';
import { SearchIcon, CopyIcon, ChevronLeftIcon, ChevronRightIcon, FilterIcon, XIcon, Loader2Icon, DownloadIcon, UploadIcon, PlusIcon, PackageIcon } from 'lucide-react';

interface Table {
	id: number;
	title: string;
	shortcode: string;
	date: string;
	status: string; // 'publish' | 'draft' etc.
	source?: any;
	columns?: any[];
	settings?: any;
	style?: any;
}

/**
 * Bulk action options for table management
 */
const BULK_OPTIONS = [
	{ label: __('Delete', 'productbay'), value: 'delete' },
	{ label: __('Set Active', 'productbay'), value: 'active' },
	{ label: __('Set Inactive', 'productbay'), value: 'inactive' },
];

/**
 * Rows per page pagination options
 */
const ROWS_PER_PAGE_OPTIONS = [
	{ label: '10', value: '10' },
	{ label: '20', value: '20' },
	{ label: '50', value: '50' },
	{ label: '100', value: '100' },
	{ label: __('Custom', 'productbay'), value: 'custom' },
];

/**
 * Status filter options for table listing
 */
const FILTER_OPTIONS = [
	{ label: __('All Status', 'productbay'), value: 'all' },
	{ label: __('Active', 'productbay'), value: 'publish' },
	{ label: __('Inactive', 'productbay'), value: 'draft' },
];

/**
 * Modal state for different actions
 */
interface ModalState {
	type: 'delete' | 'duplicate' | 'toggle' | null;
	tableId: number | null;
	tableName: string;
	currentStatus?: string;
}

/**
 * Tables Page Component
 *
 * Lists all ProductBay tables with search, filter, bulk actions, and pagination.
 */
const Tables = () => {
	const [tables, setTables] = useState<Table[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// UI States
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [selectedBulkAction, setSelectedBulkAction] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [jumpPage, setJumpPage] = useState('');
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [isCustomPerPage, setIsCustomPerPage] = useState(false);

	// Use the system store instead of local state
	const { status, loading, fetchStatus, error } = useSystemStore();

	useEffect(() => {
		// Fetch fresh data on mount (background update if data exists)
		fetchStatus();
	}, [fetchStatus]);

	// Modal state
	const [modalState, setModalState] = useState<ModalState>({
		type: null,
		tableId: null,
		tableName: '',
	});

	// Action loading state - tracks which table is being acted upon
	const [actionLoading, setActionLoading] = useState<Record<number, string>>({});

	// Toast hook
	const { toast } = useToast();

	useEffect(() => {
		loadTables();
	}, []);

	const loadTables = async () => {
		try {
			const data = await apiFetch<Table[]>('tables');
			setTables(data);
		} catch (error) {
			console.error(error);
			toast({
				title: __('Error', 'productbay'),
				description: __('Failed to load tables', 'productbay'),
				type: 'error'
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Open delete modal
	const openDeleteModal = (id: number, title: string) => {
		setModalState({ type: 'delete', tableId: id, tableName: title });
	};

	// Open duplicate modal
	const openDuplicateModal = (id: number, title: string) => {
		setModalState({ type: 'duplicate', tableId: id, tableName: title });
	};

	// Open toggle status modal
	const openToggleModal = (id: number, title: string, currentStatus: string) => {
		setModalState({ type: 'toggle', tableId: id, tableName: title, currentStatus });
	};

	// Close modal
	const closeModal = () => {
		setModalState({ type: null, tableId: null, tableName: '' });
	};

	// Handle delete action
	const handleDelete = async () => {
		if (!modalState.tableId) return;

		const id = modalState.tableId;
		setActionLoading(prev => ({ ...prev, [id]: 'delete' }));
		closeModal();

		try {
			await apiFetch(`tables/${id}`, { method: 'DELETE' });
			setTables(prev => prev.filter(t => t.id !== id));
			toast({
				title: __('Success', 'productbay'),
				description: __('Table deleted successfully', 'productbay'),
				type: 'success'
			});
		} catch (error) {
			console.error(error);
			toast({
				title: __('Error', 'productbay'),
				description: __('Failed to delete table', 'productbay'),
				type: 'error'
			});
		} finally {
			setActionLoading(prev => {
				const newState = { ...prev };
				delete newState[id];
				return newState;
			});
		}
	};

	// Handle duplicate action
	const handleDuplicate = async () => {
		if (!modalState.tableId) return;

		const id = modalState.tableId;
		const tableToClone = tables.find(t => t.id === id);
		if (!tableToClone) return;

		setActionLoading(prev => ({ ...prev, [id]: 'duplicate' }));
		closeModal();

		try {
			// Create payload with duplicated data
			const payload = {
				title: `${tableToClone.title} (Copy)`,
				status: 'draft', // New duplicates start as draft
				source: tableToClone.source || {},
				columns: tableToClone.columns || [],
				settings: tableToClone.settings || {},
				style: tableToClone.style || {},
			};

			const newTable = await apiFetch<Table>('tables', {
				method: 'POST',
				body: JSON.stringify({ data: payload })
			});

			setTables(prev => [newTable, ...prev]);
			toast({
				title: __('Success', 'productbay'),
				description: __('Table duplicated successfully', 'productbay'),
				type: 'success'
			});
		} catch (error) {
			console.error(error);
			toast({
				title: __('Error', 'productbay'),
				description: __('Failed to duplicate table', 'productbay'),
				type: 'error'
			});
		} finally {
			setActionLoading(prev => {
				const newState = { ...prev };
				delete newState[id];
				return newState;
			});
		}
	};

	// Handle toggle active/inactive
	const handleToggleActive = async () => {
		if (!modalState.tableId) return;

		const id = modalState.tableId;
		const table = tables.find(t => t.id === id);
		if (!table) return;

		const newStatus = table.status === 'publish' ? 'draft' : 'publish';
		setActionLoading(prev => ({ ...prev, [id]: 'toggle' }));
		closeModal();

		try {
			const payload = {
				id: table.id,
				title: table.title,
				status: newStatus,
				source: table.source || {},
				columns: table.columns || [],
				settings: table.settings || {},
				style: table.style || {},
			};

			await apiFetch('tables', {
				method: 'POST',
				body: JSON.stringify({ data: payload })
			});

			setTables(prev =>
				prev.map(t => t.id === id ? { ...t, status: newStatus } : t)
			);

			toast({
				title: __('Success', 'productbay'),
				description: newStatus === 'publish'
					? __('Table activated successfully', 'productbay')
					: __('Table deactivated successfully', 'productbay'),
				type: 'success'
			});
		} catch (error) {
			console.error(error);
			toast({
				title: __('Error', 'productbay'),
				description: __('Failed to update table status', 'productbay'),
				type: 'error'
			});
		} finally {
			setActionLoading(prev => {
				const newState = { ...prev };
				delete newState[id];
				return newState;
			});
		}
	};

	const copyShortcode = (shortcode: string) => {
		navigator.clipboard.writeText(shortcode);
		toast({
			title: __('Success', 'productbay'),
			description: __('Shortcode copied to clipboard', 'productbay'),
			type: 'success'
		});
	};

	// Bulk Actions
	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelectedRows(currentTables.map((t) => t.id));
		} else {
			setSelectedRows([]);
		}
	};

	const handleSelectRow = (id: number) => {
		if (selectedRows.includes(id)) {
			setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
		} else {
			setSelectedRows([...selectedRows, id]);
		}
	};

	const handleBulkAction = async () => {
		if (!selectedBulkAction || selectedRows.length === 0) return;

		setIsLoading(true);

		try {
			// Process actions
			if (selectedBulkAction === 'delete') {
				// Delete all selected tables
				await Promise.all(selectedRows.map(id =>
					apiFetch(`tables/${id}`, { method: 'DELETE' })
				));

				// Update local state
				setTables(prev => prev.filter(t => !selectedRows.includes(t.id)));

				toast({
					title: __('Success', 'productbay'),
					description: sprintf(
						__('Deleted %d tables successfully', 'productbay'),
						selectedRows.length
					),
					type: 'success'
				});

			} else if (selectedBulkAction === 'active' || selectedBulkAction === 'inactive') {
				// Determine new status
				const newStatus = selectedBulkAction === 'active' ? 'publish' : 'draft';

				// Process updates for each selected table
				await Promise.all(selectedRows.map(async (id) => {
					const table = tables.find(t => t.id === id);
					if (!table) return;

					// Only update if status is different
					if (table.status === newStatus) return;

					const payload = {
						id: table.id,
						title: table.title,
						status: newStatus,
						source: table.source || {},
						columns: table.columns || [],
						settings: table.settings || {},
						style: table.style || {},
					};

					await apiFetch('tables', {
						method: 'POST',
						body: JSON.stringify({ data: payload })
					});
				}));

				// Update local state
				setTables(prev =>
					prev.map(t => selectedRows.includes(t.id) ? { ...t, status: newStatus } : t)
				);

				toast({
					title: __('Success', 'productbay'),
					description: sprintf(
						__('Updated status for %d tables', 'productbay'),
						selectedRows.length
					),
					type: 'success'
				});
			}

		} catch (error) {
			console.error(error);
			toast({
				title: __('Error', 'productbay'),
				description: __('Failed to apply bulk action', 'productbay'),
				type: 'error'
			});
		} finally {
			setIsLoading(false);
			setSelectedRows([]);
			setSelectedBulkAction('');
		}
	};

	// Filtering & Pagination Logic
	const filteredTables = tables.filter((table) => {
		const matchesSearch =
			table.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			table.shortcode.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter =
			filterStatus === 'all' || table.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	const totalPages = Math.ceil(filteredTables.length / itemsPerPage);
	const currentTables = filteredTables.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="space-y-6">

			{ /* 
				Empty State Products: No Published Products Found
				Shown when the site has zero 'published' WooCommerce products.
				ProductBay requires published products to build and display tables.
			*/ }
			{!isLoading && status?.product_count === 0 && (
				<div className="bg-white p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 mb-6 shadow-sm border border-orange-500">
					<div className="p-4 rounded-2xl text-orange-500 shrink-0">
						<PackageIcon size={32} />
					</div>
					<div className="flex-1 text-center md:text-left">
						<h3 className="text-lg font-bold text-red-950 m-0 pb-1">
							{__('No Published Products Found', 'productbay')}
						</h3>
						<p className="text-gray-600 text-sm max-w-2xl">
							{__('ProductBay requires published WooCommerce products to build your tables.', 'productbay')}
							<br />
							{__("We couldn't find any products in your WooCommerce store yet.", 'productbay')}
							<br />
							{__('Create your first product to start building high-converting tables.', 'productbay')}
						</p>
					</div>
					<div className="shrink-0">
						<Button
							variant="secondary"
							className="cursor-pointer border border-green-500"
							onClick={() =>
								window.open(WC_PRODUCTS_PATH, '_blank')
							}
						>
							<PlusIcon size={18} className="mr-2" />
							{__('Add Products', 'productbay')}
						</Button>
					</div>
				</div>
			)}

			{ /* Header */}
			<div className="flex justify-between items-center">
				{/* Page Title */}
				<h1 className="text-2xl font-bold text-gray-800 m-0">
					<span className="mr-1">{__('All Tables', 'productbay')}</span>
					{loading ? <span className="animate-pulse font-medium">(*)</span> : <span className="font-medium text-gray-600">({status?.table_count})</span>}
				</h1>

				{/* Import-Export */}
				<div className="flex gap-2">
					{/* <Button
						variant="link"
						size="sm"
						className="cursor-pointer bg-transparent hover:bg-white"
						onClick={() =>
							window.open(WC_PRODUCTS_PATH, '_blank')
						}
					>
						<PackageIcon size={18} className="mr-2" />
						{__('Products', 'productbay')}
						{loading ? <span className="ml-2 animate-pulse font-medium">(*)</span> : <span className="ml-2 text-gray-600">({status?.product_count})</span>}
					</Button> */}
					<Button variant="secondary" size="sm" className="flex-1 flex items-center justify-center gap-2 cursor-pointer px-3 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50 text-gray-600 transition-colors">
						<UploadIcon size={14} /> {__('Import', 'productbay')}
					</Button>
					<Button
						variant="secondary"
						size="sm"
						className="flex-1 flex items-center justify-center gap-2 cursor-pointer px-3 py-2 border border-gray-200 rounded text-sm hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						disabled={isLoading || tables.length === 0}
					>
						<DownloadIcon size={14} /> {__('Export', 'productbay')}
					</Button>
				</div>
			</div>

			{ /* Top Menu: Bulk Actions & Search/Filter */}
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
				{ /* Left: Bulk Actions */}
				<div className="flex items-center gap-2 w-full sm:w-auto">
					<div className="w-48">
						<Select
							placeholder={__('Bulk Actions', 'productbay')}
							label={__('Actions', 'productbay')}
							allowDeselect={true}
							options={BULK_OPTIONS}
							value={selectedBulkAction}
							onChange={setSelectedBulkAction}
						/>
					</div>
					<button
						className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-sm border border-gray-300 disabled:opacity-50 transition-colors font-medium h-10"
						disabled={
							selectedRows.length === 0 || !selectedBulkAction
						}
						onClick={handleBulkAction}
					>
						{__('Apply', 'productbay')}
					</button>
					{selectedRows.length > 0 && (
						<span className="text-sm text-gray-500 ml-2">
							{sprintf(__('%d items selected', 'productbay'), selectedRows.length)}
						</span>
					)}
				</div>

				{ /* Right: Search & Filter */}
				<div className="flex items-center gap-2 w-full sm:w-auto">
					{ /* Search */}
					<div className="relative w-full sm:w-64">
						<Input
							type="text"
							placeholder={__('Search tables...', 'productbay')}
							className="pr-9"
							value={searchQuery}
							onChange={(e) =>
								setSearchQuery(e.target.value)
							}
						/>
						{searchQuery ? (
							<button
								onClick={() => setSearchQuery('')}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 bg-transparent rounded hover:bg-gray-200 cursor-pointer flex items-center justify-center"
							>
								<XIcon size={16} />
							</button>
						) : (
							<SearchIcon
								size={16}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
							/>
						)}
					</div>

					{ /* Filter */}
					<div className="w-40">
						<Select
							label={__('Filter by Status', 'productbay')}
							options={FILTER_OPTIONS}
							value={filterStatus}
							allowDeselect={true}
							icon={<FilterIcon className="w-4 h-4" />}
							onChange={setFilterStatus}
						/>
					</div>
				</div>
			</div>

			{ /* Table */}
			<div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
				<table className="w-full text-left border-collapse">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-4 py-4 w-10 text-center">
								<input
									type="checkbox"
									className="rounded border-gray-400 bg-wp-bg text-blue-600 focus:ring-blue-500"
									checked={
										currentTables.length > 0 &&
										selectedRows.length ===
										currentTables.length
									}
									onChange={handleSelectAll}
								/>
							</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
								{__('ID', 'productbay')}
							</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								{__('Title', 'productbay')}
							</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								{__('Shortcode', 'productbay')}
							</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								{__('Product Source', 'productbay')}
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{isLoading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<tr key={i}>
									<td className="px-4 py-4 text-center">
										<Skeleton className="h-4 w-4 rounded mx-auto" />
									</td>
									<td className="px-6 py-4">
										<Skeleton className="h-4 w-8" />
									</td>
									<td className="px-6 py-4">
										<div className="space-y-2">
											<Skeleton className="h-5 w-48" />
										</div>
									</td>
									<td className="px-6 py-4">
										<Skeleton className="h-8 w-24 rounded" />
									</td>
									<td className="px-6 py-4">
										<Skeleton className="h-4 w-24" />
									</td>
								</tr>
							))
						) : currentTables.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="px-6 py-12 text-center text-gray-400"
								>
									{/* Show welcome screen if no tables exist at all */}
									{tables.length === 0 ? (
										<EmptyStateTables />
									) : (
										/* Show not found message if tables exist but are filtered out */
										<div className="flex flex-col items-center justify-center py-8">
											<div className="bg-gray-50 rounded-full p-4 mb-4">
												<SearchIcon size={32} className="text-gray-400" />
											</div>
											<h3 className="text-lg font-medium text-gray-900 mb-1">
												{__('No tables found', 'productbay')}
											</h3>
											<p className="text-gray-500 text-sm max-w-sm text-center mb-6">
												{__(
													'Your search query or filters did not match any tables. Try adjusting your search term or filters.',
													'productbay'
												)}
											</p>
											<Button
												variant="outline"
												onClick={() => {
													setSearchQuery('');
													setFilterStatus('all');
												}}
												className="cursor-pointer"
											>
												{__('Clear Search & Filters', 'productbay')}
											</Button>
										</div>
									)}
								</td>
							</tr>
						) : (
							currentTables.map((table) => {
								const isActing = !!actionLoading[table.id];
								const actionType = actionLoading[table.id];

								return (
									<tr
										key={table.id}
										className={`group hover:bg-gray-50 transition-colors ${isActing ? 'opacity-50' : ''}`}
									>
										<td className="px-4 py-4 text-center">
											<input
												type="checkbox"
												className="rounded border-gray-400 bg-wp-bg text-blue-600 focus:ring-blue-500"
												checked={selectedRows.includes(
													table.id
												)}
												onChange={() =>
													handleSelectRow(table.id)
												}
												disabled={isActing}
											/>
										</td>
										<td className="px-6 py-4 text-sm text-gray-500">
											#{table.id}
										</td>
										<td className="px-6 py-4 relative">
											<div className="font-medium text-wp-text text-base">
												<Link
													to={`/table/${table.id}`}
													className="hover:text-blue-600"
												>
													{table.title}
													{isActing && (
														<Loader2Icon className="w-4 h-4 inline-block ml-2 animate-spin" />
													)}
												</Link>
												{table.status !== 'publish' && (
													<span className="ml-2 text-xs text-gray-400 font-normal italic">
														— {table.status}
													</span>
												)}
											</div>

											{ /* Hover Actions (Visible on group hover) */}
											<div className="flex items-center gap-2 mt-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
												<Link
													to={`/table/${table.id}`}
													className="text-blue-600 hover:underline underline-offset-4 bg-transparent cursor-pointer"
												>
													{__('Edit', 'productbay')}
												</Link>
												<span className="text-gray-300">
													|
												</span>
												<button
													onClick={() =>
														openDuplicateModal(table.id, table.title)
													}
													className="text-blue-600 hover:underline underline-offset-4 bg-transparent cursor-pointer"
													disabled={isActing}
												>
													{__('Duplicate', 'productbay')}
												</button>
												<span className="text-gray-300">
													|
												</span>
												<button
													onClick={() =>
														openToggleModal(
															table.id,
															table.title,
															table.status
														)
													}
													className="text-blue-600 hover:underline underline-offset-4 bg-transparent cursor-pointer"
													disabled={isActing}
												>
													{table.status === 'publish'
														? __('Deactivate', 'productbay')
														: __('Activate', 'productbay')}
												</button>
												<span className="text-gray-300">
													|
												</span>
												<button
													onClick={() =>
														openDeleteModal(table.id, table.title)
													}
													className="text-red-600 hover:underline underline-offset-4 bg-transparent cursor-pointer"
													disabled={isActing}
												>
													{__('Delete', 'productbay')}
												</button>
											</div>
										</td>
										<td className="px-6 py-4">
											<button
												onClick={() =>
													copyShortcode(table.shortcode)
												}
												className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-3 py-2 rounded border border-gray-300 flex items-center gap-1 cursor-pointer font-mono transition-colors"
												disabled={isActing}
											>
												{table.shortcode}
												<CopyIcon className="w-4 h-4 ml-1" />
											</button>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{typeof table.source === 'object' && table.source !== null
												// @ts-ignore
												? (table.source.type || 'Custom')
												: (table.source || 'WooCommerce')
											}
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{ /* Pagination Menu */}
			<div className="flex justify-between items-center">
				{/* Pagination Info */}
				<div className="text-sm text-gray-500 px-1">
					{sprintf(
						__('Showing %1$d to %2$d of %3$d entries', 'productbay'),
						(currentPage - 1) * itemsPerPage + 1,
						Math.min(currentPage * itemsPerPage, filteredTables.length),
						filteredTables.length
					)}
				</div>
				{/* Pagination Controls */}
				<div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-xs border border-gray-200">
					{/* Rows Per Page */}
					<div className="flex items-center justify-center gap-2 h-8 pr-4 border-r border-gray-200 ">
						<span className="text-sm text-gray-500 whitespace-nowrap hidden sm:inline">
							{__('Rows per page:', 'productbay')}
						</span>
						{isCustomPerPage ? (
							<div className="relative w-26">
								<Input
									type="number"
									min={1}
									className="h-8 pr-6 text-xs"
									value={itemsPerPage}
									onChange={(e) => {
										const val = parseInt(e.target.value);
										if (!isNaN(val) && val > 0) {
											setItemsPerPage(val);
											setCurrentPage(1);
										} else if (e.target.value === '') {
											setItemsPerPage(0);
										}
									}}
								/>
								<button
									onClick={() => {
										setItemsPerPage(10);
										setIsCustomPerPage(false);
										setCurrentPage(1);
									}}
									className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									<XIcon className="w-3 h-3" />
								</button>
							</div>
						) : (
							<div className="w-26">
								<Select
									size="xs"
									options={ROWS_PER_PAGE_OPTIONS}
									value={itemsPerPage.toString()}
									onChange={(val) => {
										if (val === 'custom') {
											setIsCustomPerPage(true);
										} else {
											setItemsPerPage(Number(val));
											setCurrentPage(1);
										}
									}}
								/>
							</div>
						)}
					</div>

					<div className="flex items-center gap-2">
						{/* Previous Page Button */}
						<Button
							size="xs"
							variant="outline"
							onClick={() =>
								setCurrentPage((p) => Math.max(1, p - 1))
							}
							disabled={currentPage === 1}
						>
							<ChevronLeftIcon size={16} />
						</Button>
						{/* Page Number Buttons */}
						{Array.from(
							{ length: totalPages },
							(_, i) => i + 1
						).map((page) => (
							<Button
								key={page}
								size="xs"
								variant={
									currentPage === page
										? 'default'
										: 'outline'
								}
								disabled={currentPage === page}
								onClick={() => setCurrentPage(page)}
							>
								{page}
							</Button>
						))}
						{/* Next Page Button */}
						<Button
							size="xs"
							variant="outline"
							onClick={() =>
								setCurrentPage((p) =>
									Math.min(totalPages, p + 1)
								)
							}
							disabled={currentPage === totalPages}
						>
							<ChevronRightIcon size={16} />
						</Button>
					</div>

					{/* Go to Page */}
					<div className="flex items-center gap-2 border-l border-gray-200 pl-4 h-8">
						<span className="text-sm text-gray-500 whitespace-nowrap">
							{__('Go to page', 'productbay')}
						</span>
						<Input
							type="number"
							min={1}
							max={totalPages}
							className="w-16 h-8 text-xs px-2"
							value={jumpPage}
							onChange={(e) => setJumpPage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									const page = parseInt(jumpPage);
									if (
										!isNaN(page) &&
										page >= 1 &&
										page <= totalPages
									) {
										setCurrentPage(page);
										setJumpPage('');
									}
								}
							}}
							placeholder="#"
						/>
					</div>
				</div>
			</div>

			{ /* Delete Confirmation Modal */}
			<Modal
				isOpen={modalState.type === 'delete'}
				onClose={closeModal}
				title={__('Delete Table?', 'productbay')}
				maxWidth="md"
				primaryButton={{
					text: __('Delete', 'productbay'),
					onClick: handleDelete,
					variant: 'danger'
				}}
				secondaryButton={{
					text: __('Cancel', 'productbay'),
					onClick: closeModal,
					variant: 'secondary'
				}}
			>
				<p className="text-gray-700">
					{sprintf(
						__('Are you sure you want to delete "%s"? This action cannot be undone.', 'productbay'),
						modalState.tableName
					)}
				</p>
			</Modal>

			{ /* Duplicate Confirmation Modal */}
			<Modal
				isOpen={modalState.type === 'duplicate'}
				onClose={closeModal}
				title={__('Duplicate Table?', 'productbay')}
				maxWidth="md"
				primaryButton={{
					text: __('Duplicate', 'productbay'),
					onClick: handleDuplicate,
					variant: 'primary'
				}}
				secondaryButton={{
					text: __('Cancel', 'productbay'),
					onClick: closeModal,
					variant: 'secondary'
				}}
			>
				<p className="text-gray-700">
					{sprintf(
						__('Create a copy of "%s"?', 'productbay'),
						modalState.tableName
					)}
				</p>
			</Modal>

			{ /* Toggle Status Confirmation Modal */}
			<Modal
				isOpen={modalState.type === 'toggle'}
				onClose={closeModal}
				title={__('Change Table Status?', 'productbay')}
				maxWidth="md"
				primaryButton={{
					text: modalState.currentStatus === 'publish'
						? __('Deactivate', 'productbay')
						: __('Activate', 'productbay'),
					onClick: handleToggleActive,
					variant: 'primary'
				}}
				secondaryButton={{
					text: __('Cancel', 'productbay'),
					onClick: closeModal,
					variant: 'secondary'
				}}
			>
				<p className="text-gray-700">
					{modalState.currentStatus === 'publish'
						? sprintf(
							__('Are you sure you want to deactivate "%s"?', 'productbay'),
							modalState.tableName
						)
						: sprintf(
							__('Are you sure you want to activate "%s"?', 'productbay'),
							modalState.tableName
						)
					}
				</p>
			</Modal>
		</div>
	);
};

const EmptyStateTables = () => {
	const navigate = useNavigate();

	return (
		<div className="w-full p-8 md:p-16">
			<div className="flex flex-col items-center justify-center text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-10">
				{/* Image Section - Reduced size and added margin */}
				<div className="mb-6 relative">
					{/* Using a max-width to keep the illustration from dominating the screen */}
					<img
						src={`${productBaySettings.pluginUrl}assets/images/clip-boards.svg`}
						alt={__("No tables found", "productbay")}
						className="h-48 w-auto mx-auto opacity-90 no-select"
					/>
				</div>

				{/* Text Content Section */}
				<div className="max-w-md mx-auto">
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						{__('Welcome to ProductBay', 'productbay')}
					</h3>

					<p className="text-gray-500 mb-6 text-sm">
						{__(
							"You haven't created any tables yet. Create your first table to get started!",
							"productbay",
						)}
					</p>

					{/* Call to Action Button */}
					<Button
						type="button"
						onClick={() => navigate(PATHS.NEW)}
						className="cursor-pointer inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
					>
						<PlusIcon size={16} className="mr-2" />
						{__("Create a New Table", "productbay")}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Tables;
