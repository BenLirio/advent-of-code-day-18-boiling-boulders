//webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: "out.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 3000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
  ]
};