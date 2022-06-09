/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PugPlugin = require('pug-plugin');

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
      publicPath: path.resolve(__dirname, 'docs'),
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
      new PugPlugin({
        modules: [
          {
            test: /\/home\.pug$/,
            outputPath: path.join(__dirname, 'docs/'),
            filename: 'index.html',
          },
          {
            test: /\/simple\.pug$/,
            outputPath: path.join(__dirname, 'docs/simple'),
            filename: 'index.html',
          },
          {
            test: /\/responsive\.pug$/,
            outputPath: path.join(__dirname, 'docs/responsive'),
            filename: 'index.html',
          },
          {
            test: /\/cat\.pug$/,
            outputPath: path.join(__dirname, 'docs/cat'),
            filename: 'index.html',
          },
          {
            test: /\/target\.pug$/,
            outputPath: path.join(__dirname, 'docs/target'),
            filename: 'index.html',
          },
          {
            test: /\/api\.pug$/,
            outputPath: path.join(__dirname, 'docs/api'),
            filename: 'index.html',
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: PugPlugin.loader,
          options: {
            method: 'render',
          },
        },
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
