'use strict';

const path = require('path')
const fs = require('fs')

const rmDir = function(dirPath, removeSelf) {
  if (removeSelf === undefined) {
    removeSelf = true;
  }

  var files = fs.readdirSync(dirPath);

  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      var filePath = path.join(dirPath, files[i]);

      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        rmDir(filePath);
      }
    }
  }

  if (removeSelf) {
    fs.rmdirSync(dirPath);
  }
}

module.exports = rmDir;