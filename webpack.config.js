const path = require( 'path' );
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
    mode: 'production',
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'pushin.js',
    },
    plugins: [
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
        })
    ]
};
