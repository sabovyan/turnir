/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  entry: ['webpack/hot/poll?100', './src/index.ts'],
  mode: 'development',
  devtool: 'inline-source-map',
  watch: true,
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?100'],
    }),
  ],
  plugins: [new webpack.HotModuleReplacementPlugin(), new CleanWebpackPlugin()],
  output: {
    path: path.join(__dirname, 'dev'),
    filename: 'index.js',
  },
});
