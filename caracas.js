(function () {
    "use strict";
   
    var walk = require('walk')
      , fs = require('fs')
      , walker
      ;
   
    walker = walk.walk(".");
   
    walker.on("file", function (root, fileStats, next) {
      fs.readFile(fileStats.name, function () {
        // doStuff 
        console.log('reading file ' + fileStats.name);
        next();
      });
    });
   
    walker.on("errors", function (root, nodeStatsArray, next) {
      next();
    });
   
    walker.on("end", function () {
      console.log("all done");
    });
  }());