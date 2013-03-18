var express = require('express');

var slice = Array.prototype.slice;
Array.slice = function(arr, start, end) {
	return slice.call(arr, start || 0, end === undefined ? arr.length : end);
};

Object.extend = function(a, b /*, [b2..n] */) {
	Array.slice(arguments, 1).forEach(function(b) {
		for(var p in b) a[p] = b[p];
	});
	return a;
};

exports.attach = function(options) {
	var app = this;
	app.static = function(root, options) {

		options = options || {};
		var middleware = express.static(root, options);

		return function(req, res, next) {

			var justUrl = (options.urlBase && req.url.indexOf(options.urlBase) == 0)
				? req.url.substr(options.urlBase.length)
				: req.url;

			return middleware.call(this, Object.extend({}, req, { url : justUrl }), res, next);
		};
	};
};

exports.init = function(done) {
	done();
};