const path = require( 'path' );
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require( 'webpack' );
const TerserPlugin = require("terser-webpack-plugin");

const PACKAGE = require('./package.json');

module.exports = {
    mode: 'production',
    devServer: {
        static: {
            directory: path.join(__dirname, 'docs'),
        },
        compress: true,
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
        new FileManagerPlugin({
            events: {
                onEnd: [{
                    copy: [
                        {
                            source: path.join(__dirname, 'dist'),
                            destination: path.join(__dirname, 'docs')
                        }
                    ]
                }]
            }
        }),
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
        ]
    }
};
