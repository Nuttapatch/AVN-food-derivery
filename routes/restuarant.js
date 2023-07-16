let express = require('express');
let router = express.Router();
const { getMenu, getMenuType, addMenuType, deleteMenuType, addMenu, updateMenu, updateMenuNoImage, deleteMenu, getMenuTypeLast, getMenuLast, getOrderDetail, getUser, getOrder, getRider, getCart, getCartDeatil, getAllMenu, updateOrder, getAllMenuType, getWalletStore, getTransactionStore, getAllTransactionStore, updateWallet, createTransaction } = require('../services/restuarantService');
const fs = require("fs");

const firebase = require("../services/firebaseStorage");
const storage = firebase.storage();
const bucket = storage.bucket();

const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
});
let menuTypes, menu, menuTypeLast, menuLast;
let storeName = ""; //ชื่อร้านค้า
let storeID = "";
let Order, OrderDetail, User;
let Rider;
let wallet;
let currentOrder, totalCurrentOrder;

let WebSocket = require('faye-websocket');
const { getUserWallet, updateUserWallet, getUserTransactions, createUserTransaction, getUserPayment, updateUserPayment } = require('../services/userService');
// let client = new WebSocket.Client('wss://avn-websocket-order.onrender.com');

router.get('/', async (req, res, next) => {
    let Ordershow = [];
    let UserShow = [];
    let AmountShow = [];

    let OrdersSuccesshow = [];
    let UserShowSuccess = [];
    let AmountShowSuccess = [];

    let OrderCancelshow = [];
    let UserShowCancel = [];
    let AmountShowCancel = [];
    Order = await getOrder();
    OrderDetail = await getCartDeatil();
    User = await getUser();

    if (storeName == "") {
        storeName = req.session.userid[0]['name'];
    }
    if (storeID == "") {
        storeID = req.session.userid[0]['storeID'].toString();
    }
    console.log(Order);
    for (let i = 0; i < Order.length; i++) {
        if (Order[i].storeID == storeID) { //ตรวจสอบออเดอร์กับไอดัร้านค้า
            if (Order[i].status == 1 || Order[i].status == 0 || Order[i].status == 2) {  //เช็ตสเตตัส
                Ordershow.push(Order[i])
                let amount;
                amount = 0;
                for (let j = 0; j < OrderDetail.length; j++) { //ตรวจสอบไอดีตะกร้าในออเดอร์ดีเทลกับไอดีตะกร้าในออเดอร์
                    if (OrderDetail[j].cartID == Order[i].cartID) {
                        amount += OrderDetail[j].amount;
                    }

                }
                AmountShow.push(amount) //โชว์จำนวน
                for (let k = 0; k < User.length; k++) {
                    if (User[k].id == Order[i].userID) {
                        UserShow.push(User[k].username)
                        break;
                    }

                }
            }
            else if (Order[i].status == 3) {
                OrdersSuccesshow.push(Order[i])
                let amount;
                amount = 0;
                for (let j = 0; j < OrderDetail.length; j++) {
                    if (OrderDetail[j].cartID == Order[i].cartID) {
                        amount += OrderDetail[j].amount;
                    }

                }
                AmountShowSuccess.push(amount)
                for (let k = 0; k < User.length; k++) {
                    if (User[k].id == Order[i].userID) {
                        UserShowSuccess.push(User[k].username)
                        break;
                    }

                }
            }
            else if (Order[i].status == 4) {
                OrderCancelshow.push(Order[i])
                let amount;
                amount = 0;
                for (let j = 0; j < OrderDetail.length; j++) {
                    if (OrderDetail[j].cartID == Order[i].cartID) {
                        amount += OrderDetail[j].amount;
                    }

                }
                AmountShowCancel.push(amount)
                for (let k = 0; k < User.length; k++) {
                    if (User[k].id == Order[i].userID) {
                        UserShowCancel.push(User[k].username)
                        break;
                    }

                }
            }
        }

    }
    res.render('orderRestuarant', {
        title: 'Restuarant',
        storeName: storeName,
        storeID: storeID,
        Order: Ordershow,
        AmountShow: AmountShow,
        UserShow: UserShow,
        OrdersSuccesshow: OrdersSuccesshow,
        AmountShowSuccess: AmountShowSuccess,
        UserShowSuccess: UserShowSuccess,
        OrderCancelshow: OrderCancelshow,
        AmountShowCancel: AmountShowCancel,
        UserShowCancel: UserShowCancel
    });
})

