
const baseUrl = '';
const port = 8000; // dev port

module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        hot: true,
        disableHostCheck: true,
        port,
        overlay: {
            warnings: false,
            errors: true
        },
    },
}
