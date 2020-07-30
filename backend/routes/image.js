const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongoCfg = require('../config/db');
const Grid = require('gridfs-stream');

// As the Grid-fs API is broken compared to the MongoDB , this is a hack to get it working and access files
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
    gfs.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).send({
                err: 'No file exists'
            });
        }

        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    });
});

module.exports = router; 