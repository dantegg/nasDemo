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
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new ExtractTextWebapckPlugin('style.css')
    ]
}