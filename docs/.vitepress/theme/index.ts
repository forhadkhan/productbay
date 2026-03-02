import DefaultTheme from 'vitepress/theme'
import './custom.css'
import { h } from 'vue'

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            'nav-bar-title-after': () => h('span', { class: 'productbay-site-title' }, [
                h('span', { class: 'product-bold' }, 'Product'),
                'Bay'
            ])
        })
    }
}
