import DefaultTheme from 'vitepress/theme';
import './custom.css';
import { h, onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import mediumZoom from 'medium-zoom';

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			'nav-bar-title-after': () =>
				h('span', { class: 'productbay-site-title' }, [
					h('span', { class: 'product-bold' }, 'Product'),
					'Bay',
				]),
		});
	},
	setup() {
		const route = useRoute();
		const initZoom = () => {
			// Target images in the main content area
			mediumZoom('.main img', {
				background: 'var(--vp-c-bg)',
				margin: 24,
			});
		};
		onMounted(() => {
			initZoom();
		});
		watch(
			() => route.path,
			() => nextTick(() => initZoom())
		);
	},
};
