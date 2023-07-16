const axios = require('axios')
https = require('https')
const URL = 'https://avn-api.onrender.com'
// const URL = 'https://localhost:7111'
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = {
    getRestuarant: async function () {
        const { data } = await axios.get(`${URL}/Store`, { httpsAgent: agent })
        return data;
    },
    loginRestuarant: async function (username) {
        const { data } = await axios.get(`${URL}/Store/Login?keyword1=${username}`, { httpsAgent: agent })
        return data;
    },
    addRestuarant: async function (id, name, username, password, telNum , email , address) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/Store/Create?keyword1=${id}&keyword2=${name}&keyword3=${username}&keyword4=${password}&keyword5=${telNum}&keyword6=${email}&keyword7=${address}`)
    },
    getMenu: async function (storeID) {
        const { data } = await axios.get(`${URL}/Menu/Search?keyword=${storeID}`, { httpsAgent: agent })
        return data;
    },
    getAllMenu: async function () {
        const { data } = await axios.get(`${URL}/Menu`, { httpsAgent: agent })
        return data;
    },
    getMenuType: async function (storeID) {
        const { data } = await axios.get(`${URL}/MenuType/Search?keyword=${storeID}`, { httpsAgent: agent })
        return data;
    },
    getAllMenuType: async function (storeID) {
        const { data } = await axios.get(`${URL}/MenuType`, { httpsAgent: agent })
        return data;
    },
    getMenuLast: async function () {
        const { data } = await axios.get(`${URL}/Menu/SearchLast`, { httpsAgent: agent })
        return data;
    },
    getMenuTypeLast: async function () {
        const { data } = await axios.get(`${URL}/MenuType/SearchLast`, { httpsAgent: agent })
        return data;
    },
    addMenuType: async function (id, name, store) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/MenuType/Create?keyword1=${id}&keyword2=${name}&keyword3=${store}`)
    },
    deleteMenuType: async function (id) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.delete(`${URL}/MenuType/Delete?keyword=${id}`)
    },
    addMenu: async function (id, storeID, menuTypeID, name, price, description, image, status) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/Menu/Create?keyword1=${id}&keyword2=${storeID}&keyword3=${name}&keyword4=${price}&keyword5=${description}&keyword6=${image}&keyword7=${status}&keyword8=${menuTypeID}`)
    },
    updateMenu: async function (id, name, price, description, image, status, menuTypeID) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/Menu/Update?keyword1=${id}&keyword2=${name}&keyword3=${price}&keyword4=${description}&keyword5=${image}&keyword6=${status}&keyword7=${menuTypeID}`)
    },
    updateMenuNoImage: async function (id, name, price, description, status, menuTypeID) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/Menu/UpdateNoImage?keyword1=${id}&keyword2=${name}&keyword3=${price}&keyword4=${description}&keyword5=${status}&keyword6=${menuTypeID}`)
    },
    deleteMenu: async function (id) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.delete(`${URL}/Menu/Delete?keyword=${id}`)
    },
    getOrder: async function () {
        const { data } = await axios.get(`${URL}/Order`, { httpsAgent: agent })
        return data;
    },
    getOrderDetail: async function () {
        const { data } = await axios.get(`${URL}/OrderDetail`, { httpsAgent: agent })
        return data;
    },
    getUser: async function () {
        const { data } = await axios.get(`${URL}/User`, { httpsAgent: agent })
        return data;
    },
    getRider: async function () {
        const { data } = await axios.get(`${URL}/Rider`, { httpsAgent: agent })
        return data;
    },
    getCartDeatil: async function () {
        const { data } = await axios.get(`${URL}/CartDetail`, { httpsAgent: agent })
        return data;
    },
    getCart: async function () {
        const { data } = await axios.get(`${URL}/Cart`, { httpsAgent: agent })
        return data;
    },
    updateOrder: async function (orderID,status) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/Order/Update?keyword1=${orderID}&keyword2=${status}`)
    },
    getAllWalletStore: async function () {
        const { data } = await axios.get(`${URL}/WalletStore`, { httpsAgent: agent })
        return data;
    },
    getWalletStore: async function (storeID) {
        const { data } = await axios.get(`${URL}/WalletStore/Search?keyword=${storeID}`, { httpsAgent: agent })
        return data;
    },
    addWalletStore: async function (walletID, storeID, balance) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/WalletStore/Create?keyword1=${walletID}&keyword2=${storeID}&keyword3=${balance}`)
    },
    getTransactionStore: async function (walletID) {
        const { data } = await axios.get(`${URL}/TransactionStore/Search?keyword=${walletID}`, { httpsAgent: agent })
        return data;
    },
    updateWallet: async function (storeID, balance) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/WalletStore/Update?keyword1=${storeID}&keyword2=${balance}`)
    },
    createTransaction: async function (transactionID , walletID , date ,time,name,amount) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/TransactionStore/Create?keyword1=${transactionID}&keyword2=${walletID}&keyword3=${date}&keyword4=${time}&keyword5=${name}&keyword6=${amount}`)
    },
    getAllTransactionStore: async function () {
        const { data } = await axios.get(`${URL}/TransactionStore`, { httpsAgent: agent })
        return data;
    },
}