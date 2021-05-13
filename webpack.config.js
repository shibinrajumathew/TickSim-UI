const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, "./public/index.html"),
  filename: "index.html",
});
const definePlugin = new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  "process.env.MS_BASE_URL": JSON.stringify(process.env.MS_BASE_URL),
});

module.exports = {
  mode: "production",
  entry: ["@babel/polyfill", path.resolve(__dirname, "./src/index.js")],
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [htmlWebpackPlugin, definePlugin],
};
