module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers:['last 10 chrome versions', 'last 5 firefox versions', 'safari >= 6', 'ie > 8', 'ios >= 7.0']
        }),
        // require('postcss-px2rem')({
        //     remUnit:40
        // })
    ]
}