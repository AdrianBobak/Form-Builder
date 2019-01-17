const { resolve } = require("path");

module.exports = {
    mode: "production",
    optimization: {
        minimize: false
    },
    entry: "./js/main.js",
    output: {
        path: resolve(__dirname + "/dist/"),
        filename: "bundle.js"
    }
}