let express = require('express');
let router = express.Router();
const { getRestuarant, addRestuarant, getMenu, getMenuType, getAllWalletStore, addWalletStore } = require('../services/restuarantService');
const bcrypt = require("bcrypt");
const { deleteRestuarant, deleteWalletStore } = require('../services/adminService');
const saltRounds = 10
let restuarants;
let adminName = "";

async function hashPassword(plainPassword) {
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
}

router.get('/', async (req, res, next) => {
    restuarants = await getRestuarant();
    if (adminName == "") {
        adminName = req.session.userid[0]['id'];
    }
    res.render('restuarant', { title: 'Restuarant', adminName: adminName, RestuarantsList: restuarants, success: '' });
})

router.get('/show/:storeID/:storeName', async (req, res, next) => {
    const storeId = req.params.storeID
    const storeName = req.params.storeName;
    const menus = await getMenu(storeId);
    for (let index = 0; index < menus.length; index++) {
        let imgSplit = menus[index].image.split("Menu");
        imgSplit[1] = imgSplit[1].replace("/", "%2F");
        menus[index].image = imgSplit[0] + "Menu" + imgSplit[1];
    }
    let menuTypes = await getMenuType();
    res.render('restuarantmenu', { title: 'Menu Restuarant', adminName: adminName, storeName: storeName, menuList: menus, menuTypeList: menuTypes });
    //res.render('restuarantmenu', { title: 'Menu Restuarant', adminName: req.session.userid[0]['id'], storeName: storeName, menuList: menus, menuTypeList: menuTypes });
})

router.post('/', async (req, res, next) => {
    restuarants = await getRestuarant();
    const { storeName, usernameStore, passwordStore, telNumStore , emailStore, addressStore} = req.body;
    const checkName = obj => obj.name.toLowerCase() === storeName.toLowerCase();
    const checkUsername = obj => obj.username.toLowerCase() === usernameStore.toLowerCase();
    const newStoreName = storeName.replace("&", "%26");
    let msg = '';
    const path = 'restuarantsAdmin';
    //console.log(restuarants.some(checkUsername), restuarants.some(checkName));
    if (restuarants.some(checkName)) {
        //res.render('restuarant', { title: 'Restuarant', adminName: req.session.userid[0]['id'], RestuarantsList: restuarants, success: 'This store name is already exist. Please Try again.' });
        msg = 'This store name is already exist. Please Try again.';
    } else if (restuarants.some(checkUsername)) {
        //res.render('restuarant', { title: 'Restuarant', adminName: req.session.userid[0]['id'], RestuarantsList: restuarants, success: 'This store username is already exist. Please Try again.' });
        msg = 'This store username is already exist. Please Try again.';
    }
    else {
        const hashPass = await hashPassword(passwordStore);
        let id = 'S';
        if (restuarants.length > 0) {
            let storeTempID = restuarants[0]['storeID'];
            let storeTempArrID = storeTempID?.split('S');
            let restLastID = parseInt(storeTempArrID[1]);
            for (const x of restuarants) {
                storeTempID = x['storeID'];
                storeTempArrID = storeTempID?.split('S');
                if (parseInt(storeTempArrID[1]) > restLastID) {
                    restLastID = parseInt(storeTempArrID[1])
                }
            }
            // const lastId = restuarants[restuarants.length - 1]['storeID'];
            // const idSplit = lastId.split('S');
            const idCurrent = restLastID + 1;
            id += idCurrent.toString();
        } else {
            id += "1";
        }

        let Walletid = 'WS';
        const walletStore = await getAllWalletStore();
        if (walletStore.length > 0) {
            let walletStoreTempID = walletStore[0]['walletID'];
            let walletStoreTempIDArr = walletStoreTempID?.split('WS');
            let walletStoreLastID = parseInt(walletStoreTempIDArr[1]);
            for (const x of walletStore) {
                walletStoreTempID = x['walletID'];
                walletStoreTempIDArr = walletStoreTempID?.split('WS');
                if (parseInt(walletStoreTempIDArr[1]) > walletStoreLastID) {
                    walletStoreLastID = parseInt(walletStoreTempIDArr[1])
                }
            }
            // const lastId = restuarants[restuarants.length - 1]['storeID'];
            // const idSplit = lastId.split('S');
            const idCurrent = walletStoreLastID + 1;
            Walletid += idCurrent.toString();
        } else {
            Walletid += "1";
        }

        await addRestuarant(id, newStoreName, usernameStore, hashPass, telNumStore ,emailStore ,addressStore);
        await addWalletStore(Walletid, id, 0);

        //restuarants = await getRestuarant();
        msg = "Add restuarant successfully!";
    }
    res.redirect('/restuarantsAdmin/success/' + msg + '/' + path);
});

router.post('/deleteStore/:id', async (req, res, next) => {
    const storeID = req.params.id;
    await deleteWalletStore(storeID);
    await deleteRestuarant(storeID);
    //restuarants = await getRestuarant();
    const path = 'restuarantsAdmin';
    const msg = "Delete Restuarant successfully!";
    res.redirect('/restuarantsAdmin/success/' + msg + '/' + path);
    //res.render('restuarant', { title: 'Restuarant', adminName: req.session.userid[0]['id'], RestuarantsList: restuarants, success: 'Delete Restuarant successfully!' });
})

router.get('/success/:msg/:path', async (req, res, next) => {
    const { msg, path } = req.params
    res.render('success', { success: msg, path: path });
})
module.exports = router;