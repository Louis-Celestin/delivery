const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");


const {getAllStock, setStock, getAllModels, addPiece, getAllMouvementStock, getPiece, modifyPiece} = require("../controllers/Stock/stockController")

router.get('/getAllStock', getAllStock);
router.put('/setStock/:id', setStock);
router.get('/getAllModels', getAllModels);
router.post('/addPiece', addPiece);
router.get('/getAllMouvementStock', getAllMouvementStock);
router.get('/getPiece/:id', getPiece);
router.put('/modifyPiece/:id', modifyPiece)

module.exports = router