var gulp = require('gulp');
var argv = require('yargs').argv;
var nodemon = require('gulp-nodemon');

gulp.task('default', function () {
  // check for --debug || --debug-brk flag, if present, run node debugger
  var debugArg = argv.debug ? '--debug=5858' : argv['debug-brk'] ? '--debug=5858 --debug-brk' : '';
  
  nodemon({
    script: 'index.js',
    ext: 'js',
    ignore: [
      'node_modules/**',
      'persist/**',
    ],
    
    nodeArgs: [ '--harmony', debugArg ]
  }).on('restart', function () {
    console.log('Embedded app restarted ' + new Date());
  });
});
