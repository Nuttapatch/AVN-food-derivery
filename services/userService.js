const axios = require('axios')
https = require('https')
const URL = 'https://avn-api.onrender.com'
// const URL = 'https://localhost:7111'
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = {
    getUserWallet: async function (userID) {
        const { data } = await axios.get(`${URL}/Wallet/Search?keyword=${userID}`, { httpsAgent: agent })
        return data;
    },
    getUserPayment: async function (payID) {
        const { data } = await axios.get(`${URL}/Payment/Search?keyword=${payID}`, { httpsAgent: agent })
        return data;
    },
    updateUserPayment: async function (payID,date,time,payStatusID) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/Payment/Update?keyword1=${payID}&keyword2=${date}&keyword3=${time}&keyword4=${payStatusID}`)
    },
    updateUserWallet: async function (userID,balance) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/Wallet/Update?keyword1=${userID}&keyword2=${balance}`)
    },
    getUserTransactions: async function () {
        const { data } = await axios.get(`${URL}/TransactionUser`, { httpsAgent: agent })
        return data;
    },
    createUserTransaction: async function (transactionID, walletID, date, time, trans_name, amount) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/TransactionUser/Create?keyword1=${transactionID}&keyword2=${walletID}&keyword3=${date}&keyword4=${time}&keyword5=${trans_name}&keyword6=${amount}`)
    },
}