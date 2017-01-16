var atomSassActivated = false;
const fs = require('fs');

module.exports = Compiler = (function() {
    function Compiler() {
        var _this           = this;

        if (atomSassActivated === false)
        {
            atom.notifications.addSuccess( 'Now watching for Sass files.' );
            atomSassActivated = true;
        
            atom.project.observeBuffers(function( buffer )
            {
                var textBuffer = buffer;

                // there was previously a check for the sass extension before watching a file
                //  that is possibly a bug a sa file could be saved to a different name.
                //  now watching all files and doing that check in onSaves call-back

                textBuffer.onDidChangeModified(function(){
                        textBuffer['atom-sass-view-modified'] = true;
                });
                textBuffer.onDidSave( function( e )
                {						
                    var saveFilePath = e['path'];

                    if ( !textBuffer['atom-sass-view-modified'] ) {
                            return false;
                    }
                    textBuffer['atom-sass-view-modified'] = false;

                    var path = require('path');
                    var extension = path.extname(saveFilePath);
                    if ( extension === '.scss' || extension === '.sass' ) {
                            _this.compile( saveFilePath );
                    }
                });
            });
        } else
        {
            atom.notifications.addSuccess( 'Already watching for Sass files.' );
        }
    }

    Compiler.prototype.compile = function( sassFilePath ) {

        var exec = require('child_process').exec,
            path = require('path');
 
        var extension = path.extname(sassFilePath);
        var cssFileName = path.basename(sassFilePath).replace(extension, '.css');
        var cssFilePath = path.join(path.dirname(sassFilePath),cssFileName);
   
        fs.access(cssFilePath, fs.constants.F_OK, (err) => {
            console.log(err ? 'no access!' : 'can read/write');
        });
        
        var execString = 'sass ' + '"' + sassFilePath + '"' + ' ' + '"' + cssFilePath +  '"';

        exec( execString, function (error, stdout, stderr)
        {
            if ( error ) {
                atom.notifications.addError( 'Error while compiling:',{
                    detail: error.message,
                    dismissable: true
                });
            } else {
                atom.notifications.addSuccess( 'Successfuly compiled' );
            }
        });
    };

    return Compiler;
})();
