import App from "./App";

import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";

domReady(() => {
    const root = createRoot(document.getElementById("productbay-root"));
    root.render(<App />);
});

