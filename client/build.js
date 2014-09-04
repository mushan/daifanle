({
    appDir: './',
    baseUrl: './js',
    dir: './dist',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    // fileExclusionRegExp: /^\./
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        zepto: 'lib/zepto',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        text: 'lib/text',
        spin: 'lib/spin'
    },
    shim: {
        zepto: {
            exports: '$'
        }
    }
})