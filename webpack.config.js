const Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/app.js')
    .enableSingleRuntimeChunk()
    .enableReactPreset()
    .enableSourceMaps(Encore.isDevServer())
    .cleanupOutputBeforeBuild()
    .enablePostCssLoader();

module.exports = Encore.getWebpackConfig();