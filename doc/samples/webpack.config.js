
module.exports = (pEnv = 'prod') => {
    const lRetval = {
        entry: './sample-webpack.js'
    };

    lRetval.output = {filename : './sample-webpack.bundle.js'}
    lRetval.devtool = "source-map";

    return lRetval;
};
