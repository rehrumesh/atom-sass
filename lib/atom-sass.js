'use babel';

//import AtomSassView from './atom-sass-view';
import { CompositeDisposable } from 'atom';

var Compiler = require('./compiler')

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    // Register command that toggles this view
    console.log("start");
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-sass:compile': () => this.compile()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  compile() {
    console.log('AtomSass Compile Started!');
    var compiler = new Compiler();
    //var currentView     = atom.workspace.getActiveTextEditor();
  }

};
