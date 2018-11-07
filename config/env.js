var src = '';
var build = './build';   

module.exports = {
    html:{
        all: src +'/**/*.html',
        dest:build+'/'
    },
    js:{
        all: src + 'js/**/*.js',
        dest:build + '/js',
        tmp: build + '/tmp/*.js',
        rev: build + '/rev/js'
    },
    img:{
        all: src + 'img/**/*.+(jpg|jpeg|gif|png)',
        dest:build + '/img',
        rev: build + "/rev/img"
    },
    fonts:{
        all: src + 'fonts/**/*',
        dest:build + '/fonts',
        rev: build + '/rev/fonts'
    },
    css:{
        all: src + 'css/**/*.scss',
        dest:build + '/css',
        tmp: build + '/tmp/*.scss',
        rev: build + "/rev/css"
    },
    clean:{
        dest:build
    }
}