const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

// Docs - https://webpack.js.org/configuration/

module.exports = {
    entry: slsw.lib.entries,
    target: "node",
    mode: "production",
    optimization: {
        // We no not want to minimize our code.
        minimize: true,
    },
    performance: {
        // Turn off size warnings for entry points
        hints: false,
    },
    devtool: "nosources-source-map",
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                ],
            },
        ],
    },
    output: {
        libraryTarget: "commonjs2",
        path: path.join(__dirname, ".webpack"),
        filename: "[name].js",
        sourceMapFilename: "[file].map",
    },
};
