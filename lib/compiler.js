module.exports = Compiler = (function() {
    function Compiler() {
        var _this           = this;
        var currentView     = atom.workspace.getActivePaneItem();
        if(!currentView.getDirectoryPath || !currentView.getPath){
          return;
        }
        this.filePath   = currentView.getPath();
        this.directoryPath = currentView.getDirectoryPath();

        var saveAction = function( e ){

            if ( !currentView['atom-sass-view-modified'] ) {
                return false;
            }
            currentView['atom-sass-view-modified'] = false;

            if ( _this.extension === 'scss' ) {
                _this.compile( _this.filePath, _this.directoryPath );
            }
        };

        atom.workspace.onDidChangeActivePaneItem(function( item ){

            currentView = item;

            // Incase if we will not get a current view
            if ( typeof currentView === 'undefined' ) {
                return false;
            }

            if(!currentView.getDirectoryPath || !currentView.getPath){
              return;
            }

            _this.fileName = currentView.getTitle();
            _this.directoryPath = currentView.getDirectoryPath();
            _this.extension = _this.fileName.split( '.' ).pop();

            if ( _this.extension === 'scss' ) {
                _this.filePath = currentView.getPath();
                currentView.onDidSave( saveAction );
                currentView['atom-sass-activated'] = true;
            }
        });

        if ( typeof currentView === 'undefined' ) {

            return false;
        }

        this.fileName   = currentView.getTitle();
        this.extension  = this.fileName.split( '.' ).pop();
        if ( this.extension == 'scss' ) {

            this.filePath   = currentView.getPath();

            currentView.onDidChange(function(){
                currentView['atom-sass-view-modified'] = atom.workspace.getActivePaneItem().isModified();
            });
            currentView.onDidSave( saveAction );
            currentView['atom-sass-activated'] = true;
        }
    }

    Compiler.prototype.compile = function( filePath, directoryPath ) {

        var exec = require('child_process').exec,
            path = require('path'),
            fileName = path.basename(filePath).replace('.scss', '.css'),
            outputPath = path.join(directoryPath,fileName);

        var execString = 'sass ' + filePath + ' ' + outputPath;

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
