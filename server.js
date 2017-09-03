var async = require("async");
var MongoClient = require("mongodb").MongoClient;
var url = 'mongodb://localhost:27017/photo_app';
var db;
var { pix, a1, a2, a3 } = require('./mockdata');
var albums_coll, photos_coll;


async.waterfall([
    function (cb) {
        MongoClient.connect(
            url,
            {
                poolSize: 100,
                w: 1,
            },
            (err, dbase) => {
                if (err) {
                    console.log('bad!')
                    process.exit(-1);
                }

                console.log("I have a connection!");
                db = dbase;
                cb(null);
            }
        );
    },

    function (cb) {
        db.collection("albums", cb);
    },

    function (albums_obj, cb) {
        albums_coll = albums_obj;
        db.collection("photos", cb);
    },

    function (photos_obj, cb) {
        photos_coll = photos_obj;
        cb(null);
    },

    function (cb) {
        albums_coll.insertMany([ a1, a2, a3 ], cb);
    },

    function (inserted_docs, cb) {
        console.log("I inserted all albums!");
        photos_coll.insertMany(pix, cb);
    },

    function (inserted_docs, cb) {
        console.log("I inserted all my photos!");
        cb(null)
    },

], function (err, results) {
    console.log("Done!");
    console.log(err);
    console.log(results);
    db.close();
});
