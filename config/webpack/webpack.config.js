const webpack = require('webpack');
const merge = require('webpack-merge');
const minimist = require('minimist');
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const paths = require('./paths');
const rules = require('./rules');
const electronConfiguration = require('./webpack.config.electron');
const webConfiguration = require('./webpack.config.web');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const monacoEditorPath = './node_modules/monaco-editor-core/dev/vs';
const monacoLanguagesPath = './node_modules/monaco-languages/release';
const monacoCssLanguagePath = './node_modules/monaco-css/release/min';
const monacoTsLanguagePath = './node_modules/monaco-typescript/release';
const monacoJsonLanguagePath = './node_modules/monaco-json/release/min';
const monacoHtmlLanguagePath = './node_modules/monaco-html/release/min';


module.exports = function (dirname, config = {}) {
    const commonConfiguration = {

        output: {
            filename: 'bundle.js'
        },

        module: {
            rules: rules(dirname)
        },

        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                'vs': path.resolve(paths(dirname).BUILD_ROOT, monacoEditorPath)
            }
        },

        devtool: 'source-map',

        plugins: [
            new CopyWebpackPlugin([
                {
                    from: monacoEditorPath,
                    to: 'vs'
                },
                {
                    from: monacoLanguagesPath,
                    to: 'vs/basic-languages'
                },
                {
                    from: monacoCssLanguagePath,
                    to: 'vs/language/css'
                },
                {
                    from: monacoTsLanguagePath,
                    to: 'vs/language/typescript'
                },
                {
                    from: monacoJsonLanguagePath,
                    to: 'vs/language/json'
                },
                {
                    from: monacoHtmlLanguagePath,
                    to: 'vs/language/html'
                }
            ]),
            new CircularDependencyPlugin({
                exclude: /(node_modules|examples)\/./,
                failOnError: true
            })
        ],

        stats: {
            warnings: false
        }

    };
    const argv = minimist(process.argv.slice(2));
    const electron = (argv && argv.target === 'electron');
    return merge(merge(commonConfiguration, electron ? electronConfiguration(dirname) : webConfiguration(dirname)), config);
};