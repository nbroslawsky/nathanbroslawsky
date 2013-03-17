var Watcher = require('watcher');


exports.attach = function(options) {
	this.watcher = new Watcher(options.path, options.recursive);
};

exports.init = function(done) {
	var app = this;
	app.watcher.watch(function(modifiedFiles) {
		app.emit('files-changed', modifiedFiles);
	}, 5000);

	done();
};