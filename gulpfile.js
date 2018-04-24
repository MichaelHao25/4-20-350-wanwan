var gulp = require('gulp');
var sass = require('gulp-sass');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var crypto = require('crypto');
var fs = require('fs');

// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', function() {
	browserSync.init({
		server: "./"
	});
	gulp.watch("./css/*.scss",['sass']);
    gulp.watch("./css/*.styl",['stylus']);
	gulp.watch("./*.html").on('change', reload);
	gulp.watch("./js/*.js").on('change', reload);
	gulp.watch("./css/*.css").on('change', reload);
});

gulp.task('sass', function(){
  return gulp.src('./css/*.scss')
    .pipe(sass({outputStyle:'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
});

gulp.task('stylus', function () {
  return gulp.src('./css/*.styl')
    .pipe(stylus({compress: true}).on('error',function(err){
    	console.log(err.message);
    	this.emit('end');
    }))
    .pipe(gulp.dest('./css'));
});

watch('img', batch(function(events,cb) {
    events.on('data',function(v){
    // console.log(JSON.stringify(v))
    if (v.event=='add' && v.history[0].indexOf('_tmp')==-1 && v.history[0].indexOf('crdownload')==-1){
        filename=v.history[0]
        var rs = fs.createReadStream(filename);
        var hash = crypto.createHash('md5');
        rs.on('data', hash.update.bind(hash));
        rs.on('end', function () {
            newFilename=hash.digest('hex'); //获取文件哈希值
            // console.log(filename)
            // console.log(newFilename)
            var newFilename=filename.replace(/([^\\]+)(\.[^\(]+)/i,newFilename)+filename.match(/\.\w+$/)
            fs.rename(filename,newFilename,function(err){
                if(err){
                    console.log(filename+" => 文件重命名失败");
                    return
                }
                console.log(filename+' => done!');
            })
        });
    }
}).on('end',cb)

}));

gulp.task('default', ['serve']);

// 嵌套输出方式 nested
// 展开输出方式 expanded 
// 紧凑输出方式 compact 
// 压缩输出方式 compressed