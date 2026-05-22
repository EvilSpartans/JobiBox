const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    devtool: 'inline-source-map',
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', {
                            targets: {
                                esmodules: true
                            }
                        }], '@babel/preset-react'],
                        plugins: ['@babel/plugin-transform-modules-commonjs']
                    }
                }
            },
            {
                test: [/\.s[ac]ss$/i, /\.css$/i],
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            api: 'modern',
                        }
                    },
                    'postcss-loader'
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images',
                        },
                    },
                ],
            },
        ]
    },
    ignoreWarnings: [
        {
            module: /react-datepicker/,
            message: /Critical dependency/,
        }
    ],
    plugins: [new Dotenv()],
    resolve: {
        extensions: ['.js', '.json'],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'build', 'js'),
    },
};
