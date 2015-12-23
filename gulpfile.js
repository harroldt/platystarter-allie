var gulp       = require( 'gulp' );
var gutil      = require( 'gulp-util' );
var manifest   = require( 'asset-builder' )( 'manifest.json' );
var uglify     = require( 'gulp-uglify' );
var jshint     = require( 'gulp-jshint' );
var sass       = require( 'gulp-sass' );
var concat     = require( 'gulp-concat' );
var sourcemaps = require( 'gulp-sourcemaps' );
var mainjs     =  manifest.getDependencyByName('main.js');

var input = {
	'sass': 'src/scss/**/*.scss',
	'javascript': 'src/js/**/*.js',
	'bootstrapjs': 'components/assets/javascripts/bootstrap.js'
};

var output = {
	'stylesheets': 'public/assets/styles',
	'javascript': 'public/assets/js'
};

/* run the watch task when gulp is called without arguments */
gulp.task( 'default', [ 'watch' ] );

/* run javascript through jshint */
gulp.task( 'jshint', function () {
	return gulp.src( input.javascript )
		.pipe( jshint() )
		.pipe( jshint.reporter( 'jshint-stylish' ) );
} );

/* compile scss files */
gulp.task( 'build-css', function () {
	return gulp.src( 'src/scss/**/*.scss' )
		.pipe( sass( { outputStyle: 'compressed' } ) )
		.pipe( gulp.dest( output.stylesheets ) );
} );

/* concat javascript files, minify if --type production */
gulp.task( 'build-js', function () {
	return gulp.src( mainjs.globs )
		.pipe( concat( mainjs.name ) )
		//only uglify if gulp is ran with '--type production'
		.pipe( gutil.env.type === 'production' ? uglify() : gutil.noop() )
		.pipe( gulp.dest( manifest.paths.dist ) );
} );

/* Watch these files for changes and run the task on update */
gulp.task( 'watch', function () {
	gulp.watch( input.javascript, [ 'jshint', 'build-js' ] );
	gulp.watch( input.sass, [ 'build-css' ] );
} );