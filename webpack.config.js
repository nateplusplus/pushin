const path = require( 'path' );
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require( 'webpack' );
const TerserPlugin = require("terser-webpack-plugin");

const PACKAGE = require('./package.json');

module.exports = {
    mode: 'production',
    target: 'browserslist',
    devServer: {
        static: {
            directory: path.join(__dirname, ''),
        },
        port: 8080,
    },
    output: {
        path: path.resolve( __dirname, 'dist' ),
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
        new webpack.BannerPlugin( {
            banner: `Pushin.js - v${PACKAGE.version}\nAuthor: ${PACKAGE.author}\nLicense: ${PACKAGE.license}`,
        } ),
        new MiniCssExtractPlugin({
            filename: 'pushin.min.css',
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [ MiniCssExtractPlugin.loader, "css-loader" ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
