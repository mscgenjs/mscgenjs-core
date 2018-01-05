
module.exports = () => {
    return {
        entry: './sample-webpack.js',
        output: {
            filename : './sample-webpack.bundle.js'
        },
        devtool: 'source-map'
    };
};
