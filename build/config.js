module.exports = { 
    port                       : 8080,
    paths: {
       scss_path_src           : ['./src/scss/*.scss', './src/custom/**/*.scss', './src/content/**/*.scss', './src/scss/!(variable|_variable)*.scss', './src/scss/content/**/*.scss', './src/scss/_themes/*.scss'],
      scss_path_build          : './dist/css',
           path_src            : './src/',
           path_dist           : './dist',
       img_path_src            : './src/img/',
       img_path_dist           : './dist/img/',
        js_path_src_module     : "./src/js/_modules/",
        js_path_src_config     : "./src/js/_config/",
        js_path_dist           : "./dist/js",
        js_path_build          : "./dist/js/",
        path_bower             : "./bower_components/",
        path_node_modules      : "./node_modules/",
        path_vendor            : "./dist/",
        path_custom            : "./src/custom/",
        fonts_path_dist        : "./dist/fonts/",
        video_path_dist        : "./dist/video/",
        lang_path_dist         : "./dist/lang/",
        template: {
            content_           : "./src/content/**/*.hbs",
            partials_          : "./src/template/**/*.hbs",
            helpers_           : "./src/template/_helpers/*.js",
            data_              : "./src/template/_data/*.{js,json}" 
        }        
    }
}