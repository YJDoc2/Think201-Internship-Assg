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
  return res.render('./studentList', { students: students, admin: req.user });
});

/** GET /api/students/edit/id
 * displays the template for editing the profile, pre-filled with exiting data
 * 
 */
router.get('/edit/:id', async (req, res) => {
  if (!req.user) {
    return res.render('error', { err: "Only admins an edit the info" });
  }
  let student = await Student.findById(req.params.id);
  return res.render("editProfile", { student: student });
});


/** POST /api/students/update/id
 * Updates information of the student
 * params : all are optional
 * name : string
 * email : string
 * phone : Number
 * degree : String
 * photo : image
 */
router.post('/update/:id', async (req, res) => {
  if (!req.user) {
    return res.render('error', { err: "Only admins an edit the info" });
  }
  upload(req, res, async (err) => {
    if (err) {
      return res.render('./error', { err: err.message })
    } else {
      if (req.file === undefined) {
        // The image is not to be updated
        try {
          let temp = await Student.findByIdAndUpdate(req.params.id, req.body);
          res.redirect('/');
        } catch (err) {
          console.log(err);
          return res.render('./error', { err: err.message })

        }
      } else {
        try {
          // image as well as some other params are to be updated
          let temp = await Student.findByIdAndUpdate(req.params.id, {
            ...req.body,
            photoUID: req.file.filename,
          });
          res.redirect('/');
        } catch (err) {
          console.log(err);
          return res.render('./error', { err: err.message })
        }
      }
    }
  });
})

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
      return res.render('./error', { err: err.message })
    } else {
      if (req.file === undefined) {
        res.render('./error', { err: "No Image selected" })
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
          res.render('./error', {
            err: err.code === 11000 ? "The Email is already registered" : err.message
          })
        }
      }
    }
  });
});

/** POST /api/students/search
 * Search for the students in the list as specified by query
 * Params : 
 * type : String : type to search in can be name, email,degree, phone
 * data : String : this is used as regex in case of name email degree, and searched as exact string in phone
 * 
 * renders the same view as student list but with data only matching to search query
 */
router.post('/search', async (req, res) => {
  const { type, data } = req.body;
  let results = {};
  // search in specified field as per type
  if (type === 'name') {
    results = await Student.find({ name: { $regex: data, $options: "i" } });
  } else if (type == 'email') {
    results = await Student.find({ email: { $regex: data, $options: "i" } });
  } else if (type === 'degree') {
    results = await Student.find({ degree: { $regex: data, $options: "i" } });
  } else if (type === 'phone') {
    results = await Student.find({ phone: req.body.data });
  }

  // render the found data in student list view
  return res.render('./studentList', { students: results });
});




module.exports = router;
