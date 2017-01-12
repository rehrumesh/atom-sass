module.exports = Compiler = (function() {
    function Compiler() {
        var _this           = this;

        
        atom.notifications.addSuccess( 'Now watching for Sass files.' );
        
        atom.workspace.observeTextEditors(function( item )
        {
            var textEditorView = item;

            // Incase if we will not get a current view
            if ( typeof textEditorView === 'undefined' ) {
                return false;
            }

            if(!textEditorView.getDirectoryPath || !textEditorView.getPath){
              return;
            }

            // var fileName = textEditorView.getTitle();
            // var directoryPath = textEditorView.getDirectoryPath();
            // var extension = fileName.split( '.' ).pop();
            // if ( extension === 'scss' || extension === 'sass' ) {
            // program previously checked if the file had a sass extension before watching it
            // this is a potental problem as the file could be saved with a different name.
            // Now, I watch all files and only check extension in onDidSave()
            
            textEditorView.onDidChangeModified(function(){
                    textEditorView['atom-sass-view-modified'] = true;
            });
            textEditorView.onDidSave( function( e )
            {						
                var saveFilePath = e['path'];

                if ( !textEditorView['atom-sass-view-modified'] ) {
                        return false;
                }
                textEditorView['atom-sass-view-modified'] = false;
                
                var test = textEditorView.getPath();

                var path = require('path');
                var extension = path.extname(saveFilePath);
                if ( extension === '.scss' || extension === '.sass' ) {
                        _this.compile( saveFilePath );
                }
            });
        });
    }

    Compiler.prototype.compile = function( sassFilePath ) {

        var exec = require('child_process').exec,
            path = require('path');
 
        var extension = path.extname(sassFilePath);
        var cssFileName = path.win32.basename(sassFilePath).replace(extension, '.css');
        var cssFilePath = path.join(path.dirname(sassFilePath),cssFileName);
   
        var execString = 'sass ' + '"' + sassFilePath + '"' + ' ' + '"' + cssFilePath +  '"';

        exec( execString, function (error, stdout, stderr) {

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
