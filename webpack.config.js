const path = require("path");
const webpack = require("webpack");

const nodeJsConfig = {
  mode: "production",
  entry: "./src/bin/index.js",
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

const npmConfig = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "treeExtended.js",
  },
  target: "node",
};

module.exports = [
  nodeJsConfig,
  npmConfig,
];
