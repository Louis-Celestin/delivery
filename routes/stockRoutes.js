const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");


const {getAllStock} = require("../controllers/Stock/stockController")

router.get('/getAllStock', getAllStock);

module.exports = router