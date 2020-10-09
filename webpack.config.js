const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

//设置nodejs环境变量
// process.env.NODE_ENV = 'development'

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  //loader的配置
  module: {
    rules: [
      //详细配置
      {
        //匹配那些文件
        test: /\.css$/,
        //使用什么loader，执行顺序数组尾=》头。使用多个loader用use, 使用一个用loader
        use: [
          //创建style标签，将js中的样式资源插入进去，添加到head中
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          //将css=》变成commonjs模块的字符串加载到js中
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            }
          }
        ]
      }, {
        test: /\.less$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          //同时要下less包
          'less-loader'
        ]
      }, {
        //处理不了html <img>的图片
        test: /\.(jpg|png|gif)$/,
        //需要下载 url-loader, file-loader
        loader: 'url-loader',
        //loader的配置
        options: {
          //图片大小小于8kb，就会被base64处理
          limit: 8 * 1024,
          //关闭es6 module使用commonjs
          esModule: false,
          //打包图片重命名
          name: '[hash:10].[ext]',
          outputPath: 'img'
        }
      }, {
        //处理<img>图片
        test: /\.html$/,
        loader: 'html-loader'
      }, {
        //打包其它资源（排除html/js/css/less/png资源以外的资源）
        exclude: /\.(css|less|html|js|png|json)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media'
        }
      }

    ]
  },
  plugins: [
    //默认创建一个空的Html,并自动引入打包输出的所有资源
    new HtmlWebpackPlugin({
      //指定模板，并自动引入打包输出的所有资源
      template: './src/index.html'
    }),
    //抽离css至单独的文件
    new MiniCssExtractPlugin({
      filename: 'css/built.css'
    }),
    //压缩css
    new OptimizeCssAssetsWebpackPlugin()
  ],
  //开发服务器
  //只会在内存中编译打包，不会有任何输出
  //启动devServer指令为：npx webpack-dev-server
  devServer: {

    //启动gzip压缩
    compress: true,
    //端口号
    port: 4000,
    //自动打开
    open: true
  }
};