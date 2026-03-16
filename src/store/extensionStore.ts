import { create } from 'zustand';
import React from 'react';

interface ExtensionStore {
    fills: React.FC[];
    addFill: (fill: React.FC) => void;
}

export const useExtensionStore = create<ExtensionStore>((set) => ({
    fills: [],
    addFill: (fill) => set((state) => ({ fills: [...state.fills, fill] })),
}));
