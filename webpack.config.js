const { resolve } = require("path");

module.exports = {
    mode: "production",
    optimization: {
        minimize: false
    },
    entry: {
        polyfill: "@babel/polyfill",
        bundle: "./js/main.js"
    },
    output: {
        path: resolve(__dirname + "/dist/"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
}