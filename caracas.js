'use strict';

class Test {
    constructor(i){
        this.i = i;
    }
    sum(j, cb){
        cb(undefined, this.i + j);
    }
}

(function () {
    const config = require('./app/config/config'),
        walk = require('walk'),
        path = require('path'),
        f2m = require('flac-to-mp3'),
        rimraf = require('rimraf'),
        async = require('async'),
        Node = require('./app/fs/node'),
        File = require('./app/fs/file'),
        Directory = require('./app/fs/directory'),
        Album = require('./app/music/album'),
        Track = require('./app/music/track'),
        {Encoding, MP3, ANY} = require('./app/music/encoding'),
        Collection = require('./app/music/collection'),
        TaskRunner = require('./app/batch/taskRunner'),
        PersistenceSync = require('./app/mvc/persistenceSync'),
        storage = new PersistenceSync(),
        _ = require('./app/mvc/kraftaverk'),
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
        decode = function decode() {
            f2m.convert(
                '/home/harrold.korte/Music/Amb - (2017) Test Album flac/BIS1536-001-flac_16.flac',
                function (data) {
                    console.log(data.err.toString())
                }
            );
        },
        getEncoding = (fullPath) => {
            return fullPath.split(" ").splice(-1)
        },
        collectionRestore = __ => {
            const _rimraf = _.promisy(rimraf);

            return _rimraf(config.backup.to)
                .then(() => {
                    return Directory.copyDir(config.backup.from, config.backup.to);
                });
        };

    const basePath = 'X:/VHE/vsc', ///home/harrold.korte', //
        album = new Album({
            fullPath: config.master.fullPath + '/Safa.Ri/Safa.Ri - (2016) Trumpa Nine-Eleven 320kbs'
        }),
        master = new Collection({fullPath: config.master.fullPath, encoding: ANY}),
        slave = new Collection({fullPath: config.slave.fullPath, encoding: MP3});

/*
    console.log(master.getEncodings());
    return;
*/
/*    storage.save('harrold', 500);
    console.log(storage.load('harrold'));
return;*/
/*
    console.log('^' + album.encoding.type + '^');
    console.log('|' + album.basePath + '^');
    console.log(master.getArtistNames());
    console.log(master.hasArtist('Safa.Ri'));
*/

/*
 todo 20171115:

 1) tags for converted
  */
/*
    _.curry(console.log, _, 'test')('test2');
    return;
*/
/*

    const sum = (x, y, cb) => {
            cb(undefined, x + y);
        },
        psum = _.promisy(sum);

    psum(1, 2)
        .then(result => {
            console.log(result);
            return psum(100, result)
        })
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.error('error: ' + err);
        });
return;
*/
/*

    const test = new Test(3),
        psum = _.promisy(test, test.sum);
    psum(2)
        .then(result => {
            console.log(result);
            return psum(result)
        })
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.error('error: ' + err);
        });

    return;
*/


/*
    collectionRestore().then(_ => {
        Collection.sync(master, slave, {regex: /.+/})
    });
*/


//    collectionRestore()
/*
    _.newResolved()
        .then(__ => {
            return Collection.sync(master, slave, {regex: /^[A-B].+/});
        })
        .then(__ => {
            console.log('done');
        })
        .catch(err => {
            console.error('error: ' + err);
        });
*/
    _.Promise.each([1, 2, 3, 4, 5], i => {
        console.log(i);
        return _.newResolved(-i);
    }, {delay: 1000})
    .then(values => {
        console.log(values);

        return _.Promise.each([1, 2, 3, 4, 5], {
            reduce: (memo, i) => memo*i,
            initial: 1,
            delay: 1000
        });
    })
    .then(res => {
        console.log(res);
    });

    _.Promise.each([]).then(__ => {
        console.log('boe2');
    });

/*
    _.Promise.reduce([1, 2, 3, 4, 5], (memo, i) => {
        return _.newResolved(memo*i);
    }, 1).then(res => {
        console.log(res);
    });
*/
}());
