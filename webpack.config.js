/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const banner = require('./build/banner');

module.exports = (env, { mode }) => {
  const isProduction = mode === 'production';

  const config = {
    mode,
    target: 'browserslist',
    devServer: {
      open: true,
      static: {
        directory: path.join(__dirname, 'docs'),
      },
      port: 8080,
    },
    entry: './docs/main.ts',
    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: 'pushin.min.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        pushin: path.resolve('./src'),
      },
    },
    plugins: [
      new webpack.BannerPlugin({ banner }),
      new MiniCssExtractPlugin({
        filename: 'pushin.min.css',
      }),
      new HtmlWebpackPlugin({
        template: './docs/home.pug',
        filename: 'index.html',
      }),
      new HtmlWebpackPlugin({
        template: './docs/simple.pug',
        filename: 'examples/simple/index.html',
      }),
      new HtmlWebpackPlugin({
        template: './docs/responsive.pug',
        filename: 'examples/responsive/index.html',
      }),
      new HtmlWebpackPlugin({
        template: './docs/target.pug',
        filename: 'examples/target/index.html',
      }),
      new HtmlWebpackPlugin({
        template: './docs/cat.pug',
        filename: 'examples/cat/index.html',
      }),
      new HtmlWebpackPlugin({
        template: './docs/api.pug',
        filename: 'api/index.html',
      }),
      new HtmlWebpackPlugin({
        template: './docs/installation.pug',
        filename: 'installation/index.html',
      }),
      new HtmlWebpackPlugin({
        template: './docs/composition.pug',
        filename: 'composition/index.html',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
        {
          test: /\.pug$/,
          loader: 'simple-pug-loader',
        },
      ],
    },
  };

  if (isProduction) {
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin({ extractComments: false })],
    };
  }

  return config;
};
