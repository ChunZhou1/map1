const path = require("path");

const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: path.join(__dirname, "./public/"),
    publicPath: "/",
    host: "127.0.0.1",
    port: 3000,
    stats: {
      colors: true,
    },
  },
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // jsx/js文件的正则
        exclude: /node_modules/, // 排除 node_modules 文件夹

        use: {
          // loader 是 babel
          loader: "babel-loader",
          options: {
            // babel 转义的配置选项
            babelrc: false,
            presets: [
              // 添加 preset-react
              require.resolve("@babel/preset-react"),
              [require.resolve("@babel/preset-env"), { modules: false }],
            ],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // 要加载的文件后缀，无引号
        use: [
          // 使用的加载器
          "file-loader",
        ],
      },
    ],
  },
  entry: "./src/index.js", //添加入口配置项
  plugins: [
    new HtmlWebPackPlugin({
      template: "public/index.html",
      filename: "index.html",
      inject: true,
    }),
  ],
};
