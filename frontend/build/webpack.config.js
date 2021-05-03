'use strict'
const path = require('path');
const utils = require('./utils')
const config = require('../config')
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  context: path.resolve(__dirname, '../'),
  // エントリーポイント(メインのjsファイル)
  entry: [
    '@babel/polyfill',
   './src/main.js'
  ],
  // ファイルの出力設定
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  // ソースマップ有効
  devtool: 'source-map',
  // ローダーの設定
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader'
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
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        // ローダーの対象 // 拡張子 .js の場合
        test: /\.js$/,
        // ローダーの処理対象から外すディレクトリ
        exclude: /node_modules/,
        // Babel を利用する
        loader: "babel-loader",
        // Babel のオプションを指定する
        options: {
          presets: [
            // プリセットを指定することで、ES2019 を ES5 に変換
            "@babel/preset-env"
          ]
        }
      }
    ]
  },
  // import 文で .ts ファイルを解決するため
  resolve: {
    // Webpackで利用するときの設定
    alias: {
      vue$: "vue/dist/vue.esm.js",
      '@': resolve('src'),
    },
    extensions: ["*", ".js", ".vue", ".json"]
  },
  plugins: [
    // Vueを読み込めるようにするため
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
    }),
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
    }),
    new CopyWebpackPlugin(
      {
        patterns: [{
          from: path.resolve(__dirname, '../static'),
          to: config.build.assetsSubDirectory,
          globOptions: {
            ignore: ['.*'],
          }
        }]
      }
    ),
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  // mode:puroductionでビルドした場合のファイル圧縮
  optimization: {
    minimizer: process.env.NODE_ENV === 'production'
      ? []
      : [
        // jsファイルの最適化
        new TerserPlugin({
          // すべてのコメント削除
          extractComments: 'all',
          // console.logの出力除去
          terserOptions: {
            compress: { drop_console: true }
          },
        }),
      ]
  },
  // js, css, html更新時自動的にブラウザをリロード
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