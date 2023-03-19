const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    background: path.join(__dirname, "src/background.js"),
    pages: path.join(__dirname, "src/HistoryPage/main-history.js"),
    popup: path.join(__dirname, "src/popup.js"),
  },
  output: {
    path: path.join(__dirname, "products/product/js"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: ".",
          to: "../",
          context: "public",
        },
      ],
    }),
  ],
};
