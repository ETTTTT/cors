const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'production',                         // 模式为生产模式
    entry: './src/index.js',                    // 入口js
    output: {
        filename: 'bundle.min.js',              // 打包名称
        path: path.resolve(__dirname, 'build')  // 打包的出口路径
    },
    devServer: {
        port: 5000,                             // webpack运行端口号
        progress:true,                          // 加载进度条
        contentBase: './build',                 // 运行打包后的文件
        proxy: {                                // 解决跨域代理
            '/': {                              // 所有以/开头的请求 全部变化为http://localhost:3000/+后面的请求
                target:'http://localhost:3000', 
                changeOrigin: true,             // 是否改变请求的头
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({                 // 创建一个在内存中生成html页面插件的配置对象
            template: './src/index.html',       // 指定模版页面生成内存中的hmtl
            filename: 'index.html'              // 指定生成的页面名称
        })
    ]
};