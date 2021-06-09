'use strict'
const path = require('path');
const config = require('./config')
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function assetsPath(_path){
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

const MODE = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
  mode: MODE,
  context: path.resolve(__dirname, '../'),
  entry: [
    '@babel/polyfill',
   './src/main.js'
  ],
  // ファイルの出力設定
  output: {
    path: config.build.assetsRoot,
    filename: assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: assetsPath('js/[id].[chunkhash].js')
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'vue-style-loader', 'css-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env"
          ]
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: assetsPath('css/[name].[contenthash].css'),
    }),
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
    }),
    // copy files to backend
    new CopyWebpackPlugin(
      {
        patterns: [{
          from: path.resolve(__dirname, '../static'),
          to: config.build.assetsSubDirectory,
          noErrorOnMissing: true,
          globOptions: {
            dot : true,
            ignore: ['**/.*'],
          }
        }]
      }
    ),
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      '@': resolve('src'),
    },
    extensions: ["*", ".js", ".vue", ".json"],
    fallback:{
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      fs:false,
      dgram: false,
      net: false,
      tls: false,
      child_process: false
    }
  },
  optimization: {
    splitChunks: {
      // output vender js into separete file
      name: 'vendor',
      chunks: 'initial',
    },
    minimize: true,
    minimizer: [
        // optimize js
        new TerserPlugin({
          // remove comments
          extractComments: 'false',
          terserOptions: {
            ecma: 6,
            compress: { drop_console: false },
          },
        }),
      ]
  },
  // after js, css, html updated, auto reload browser
  devServer: {
    // サーバーの起点ディレクトリ
    // contentBase: "dist",
    // バンドルされるファイルの監視 // パスがサーバー起点と異なる場合に設定
    publicPath: '/dist/js/',
    //コンテンツの変更監視をする
    watchContentBase: true,
    // 実行時(サーバー起動時)ブラウザ自動起動
    open: true,
    // 自動で指定したページを開く
    openPage: "index.html",
    //　同一network内からのアクセス可能に
    host: "0.0.0.0"
  }
};