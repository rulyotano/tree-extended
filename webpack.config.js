const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/bin/index.ts",
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    }],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "bin"),
    filename: "index.js",
  },
  target: "node",
  plugins: [
    new webpack.BannerPlugin({
      banner: "#!/usr/bin/env node",
      raw: true,
    }),
  ],
};