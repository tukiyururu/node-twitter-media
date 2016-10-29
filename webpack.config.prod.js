var webpack = require('webpack');
var config = require('./webpack.config');

config.plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compressor: { warnings: false }
    })
];
delete config.module.loaders[1].exclude;

module.exports = config;
