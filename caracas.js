'use strict';

(function(){
  const walk = require('walk'),
    fs = require('fs'),
    path = require('path'),
    f2m = require('flac-to-mp3'),
    Album = require('./app/music/album'),
    Collection = require('./app/music/collection'),

    traverse = function () {
      const walker = walk.walk('/tmp');
   
      // fs.exists(path, callback)
      // path.extname('index.html')
      // path.dirname(path)
      // path.basename(path[, ext])

      walker.on("names", function (root, names, cb) {
  //        console.log(names);
          cb();
      });

      walker.on("file", function (root, fileStats, cb) {
        const name = fileStats.name,
        fullPath = path.resolve(root + path.sep + name);

        console.log(fullPath);
        cb();
      });
    
      walker.on("directory", function (root, fileStats, cb) {
        const name = fileStats.name,
          fullPath = path.resolve(root + path.sep + name);

          console.log(fullPath);
//          console.log('reading dir ' + name + ', ' + fullPath);
        cb();
      });

      walker.on("errors", function (root, nodeStatsArray, next) {
        next();
      });
    
      walker.on("end", function () {
        console.log("all done");
      });
    },
    decode = function decode(){
      f2m.convert(
        '/home/harrold.korte/Music/Amb - (2017) Test Album flac/BIS1536-001-flac_16.flac',
        function(data) {
            console.log(data.err.toString())
        }
      );
    },
    getEncoding = function(fullPath){
      return fullPath.split(" ").splice(-1)
    };

  const album = new Album({
      fullPath: '/home/harrold.korte/Music/caracas/master/Safa.Ri/Safa.Ri - (2016) Trumpa Nine-Eleven 320kbs'
//      fullPath: 'X:/VHE/vsc/Music/master/Safa.Ri/Safa.Ri - (2016) Trumpa Nine-Eleven 320kbs'
    }),
    master = new Collection({
//      fullPath: 'X:/VHE/vsc/Music/master',
      fullPath: '/home/harrold.korte/Music/caracas/master',
      encoding: 'any'
    }),
    slave = new Collection({
//      fullPath: 'X:/VHE/vsc/Music/slave',
      fullPath: '/home/harrold.korte/Music/caracas/slave',
      encoding: 'mp3'
    });

  console.log('^' + album.encoding + '^');
  console.log('|' + album.basePath + '^');
  console.log(master.getArtistNames());
  console.log(master.hasArtist('Safa.Ri'));
  
  Collection.sync(master, slave);
}());
