/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
      new webpack.BannerPlugin({ banner: require('./build/banner') }),
      new MiniCssExtractPlugin({
        filename: 'pushin.min.css',
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        minify: false,
        template: '!!pug-loader!docs/home.pug',
      }),
      new HtmlWebpackPlugin({
        filename: 'simple.html',
        minify: false,
        template: '!!pug-loader!docs/simple.pug',
      }),
      new HtmlWebpackPlugin({
        filename: 'responsive.html',
        minify: false,
        template: '!!pug-loader!docs/responsive.pug',
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
