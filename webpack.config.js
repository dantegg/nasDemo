const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ExtractTextWebapckPlugin = require('extract-text-webpack-plugin')

module.exports = {
    module:{
        rules:[
            { 
                test: /\.vue$/, 
                loader: 'vue-loader',
                options: { 
                    loaders: { 
                        css: ExtractTextWebapckPlugin.extract({ use: 'css-loader' }) 
                    }
                }
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new ExtractTextWebapckPlugin('style.css')
    ]
}