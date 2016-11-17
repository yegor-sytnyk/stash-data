"use strict";

var path = require("path");
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

var libraryName = 'stash-data';

var config = {
    entry: {
        app: "./build/index.js"
    },
    output: {
        path: "./dist",
        filename: libraryName + '.js',
        library: libraryName,
        libraryTarget: 'commonjs2'
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

module.exports = config;