router.get('/orderDetail/:orderID', async (req, res, next) => {
    const OrderID = req.params.orderID
    Rider = await getRider();
    Order = await getOrder();
    const Cart = await getCart();
    const CartDetail = await getCartDeatil();
    const Menu = await getAllMenu();
    let menuShow = [];
    let UserN;
    let RiderShow = [];
    let OrderT;
    let CartDTShow = [];
    let total = 0;
    for (let i = 0; i < Order.length; i++) { //หาออเดอร์ที่เป็นออเดอร์นั้น
        if (Order[i].id == OrderID) {
            OrderT = Order[i]
            for (let j = 0; j < Rider.length; j++) { //หาไรเดอร์ที่รับออเดอร์นั้น
                if (Order[i].status != 0) {
                    if (Order[i].riderID == Rider[j].riderID) {
                        RiderShow = Rider[j];
                        break;
                    }
                }
            }
            for (let k = 0; k < User.length; k++) { //หาผู้ใช้ที่เลือกออเดอร์
                if (User[k].id == Order[i].userID) {
                    UserN = User[k];
                    break;
                }
            }
            for (let m = 0; m < Cart.length; m++) {
                if (Cart[m].id == Order[i].cartID) {
                    for (let l = 0; l < CartDetail.length; l++) {
                        if (CartDetail[l].cartID == Order[i].cartID) {
                            CartDTShow.push(CartDetail[l])
                            for (let n = 0; n < Menu.length; n++) {
                                if (CartDetail[l].menuID == Menu[n].id) {
                                    let imgSplit = Menu[n].image.split("Menu");
                                    imgSplit[1] = imgSplit[1].replace("/", "%2F");
                                    Menu[n].image = imgSplit[0] + "Menu" + imgSplit[1];
                                    menuShow.push(Menu[n]);
                                    total += Menu[n].price * CartDetail[l].amount;
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
            }
            break;
        }
    }
    currentOrder = OrderT;
    totalCurrentOrder = total;
    res.render('detailOrderRestuarant', { title: 'Order Detail', storeName: storeName, OrderT: OrderT, RiderShow: RiderShow, UserN: UserN, CartDTShow: CartDTShow, menuShow: menuShow, Total: total });
})

router.get('/menu', async (req, res, next) => {
    menu = await getMenu(storeID);
    for (let index = 0; index < menu.length; index++) {
        let imgSplit = menu[index].image.split("Menu");
        imgSplit[1] = imgSplit[1].replace("/", "%2F");
        menu[index].image = imgSplit[0] + "Menu" + imgSplit[1];
    }
    menuTypes = await getMenuType(storeID);
    res.render('detailRestuarant', { title: 'Menu', storeName: storeName, menuList: menu, menuTypeList: menuTypes });
})

router.get('/menuType', async (req, res, next) => {
    menuTypes = await getMenuType(storeID);
    res.render('typemenu', { title: 'Menu Type', storeName: storeName, menuTypeList: menuTypes });
})

router.get('/income', async (req, res, next) => {
    let order = await getOrder();
    let menu = await getMenu(storeID);
    let amountsuc = 0;
    let amountcan = 0;
    let CartDetail = await getCartDeatil();
    let totalres = 0;
    wallet = await getWalletStore(storeID);
    const transaction = await getTransactionStore(wallet[0]['walletID'])
    const date = new Date();
    const currentdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    const dateSplit = currentdate.toString().split('-')
    for (let i = 0; i < transaction.length; i++) {
        const tdateSplit = (transaction[i].date).split(' ')
        const transactionDateSplit = tdateSplit[0].split('/')
        if ( dateSplit[0] == transactionDateSplit[2] && parseInt(dateSplit[1])  == parseInt( transactionDateSplit[0])) {
              totalres += transaction[i].amount;
           }
        
    }
    for (let i = 0; i < order.length; i++) {
        if (order[i].storeID == storeID && order[i].status == 3) {
            amountsuc += 1; //แสดงออเดอร์ที่สำเร็จ

            // for (let j = 0; j < CartDetail.length; j++) {
            //     if (order[i].cartID == CartDetail[j].cartID) {
            //         for (let k = 0; k < menu.length; k++) {
            //             if (CartDetail[j].menuID == menu[k].id) {
            //                 totalres += CartDetail[j].amount * menu[k].price; //แสดงยอดขาย
            //             }

            //         }
            //     }

            // }
        }
        if (order[i].storeID == storeID && order[i].status == 4) { // แสดงออเดอร์ที่ถูกยกเลิก
            amountcan += 1;
        }
    }
    res.render('income', { title: 'Income', storeName: storeName, totalres: totalres, amountsuc: amountsuc, amountcan: amountcan, date: "" });
    // res.render('income', { title: 'Income', storeName: req.session.userid[0]['name'] });
})

router.get('/wallet', async (req, res, next) => {
    wallet = await getWalletStore(storeID);
    const transaction = await getTransactionStore(wallet[0]['walletID'])
    res.render('wallet', { title: 'Wallet', storeName: storeName, wallet: wallet[0], transaction: transaction });
})

router.post('/addMenuType', async (req, res, next) => {
    menuTypes = await getMenuType();
    const { typeName } = req.body;
    const newTypeName = typeName.replace("&", "%26");
    const path = 'restuarants menuType'
    let msg;
    const checkExist = obj => obj.type_Name.toLowerCase() === typeName.toLowerCase() && obj.storeID === storeID;
    if (!menuTypes.some(checkExist)) {
        let id = 'MT';
        menuTypeLast = await getAllMenuType();
        if (menuTypeLast.length > 0) {
            let menuTypeLastID = parseInt(((menuTypeLast[0].menu_TypeID)?.split('MT'))[1]);
            for (const x of menuTypeLast) {
                if (parseInt(((x.menu_TypeID)?.split('MT'))[1]) > menuTypeLastID) {
                    menuTypeLastID = parseInt(((x.menu_TypeID)?.split('MT'))[1])
                }
            }
            // const lastId = menuTypeLast['menu_TypeID'];
            // const idSplit = lastId.split('MT');
            const idCurrent = menuTypeLastID + 1;
            id += idCurrent.toString();
        } else {
            id += "1";
        }

        await addMenuType(id, newTypeName, storeID);
        //menuTypes = await getMenuType();
        msg = 'Add menu type successfully!!';
        //res.render('typemenu', { title: 'Menu Type', storeName: req.session.userid[0]['name'], menuTypeList: menuTypes, success: 'Add menu type successfully!!' });
    } else {
        msg = 'This type name is already exist! Please try again.';
        //res.render('typemenu', { title: 'Menu Type', storeName: req.session.userid[0]['name'], menuTypeList: menuTypes, success: 'This type name is already exist! Please try again.' });
    }
    res.redirect('/restuarants/success/' + msg + '/' + path);
})

router.post('/deleteMenuType/:id', async (req, res, next) => {
    const path = 'restuarants menuType'
    let msg;
    const menuTypeID = req.params.id;
    await deleteMenuType(menuTypeID);
    //menuTypes = await getMenuType();
    msg = 'Delete menu type successfully!!';
    res.redirect('/restuarants/success/' + msg + '/' + path);
    //res.render('typemenu', { title: 'Menu Type', storeName: req.session.userid[0]['name'], menuTypeList: menuTypes, success: 'delete menu type successfully!!' });
})

router.post('/addMenu', upload.single("menuImg"), async (req, res) => {
    const path = 'restuarants menu'
    let msg;
    const { menuName, description, price, typeFood } = req.body;
    const newMenuName = menuName.replace("&", "%26");
    const checkExist = obj => obj.name.toLowerCase() === menuName.toLowerCase() && obj.storeID === storeID;
    if (!menu.some(checkExist)) {
        //upload img to storage
        const folder = 'Menu';
        const fileName = `${folder}/${Date.now()}`;
        const fileUpload = bucket.file(fileName);
        const newName = fileUpload.name.replace('/', '%2F');
        let publicUrl = "";
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });
        blobStream.on('error', (err) => {
            console.log(err);
            msg = 'Server Error. Please try again.';
            res.redirect('/restuarants/success/' + msg + '/' + path);
            //res.render('detailRestuarant', { title: 'Menu', storeName: req.session.userid[0]['name'], menuList: menu, menuTypeList: menuTypes, success: 'Server Error. Please try again.' });
        })
        blobStream.on('finish', async () => {
            console.log("Upload Successfully!")
            publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${newName}?alt=media&token=7801580f-40aa-4cc9-ba92-681777d3a309`;
            let id = 'M';
            menuLast = await getAllMenu();
            if (menuLast.length > 0) {
                let menuLastID = parseInt(((menuLast[0].id)?.split('M'))[1]);
                for (const x of menuLast) {
                    if (parseInt(((x.id)?.split('M'))[1]) > menuLastID) {
                        menuLastID = parseInt(((x.id)?.split('M'))[1])
                    }
                }
                const idCurrent = menuLastID + 1;
                id += idCurrent.toString();
            } else {
                id += "1";
            }
            let desValidate = ".";
            if (description != "") {
                desValidate = description;
            }
            const status = 1;
            await addMenu(id, storeID, typeFood, newMenuName, price, desValidate, publicUrl, status);
            msg = "Add menu successfully!";
            res.redirect('/restuarants/success/' + msg + '/' + path);
        })
        blobStream.end(req.file.buffer);
    } else {
        msg = "This menu name is already exist. Please try again.";
        res.redirect('/restuarants/success/' + msg + '/' + path);
    }
})

router.post('/editMenu/:id', upload.single("menuImg"), async (req, res, next) => {
    const menuID = req.params.id;
    const { menuName, description, price, typeFood, status } = req.body;
    const newMenuName = menuName.replace("&", "%26");
    let intStatus = 0;
    if (status == "on") {
        intStatus = 1;
    }
    let desValidate = ".";
    if (description != "") {
        desValidate = description;
    }
    const path = 'restuarants menu'
    let msg;

    if (req.file == null) {
        await updateMenuNoImage(menuID, newMenuName, price, desValidate, intStatus, typeFood);
        msg = 'Update menu successfully!';
        res.redirect('/restuarants/success/' + msg + '/' + path);
    } else {
        const folder = 'Menu';
        const fileName = `${folder}/${Date.now()}`;
        const fileUpload = bucket.file(fileName);
        const newName = fileUpload.name.replace('/', '%2F');
        let publicUrl = "";
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });
        blobStream.on('error', (err) => {
            console.log(err);
            msg = 'Server Error. Please try again.';
            res.redirect('/restuarants/success/' + msg + '/' + path);
        })
        blobStream.on('finish', async () => {
            publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${newName}?alt=media&token=7801580f-40aa-4cc9-ba92-681777d3a309`;
            await updateMenu(menuID, newMenuName, price, desValidate, publicUrl, intStatus, typeFood);
            msg = 'Update menu successfully!';
            res.redirect('/restuarants/success/' + msg + '/' + path);
        })
        blobStream.end(req.file.buffer);
    }
})

router.post('/deleteMenu/:id', async (req, res, next) => {
    const menuID = req.params.id;
    await deleteMenu(menuID);
    const path = 'restuarants menu';
    const msg = 'Delete menu successfully!';
    res.redirect('/restuarants/success/' + msg + '/' + path);
})

router.post('/logout', async (req, res) => {
    let session = req.session;
    session.userid = "";
    storeName = "";
    storeID = "";
    res.redirect('/');
})

router.get('/success/:msg/:path', async (req, res, next) => {
    const { msg, path } = req.params
    res.render('success', { success: msg, path: path });
})


router.post('/updateStatus/:orderID/:status', async (req, res, next) => {
    // let client = new WebSocket.Client('wss://avn-websocket-order.onrender.com');
    const { orderID, status } = req.params;
    if (status == 4) {
        const date = new Date();
        const currentdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        const currenttime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

        const paymentOrder = await getUserPayment(currentOrder.payID);
        const payStatusID = "PS3";
        await updateUserPayment(currentOrder.payID, currentdate, currenttime, payStatusID)

        if (paymentOrder[0].payTypeID == "PT2") {
            const userWallet = await getUserWallet(currentOrder.userID);
            const newBalance = totalCurrentOrder + userWallet.balance;
            //transaction user
            const userAllTransactions = await getUserTransactions();
            let id = 'TU';
            if (userAllTransactions.length > 0) {
                let userTransactionsID = parseInt(((userAllTransactions[0].transactionID)?.split('TU'))[1]);
                for (const x of userAllTransactions) {
                    if (parseInt(((x.transactionID)?.split('TU'))[1]) > userTransactionsID) {
                        userTransactionsID = parseInt(((x.transactionID)?.split('TU'))[1])
                    }
                }
                const idCurrent = userTransactionsID + 1;
                id += idCurrent.toString();
            } else {
                id += "1";
            }

            const trans_name = "Refund from " + storeName;

            await updateUserWallet(currentOrder.userID, newBalance);
            await createUserTransaction(id, userWallet.id, currentdate, currenttime, trans_name, totalCurrentOrder);
        }
    }
    await updateOrder(orderID, status);
    const msg = {
        "storeID": storeID,
        "orderStatus": status,
        "orderID": orderID
    }
    await db.collection("Orders").doc('Realtime').set(msg);
    // client.send(JSON.stringify(msg));
    res.redirect('/restuarants/')
})

router.post('/searchDate', async (req, res, next) => {
    const { date } = req.body;
    let order = await getOrder();
    let menu = await getMenu(storeID);
    let amountsuc = 0;
    let amountcan = 0;
    let CartDetail = await getCartDeatil();
    let totalres = 0;
    wallet = await getWalletStore(storeID);
    const transaction = await getTransactionStore(wallet[0]['walletID'])
    const dateSplit = date.toString().split('-')
    for (let i = 0; i < transaction.length; i++) {
        const tdateSplit = (transaction[i].date).split(' ')
        const transactionDateSplit = tdateSplit[0].split('/')
        if ( dateSplit[0] == transactionDateSplit[2] && parseInt(dateSplit[1])  == parseInt( transactionDateSplit[0])) {
              totalres += transaction[i].amount;
           }
        
    }
    for (let i = 0; i < order.length; i++) {
        const dateSplit = date.split('-')
        const orderDateSplit = (order[i].date).split('-')
        if (order[i].storeID == storeID && order[i].status == 3 && dateSplit[0] == orderDateSplit[0] && dateSplit[1] == orderDateSplit[1]) {
            amountsuc += 1; //แสดงออเดอร์ที่สำเร็จ
            // for (let j = 0; j < CartDetail.length; j++) {
            //     if (order[i].cartID == CartDetail[j].cartID) {
            //         for (let k = 0; k < menu.length; k++) {
            //             if (CartDetail[j].menuID == menu[k].id) {
            //                 totalres += CartDetail[j].amount * menu[k].price; //แสดงยอดขาย
            //             }

            //         }
            //     }

            // }
        }
        if (order[i].storeID == storeID && order[i].status == 4 && dateSplit[0] == orderDateSplit[0] && dateSplit[1] == orderDateSplit[1]) { // แสดงออเดอร์ที่ถูกยกเลิก
            amountcan += 1;
        }
    }
    res.render('income', { title: 'Income', storeName: storeName, totalres: totalres, amountsuc: amountsuc, amountcan: amountcan, date: date });
})

router.post('/withdrawn', async (req, res, next) => {
    const walletID = wallet[0]['walletID']
    const { AmountShow } = req.body;
    let balance = wallet[0]['balance'] - AmountShow;
    const TransactionStores = await getAllTransactionStore();
    let id = 'TS';
    if (TransactionStores.length > 0) {
        let TSID = parseInt(((TransactionStores[0].transactionID)?.split('TS'))[1]);
        for (const x of TransactionStores) {

            if (parseInt(((x.transactionID)?.split('TS'))[1]) > TSID) {
                TSID = parseInt(((x.transactionID)?.split('TS'))[1])
            }
        }

        const idCurrent = TSID + 1;
        id += idCurrent.toString();
    } else {
        id += "1";
    }
    const date = new Date();
    const currentdate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    const currenttime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

    await updateWallet(storeID, balance);
    await createTransaction(id, walletID, currentdate, currenttime, "เงินออก", AmountShow)
    const path = 'restuarants wallet';
    const msg = 'ถอนเงินสำเร็จ';
    res.redirect('/restuarants/success/' + msg + '/' + path);

})

module.exports = router;