let express = require('express');
let router = express.Router();
const { getRider, getVerifyStatus, getVerifyRider, updateStatusRider, createLogRider, getRiderLog, deleteWalletRider, deleteRider, deleteVerifyRider, searchRider, deleteRiderLog } = require('../services/adminService');
let WebSocket = require('faye-websocket');
// let client = new WebSocket.Client('wss://avn-websocket-rider.onrender.com');
let adminName = "";
let Rider;
let VerifyRider;
let VerifyStatus;

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'metaverse.avn@gmail.com',
    pass: 'vyvfiyrshuagyxbt'
  }
});

//fireStore
const firebase = require("../services/firebaseStorage");
const db = firebase.firestore(); 

router.get('/', async (req, res, next) => {
  Rider = await getRider()
  VerifyRider = await getVerifyRider()
  VerifyStatus = await getVerifyStatus()
  if (adminName == "") {
    adminName = req.session.userid[0]['id'];
  }
  for (let i = 0; i < VerifyRider.length; i++) { //ทำเวลาที่ไรเดอร์สมัครเข้ามา 
    let dateArr = VerifyRider[i].date.split(" ")
    VerifyRider[i].date = dateArr[0]
  }
  res.render('rider', { title: 'Restuarant', adminName: adminName, RiderList: Rider, VerifyRiderList: VerifyRider, VerifyStatusList: VerifyStatus });
})

router.get('/edit/:riderID', (req, res, next) => {
  const { riderID } = req.params
  let RiderT;
  let VerifyRiderT;
  let verifyStatusIDT = '';
  for (let i = 0; i < Rider.length; i++) {
    if (Rider[i].riderID == riderID) {
      RiderT = Rider[i]
      for (let j = 0; j < VerifyRider.length; j++) {
        if (Rider[i].verifyID == VerifyRider[j].id) {
          VerifyRiderT = VerifyRider[j]
          for (let k = 0; k < VerifyStatus.length; k++) {
            if (VerifyRider[j].verifyStatusID == VerifyStatus[k].id) {
              verifyStatusIDT = VerifyStatus[k].id;
              break;
            }
          }
          break;
        }

      }
      break;
    }

  }
  VerifyRiderT.cardImage = VerifyRiderT.cardImage.replace('#', '&')
  VerifyRiderT.faceImage = VerifyRiderT.faceImage.replace('#', '&')

  VerifyRiderT.cardImage = VerifyRiderT.cardImage.replace('rider/', 'rider%2F')
  VerifyRiderT.faceImage = VerifyRiderT.faceImage.replace('rider/', 'rider%2F')
  res.render('detailRider', { title: 'Detail Rider', adminName: adminName, RiderT: RiderT, VerifyRiderT: VerifyRiderT, verifyStatusIDT: verifyStatusIDT });
})

// router.post('/updateStatus/:verifyID/:statusID', async (req, res, next) => {
//   let client = new WebSocket.Client('wss://avn-websocket-rider.onrender.com');
//   const { verifyID, statusID } = req.params;
//   await updateStatusRider(verifyID, statusID, adminName);

//   const msg = {
//     "verifyID": verifyID,
//     "statusID": statusID
//   }

//   client.send(JSON.stringify(msg));

//   res.redirect('/rider/')
// })

router.post('/updateVerifyRider/:action/:verifyID/:statusID', async (req, res, next) => {
  // let client = new WebSocket.Client('wss://avn-websocket-rider.onrender.com');
  const { verifyID, statusID, action } = req.params;
  const { reason } = req.body;
  const riderLogs = await getRiderLog();
  let logID = "LR";
  if (riderLogs.length > 0) {
    let riderLogID = parseInt(((riderLogs[0].logID)?.split('LR'))[1]);
    for (const x of riderLogs) {
      if (parseInt(((x.logID)?.split('LR'))[1]) > riderLogID) {
        riderLogID = parseInt(((x.logID)?.split('LR'))[1])
      }
    }
    const idCurrent = riderLogID + 1;
    logID += idCurrent.toString();
  } else {
    logID += "1";
  }

  const date = new Date();
    const currentdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    const currenttime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

  await updateStatusRider(verifyID, statusID, adminName);
  if (reason) {
    await createLogRider(logID, verifyID, action, reason, currentdate, currenttime); 
  }else{
    await createLogRider(logID, verifyID, action, "null", currentdate, currenttime); 
  }

  const msg = {
    "verifyID": verifyID,
    "statusID": statusID
  }

  await db.collection("VerifyRiders").doc('Realtime').set(msg);
  // client.send(JSON.stringify(msg));

  res.redirect('/rider/')
})

router.post('/deleteRider/:verifyID/:riderID', async (req, res, next) => {
  // let client = new WebSocket.Client('wss://avn-websocket-rider.onrender.com');
  const { verifyID, riderID } = req.params;
  const { reason } = req.body;

  const currentRider = await searchRider(riderID);

  await deleteWalletRider(riderID);
  await deleteRider(riderID);
  await deleteRiderLog(verifyID);
  await deleteVerifyRider(verifyID);

  var mailOptions = {
    from: 'metaverse.avn@gmail.com',
    to: currentRider[0].email,
    subject: 'บัญชีของคุณถูกลบ',
    text: 'บัญชีไรเดอร์ username: '+currentRider[0].username+' ของคุณถูกลบเนื่องจาก ' + reason
  };
  
  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log(error);
      res.redirect('/rider/')
    } else {
      console.log('Email sent: ' + info.response);
      const msg = {
        "verifyID": verifyID,
        "statusID": "VS5"
      }
      
      // client.send(JSON.stringify(msg));
      await db.collection("VerifyRiders").doc('Realtime').set(msg);
    
      res.redirect('/rider/')
    }
  });
})

module.exports = router;