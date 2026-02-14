export const apiFetch = async <T>(
	path: string,
	options: RequestInit = {}
): Promise<T> => {
	const url = `${productBaySettings.apiUrl}${path.replace(/^\//, '')}`;

	const headers = {
		'X-WP-Nonce': productBaySettings.nonce,
		'Content-Type': 'application/json',
		...(options.headers as Record<string, string>),
	};

	const response = await fetch(url, {
		...options,
		headers,
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(errorText || 'API Request Failed');
	}

	return response.json();
};
