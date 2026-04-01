# Known Issues

This page tracks confirmed bugs, limitations, or quirks currently present in the ProductBay **v1.1.x** release, along with available workarounds and expected resolution plans.

## Gutenberg Editor Interaction

- **Issue**: Certain interactive elements that rely heavily on frontend JavaScript (such as the Pro version's Price Slider tooltip or dynamic taxonomy multiselects) may appear static when viewing the table preview inside the WordPress Block Editor.
- **Workaround**: None needed. This is intentionally suppressed to allow you to select the block without accidentally triggering inner-table actions. The table will function perfectly with full interactivity on the live frontend.
- **Status**: We are exploring deeper Server-Side Rendering (SSR) hydration for `v1.2.0` to bring 100% tooltip parity to the editor preview.

---

## Report a New Issue
Did you encounter a bug that isn't listed here? 

Please help us improve ProductBay by [opening a detailed issue on GitHub](https://github.com/wpanchorbay/productbay/issues)! You can also reach out to our active developer channels for faster triage.
