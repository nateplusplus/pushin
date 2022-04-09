const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'browserslist',
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, 'docs'),
    },
    port: 8080,
  },
  entry: './docs/main.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'pushin.min.js',
  },
  resolve: {
    alias: {
      pushin: path.resolve('./src'),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false })],
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
