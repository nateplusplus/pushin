const path = require('path');
const webpack = require('webpack');
const PACKAGE = require('./package.json');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

let config = {
  mode: 'production',
  target: 'browserslist',
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, 'docs'),
    },
    port: 8080,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'pushin.min.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `Pushin.js - v${PACKAGE.version}\nAuthor: ${PACKAGE.author}\nLicense: ${PACKAGE.license}`,
    }),
    new MiniCssExtractPlugin({
      filename: 'pushin.min.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.name === 'docs') {
    config.output = {
      path: path.resolve(__dirname, 'docs'),
      filename: 'pushin.min.js',
    };

    config.plugins.push(
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
      })
    );
  }

  return config;
};
