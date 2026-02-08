
declare global {
    interface Window {
        productBaySettings: {
            apiUrl: string;
            nonce: string;
            pluginUrl: string;
        };
    }

    const productBaySettings: {
        apiUrl: string;
        nonce: string;
        pluginUrl: string;
    };
}

export { };
