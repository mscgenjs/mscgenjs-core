module.exports = () => {
  return {
    entry: "./sample-webpack.js",
    mode: "development",
    output: {
      path: __dirname,
      filename: "./sample-webpack.bundle.js",
    },
    devtool: "source-map",
  };
};
