import { registerBlockType } from '@wordpress/blocks';
import metadata from '../../../blocks/tab-product-table/block.json';
import ProductBayIcon from '../icon';
import Edit from './edit';
import save from './save';

registerBlockType( metadata.name, {
	icon: ProductBayIcon,
	edit: Edit,
	save,
} );
