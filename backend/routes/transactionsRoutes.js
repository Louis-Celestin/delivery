const express = require("express")
const router = express.Router();

const {enterStock,retourStock} =  require("../controllers/Transactions/transactionsController")


router.post("/entreeStock", enterStock);
router.post("/retourStock", retourStock);

module.exports = router