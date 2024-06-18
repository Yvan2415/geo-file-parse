(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.fileReader = factory());
})(this, (function () { 'use strict';

	console.log('hello geo file reader');

	let yvan = 'hello world';

	return yvan;

}));
