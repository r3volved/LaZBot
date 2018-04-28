var util = require('util');
var gulp = require('gulp');
var execFile = util.promisify(require('child_process').execFile);
var execFileSync = require('child_process').execFileSync;

var copyFilesAndFoldersDefinition = [
    /* copy */
    '**/*.js',
    '**/*.json',
    /* exclusion */
    '!**/compiled/**/*.*',
    '!**/node_modules/**/*.*',
    '!**/_todo/**/*.*',
    '!**/lazdev.js',
    '!**/gulpfile.js'
];


gulp.task('copy', cb => {
    gulp.src(copyFilesAndFoldersDefinition).pipe(gulp.dest('./compiled/'));
    cb();
});

gulp.task('watch', async cb => { 
	gulp.watch(copyFilesAndFoldersDefinition, ['copy']);
});


gulp.task('default', ['copy'], cb => cb());
