const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongoCfg = require('../config/db');
const Grid = require('gridfs-stream');

// As the Grid-fs API is broken wrto to the MongoDB , this is a hack to get it working and access files
// without this we cannot retrieve the images saved in the DB and the server will exit with error
eval(
    `Grid.prototype.findOne = ${Grid.prototype.findOne
        .toString()
        .replace('nextObject', 'next')}`
);

// create a mongodb connection if not already existing
const conn = mongoose.createConnection(
    mongoCfg.db,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
);

let gfs;

// when the connection opens connect grid fs 
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

/**GET /api/images/filename
 * streams the image data to frontend
 * this link should be given to src of img in plain html
 * Params :
 * filename : file name of the file that is to be retrieved
 */
router.get('/:filename', (req, res) => {
    // find the file as per filename
    gfs.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file is exiting
        if (!file || file.length === 0) {
            return res.render('./error', {
                err: 'Error in retrieving Student Image'
            });
        }
        // create a stream and pipe the file data in the stream
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    });
});

module.exports = router; 