const axios = require('axios')
https = require('https')
const URL = 'https://avn-api.onrender.com'
// const URL = 'https://localhost:7111'
const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = {
    getAdmin: async function () {
        const { data } = await axios.get(`${URL}/Admin`, { httpsAgent: agent })
        return data;
    },
    loginAdmin: async function (username) {
        const { data } = await axios.get(`${URL}/Admin/Login?keyword1=${username}`, { httpsAgent: agent })
        return data;
    },
    deleteRestuarant: async function (id) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.delete(`${URL}/Store/Delete?keyword=${id}`)
    },
    deleteWalletStore: async function (id) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.delete(`${URL}/WalletStore/Delete?keyword=${id}`)
    },
    updateStatusRider: async function (verifyID, verifyStatusID, adminID) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/VerifyRider/UpdateStatus?keyword1=${verifyID}&keyword2=${verifyStatusID}&keyword3=${adminID}`)
    },
    getRiderLog: async function () {
        const { data } = await axios.get(`${URL}/RiderLog`, { httpsAgent: agent })
        return data;
    },
    createLogRider: async function (logID ,verifyID, action, reason, date, time) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.post(`${URL}/RiderLog/Create?keyword1=${logID}&keyword2=${verifyID}&keyword3=${action}&keyword4=${reason}&keyword5=${date}&keyword6=${time}`)
    },
    getRider: async function () {
        const { data } = await axios.get(`${URL}/Rider`, { httpsAgent: agent })
        return data;
    },
    searchRider: async function (id) {
        const { data } = await axios.get(`${URL}/Rider/Search?keyword=${id}`, { httpsAgent: agent })
        return data;
    },
    getVerifyStatus: async function () {
        const { data } = await axios.get(`${URL}/VerifyStatus`, { httpsAgent: agent })
        return data;
    },
    getVerifyRider: async function () {
        const { data } = await axios.get(`${URL}/VerifyRider`, { httpsAgent: agent })
        return data;
    },
    deleteWalletRider: async function (id) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.delete(`${URL}/WalletRider/Delete?keyword=${id}`)
    },
    deleteRider: async function (id) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.delete(`${URL}/Rider/Delete?keyword=${id}`)
    },
    deleteVerifyRider: async function (id) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.delete(`${URL}/VerifyRider/Delete?keyword=${id}`)
    },
    deleteRiderLog: async function (id) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        await axios.delete(`${URL}/RiderLog/Delete?keyword=${id}`)
    },
}