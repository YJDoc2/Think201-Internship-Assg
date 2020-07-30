const Student = require('../models/student');
const express = require('express');
const router = express.Router();
const upload = require('../util/storage');

router.post('/add', async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).send({
        success: false,
        err: err.message,
      });
    } else {
      if (req.file === undefined) {
        res.status(400).send({
          success: false,
          err: 'No File selected',
        });
      } else {
        let temp = await Student.create({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          photoUID: req.file.filename,
          degree: req.body.degree,
        });
        res.status(201).send();
      }
    }
  });
});

module.exports = router;
