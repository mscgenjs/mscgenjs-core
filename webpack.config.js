const path = require("path");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = () => ({
  entry: "./src/index.ts",
  mode: "production",
  // plugins: [
  //     new BundleAnalyzerPlugin()
  // ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  output: {
    path: path.resolve(__dirname, "dist", "bundle"),
    filename: "index.min.js",
    library: "mscgenjs",
    libraryTarget: "umd",
  },
});
