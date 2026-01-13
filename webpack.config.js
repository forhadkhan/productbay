const defaults = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

// Define where the files should go to match your PHP Enqueue
const OUTPUT_DIR = path.resolve(__dirname, "assets/js");

module.exports = {
    ...defaults,

    // 1. Entry Point
    entry: {
        admin: "./src/index.tsx",
    },

    // 2. Output Configuration
    output: {
        ...defaults.output,
        path: OUTPUT_DIR,
        filename: "[name].js",
        clean: false,
    },

    resolve: {
        ...defaults.resolve,
        alias: {
            ...defaults.resolve.alias,
            "@": path.resolve(__dirname, "src"),
        },
    },
};
