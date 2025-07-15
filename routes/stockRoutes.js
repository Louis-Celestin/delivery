const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");


const {getAllStock, setStock} = require("../controllers/Stock/stockController")

router.get('/getAllStock', getAllStock);
router.put('/setStock', setStock);

module.exports = router