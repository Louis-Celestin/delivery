const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");


const {getAllStock, setStock, getAllModels, addPiece} = require("../controllers/Stock/stockController")

router.get('/getAllStock', getAllStock);
router.put('/setStock', setStock);
router.get('/getAllModels', getAllModels);
router.post('/addPiece', addPiece);

module.exports = router