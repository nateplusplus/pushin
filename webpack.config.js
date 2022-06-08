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
        filename: 'index.html',
        minify: false,
        template: '!!pug-loader!docs/home.pug',
      }),
      new HtmlWebpackPlugin({
        filename: 'examples/simple/index.html',
        minify: false,
        template: '!!pug-loader!docs/simple.pug',
      }),
      new HtmlWebpackPlugin({
        filename: 'examples/responsive/index.html',
        minify: false,
        template: '!!pug-loader!docs/responsive.pug',
      }),
      new HtmlWebpackPlugin({
        filename: 'examples/cat/index.html',
        minify: false,
        template: '!!pug-loader!docs/cat.pug',
      }),
      new HtmlWebpackPlugin({
        filename: 'examples/target/index.html',
        minify: false,
        template: '!!pug-loader!docs/target.pug',
      }),
      new HtmlWebpackPlugin({
        filename: 'installation/index.html',
        minify: false,
        template: '!!pug-loader!docs/installation.pug',
      }),
      new HtmlWebpackPlugin({
        filename: 'api/index.html',
        minify: false,
        template: '!!pug-loader!docs/api.pug',
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
