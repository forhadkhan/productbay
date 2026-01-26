import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { useEffect, useState } from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '../components/ui/Select';
import { SearchIcon, CopyIcon, ChevronLeftIcon, ChevronRightIcon, FilterIcon, XIcon } from 'lucide-react';

interface Table {
	id: number;
	title: string;
	shortcode: string;
	date: string;
	status: string; // 'publish' | 'draft' etc.
	source?: string; // Optional for now, assuming API might not send it yet
}

const BULK_OPTIONS = [
	{ label: 'Delete', value: 'delete' },
	{ label: 'Set Active', value: 'active' },
	{ label: 'Set Deactive', value: 'deactive' },
];

const ROWS_PER_PAGE_OPTIONS = [
	{ label: '10', value: '10' },
	{ label: '20', value: '20' },
	{ label: '50', value: '50' },
	{ label: '100', value: '100' },
	{ label: 'Custom', value: 'custom' },
];

const FILTER_OPTIONS = [
	{ label: 'All Dates', value: 'all' },
	{ label: 'Published', value: 'publish' },
	{ label: 'Drafts', value: 'draft' },
	{ label: 'Trash', value: 'trash' },
];

const Tables = () => {
	const [tables, setTables] = useState<Table[]>([]);
	const [loading, setLoading] = useState(true);

	// UI States
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [selectedBulkAction, setSelectedBulkAction] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [jumpPage, setJumpPage] = useState('');
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [isCustomPerPage, setIsCustomPerPage] = useState(false);

	useEffect(() => {
		loadTables();
	}, []);

	const loadTables = async () => {
		try {
			const data = await apiFetch<Table[]>('tables');
			// Mocking source for demo if missing
			const enrichedData = data.map((t) => ({
				...t,
				source: t.source || 'WooCommerce', // Default source
			}));
			setTables(enrichedData);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// Actions
	const handleDelete = async (id: number) => {
		if (!confirm('Are you sure you want to delete this table?'))
			return;
		try {
			await apiFetch(`tables/${id}`, { method: 'DELETE' });
			loadTables();
		} catch (error) {
			alert('Failed to delete table');
		}
	};

	const handleDuplicate = (id: number) => {
		// Placeholder for duplication logic
		const tableToClone = tables.find((t) => t.id === id);
		if (tableToClone) {
			// Logic to call API would go here
			alert(`Duplicate functionality for Table ID: ${id}`);
		}
	};

	const handleToggleActive = (id: number, currentStatus: string) => {
		// Placeholder for toggle active/deactive
		alert(
			`Toggle Active/Deactive for Table ID: ${id}. Current: ${currentStatus}`
		);
		// Optimistic update for UI demo
		setTables(
			tables.map((t) =>
				t.id === id
					? {
						...t,
						status:
							t.status === 'publish' ? 'draft' : 'publish',
					}
					: t
			)
		);
	};

	const copyShortcode = (shortcode: string) => {
		navigator.clipboard.writeText(shortcode);
		alert('Shortcode copied!');
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

	const handleBulkAction = () => {
		if (!selectedBulkAction || selectedRows.length === 0) return;
		alert(
			`Performing "${selectedBulkAction}" on items: ${selectedRows.join(
				', '
			)}`
		);
		setSelectedRows([]); // Reset selection
		setSelectedBulkAction('');
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

	if (loading)
		return (
			<div className="p-8 text-center text-gray-500">
				Loading tables...
			</div>
		);

	function handlePreview(id: number): void {
		throw new Error('Function not implemented.');
	}

	return (
		<div className="space-y-6">
			{ /* Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-gray-800">All Tables</h1>
			</div>

			{ /* Top Menu: Bulk Actions & Search/Filter */}
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
				{ /* Left: Bulk Actions */}
				<div className="flex items-center gap-2 w-full sm:w-auto">
					<div className="w-48">
						<Select
							placeholder="Bulk Actions"
							label="Actions"
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
						Apply
					</button>
					{selectedRows.length > 0 && (
						<span className="text-sm text-gray-500 ml-2">
							{selectedRows.length} items selected
						</span>
					)}
				</div>

				{ /* Right: Search & Filter */}
				<div className="flex items-center gap-2 w-full sm:w-auto">
					{ /* Filter */}
					<div className="w-40">
						<Select
							label="Filter by Status"
							options={FILTER_OPTIONS}
							value={filterStatus}
							allowDeselect={true}
							icon={<FilterIcon className="w-4 h-4" />}
							onChange={setFilterStatus}
						/>
					</div>

					{ /* Search */}
					<div className="relative w-full sm:w-64">
						<SearchIcon
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
						/>
						<Input
							type="text"
							placeholder="Search tables..."
							className="pl-9"
							value={searchQuery}
							onChange={(e) =>
								setSearchQuery(e.target.value)
							}
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
								ID
							</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Title
							</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Shortcode
							</th>
							<th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Product Source
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{currentTables.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="px-6 py-12 text-center text-gray-400"
								>
									No tables found matching your criteria.
								</td>
							</tr>
						) : (
							currentTables.map((table) => (
								<tr
									key={table.id}
									className="group hover:bg-gray-50 transition-colors"
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
										/>
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										#{table.id}
									</td>
									<td className="px-6 py-4 relative">
										<div className="font-medium text-wp-text text-base">
											<Link
												to={`/edit/${table.id}`}
												className="hover:text-blue-600"
											>
												{table.title}
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
												to={`/edit/${table.id}`}
												className="text-blue-600 hover:underline underline-offset-4 bg-transparent cursor-pointer"
											>
												Edit
											</Link>
											<span className="text-gray-300">
												|
											</span>
											<button
												onClick={() =>
													handleDuplicate(table.id)
												}
												className="text-blue-600 hover:underline underline-offset-4 bg-transparent cursor-pointer"
											>
												Duplicate
											</button>
											<span className="text-gray-300">
												|
											</span>
											<button
												onClick={() =>
													handlePreview(table.id)
												}
												className="text-blue-600 hover:underline underline-offset-4 bg-transparent cursor-pointer"
											>
												Preview
											</button>
											<span className="text-gray-300">
												|
											</span>
											<button
												onClick={() =>
													handleToggleActive(
														table.id,
														table.status
													)
												}
												className="text-blue-600 hover:underline underline-offset-4 bg-transparent cursor-pointer"
											>
												{table.status === 'publish'
													? 'Deactivate'
													: 'Activate'}
											</button>
											<span className="text-gray-300">
												|
											</span>
											<button
												onClick={() =>
													handleDelete(table.id)
												}
												className="text-red-600 hover:underline underline-offset-4 bg-transparent cursor-pointer"
											>
												Delete
											</button>
										</div>
									</td>
									<td className="px-6 py-4">
										<button
											onClick={() =>
												copyShortcode(table.shortcode)
											}
											className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm px-3 py-2 rounded border border-gray-300 flex items-center gap-1 cursor-pointer font-mono transition-colors"
										>
											{table.shortcode}
											<CopyIcon className="w-4 h-4 ml-1" />
										</button>
									</td>
									<td className="px-6 py-4 text-sm text-gray-600">
										{table.source}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{ /* Pagination Menu */}
			<div className="flex justify-between items-center">
				{/* Pagination Info */}
				<div className="text-sm text-gray-500 px-1">
					Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
					{Math.min(
						currentPage * itemsPerPage,
						filteredTables.length
					)}{' '}
					of {filteredTables.length} entries
				</div>
				{/* Pagination Controlls */}
				<div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-xs border border-gray-200">
					{/* Rows Per Page */}
					<div className="flex items-center justify-center gap-2 h-8 pr-4 border-r border-gray-200 ">
						<span className="text-sm text-gray-500 whitespace-nowrap hidden sm:inline">
							Rows per page:
						</span>
						{isCustomPerPage ? (
							<div className="relative w-26">
								<Input
									type="number"
									min={1}
									className="h-8 pr-6 text-xs" // Match xs size
									value={itemsPerPage}
									onChange={(e) => {
										const val = parseInt(e.target.value);
										if (!isNaN(val) && val > 0) {
											setItemsPerPage(val);
											setCurrentPage(1);
										} else if (e.target.value === '') {
											// Allow empty while typing, but handle carefully
											setItemsPerPage(0); // or handle as string intermediate
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
							Go to page
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
		</div>
	);
};

export default Tables;
