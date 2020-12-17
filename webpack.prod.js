const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  entry: './src/index.ts',
  mode: 'production',
  plugins: [new CleanWebpackPlugin()],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index.js',
  },
});
