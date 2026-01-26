import { create } from 'zustand';

interface AppState {
	count: number;
	title: string;
	increment: () => void;
	decrement: () => void;
	setTitle: ( title: string ) => void;
}

export const useStore = create< AppState >( ( set ) => ( {
	count: 0,
	title: 'ProductBay Admin',
	increment: () => set( ( state ) => ( { count: state.count + 1 } ) ),
	decrement: () => set( ( state ) => ( { count: state.count - 1 } ) ),
	setTitle: ( title: string ) => set( { title } ),
} ) );
