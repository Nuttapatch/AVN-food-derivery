const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../services/adminService');
const { loginRestuarant } = require('../services/restuarantService');
//hash pass
const bcrypt = require("bcrypt")
const saltRounds = 10

const compareHash = async function (pass, hash) {
   const result = await bcrypt.compare(pass, hash);
   return result;
}

async function hashPassword(plaintextPassword) {
   const hash = await bcrypt.hash(plaintextPassword, saltRounds);
   console.log(hash);
}

router.get('/', function (req, res, next) {
   if ((req.session.userid) == null || (req.session.userid) == "") {
      res.render('index', { title: 'Login', errorMessage: '' });
   } else {
      if (req.session.userid[0]['role'] == "admin") {
         res.redirect('/restuarantsAdmin')
      } else {
         res.redirect('/restuarants')
      }
   }
});

router.post('/', async (req, res) => {
   if (!req.body.username || !req.body.password) {
      res.render('index', { title: 'Login', errorMessage: 'Please Enter Username and Password' });
   }
   const { username, password } = req.body
   const admins = await loginAdmin(username);
   let role = "";
   //console.log(await hashPassword(password));

   if (JSON.stringify(admins) != '[]') {
      const comparePass = await compareHash(password, admins[0]["password"]);
      if (comparePass) {
         role = "admin"
         admins[0].role = role
         let session = req.session;
         session.userid = admins;
      }
   } else {
      const restuarants = await loginRestuarant(username);
      if (JSON.stringify(restuarants) != '[]') {
         const comparePass = await compareHash(password, restuarants[0]["password"]);
         if (comparePass) {
            role = "restuarant"
            restuarants[0].role = role
            let session = req.session;
            session.userid = restuarants;
         }
      }
   }

   if (role == "admin") {
      res.redirect('/restuarantsAdmin')
   }
   else if (role == "restuarant") {
      res.redirect('/restuarants')
   }
   else {
      res.render('index', { title: 'Login', errorMessage: 'Username or Password is incorrect' });
   }
})

router.post('/logout', async (req, res) => {
   let session = req.session;
   session.userid = "";
   res.redirect('/')
})
module.exports = router;
