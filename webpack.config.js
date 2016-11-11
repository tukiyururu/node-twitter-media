"use strict";

module.exports = {
    entry: ["babel-polyfill", "./src/main.js"],
    output: {
        path: __dirname + "/dist",
        filename: "main.js",
        libraryTarget: "commonjs"
    },
    target: "node",
    resolve: {
        extensions: ["", ".js"]
    },
    module: {
        loaders: [{
            test: /\.json$/,
            loader: "json"
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel"
        }]
    }
};
