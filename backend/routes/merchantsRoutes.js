const express = require("express")
const router = express.Router();

const {findMerchant} =  require("../controllers/merchants/merchantsInfoController")


router.get("/findMerchant", findMerchant);

module.exports = router