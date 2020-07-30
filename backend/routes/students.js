const Student = require('../models/student');
const express = require('express');
const router = express.Router();
const upload = require('../util/storage');


/** GET /api/students/list
* Gets all students present in the DB and shows them in the studentList template
* No params required
*/
router.get('/list', async (req, res) => {
  let students = await Student.find({});
  res.render('./studentList', { students: students });
});

/** GET /api/students/edit/id
 * displays the template for editing the profile, pre-filled with exiting data
 * 
 */
router.get('/edit/:id', async (req, res) => {
  let student = await Student.findById(req.params.id);
  res.render("editProfile", { student: student });
});

/**POST /api/students/add
 * creates new student in DB as well as store the uploaded files
 * Required Params :
 * name : string
 * email : string, unique
 * phone  : phone number
 * degree : string
 * photo : Image file with png/jpg/jpeg extension
 * 
 * in formData. front end should use enctype as mutipart/form-data
 */
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
        try {
          let temp = await Student.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            photoUID: req.file.filename,
            degree: req.body.degree,
          });
          res.redirect('/');
        } catch (err) {
          console.log(err);
          res.status(400).send(JSON.stringify(err));
        }
      }
    }
  });
});

module.exports = router;
