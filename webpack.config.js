"use strict";

var path = require("path");
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        app: "./build/index.js"
    },
    output: {
        path: "./dist",
        filename: 'lib.js',
        library: 'Stash',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        extensions: ["", ".js"]
    },
    target: 'node',
    node: {
        __filename: false,
        __dirname: false
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
        ]
    },
    externals: [nodeExternals()],
    devtool: "source-map"
};