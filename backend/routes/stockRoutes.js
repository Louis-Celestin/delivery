const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");


const {getAllStock, setStockPiece, getAllModels, addPiece, getAllMouvementStock, getPiece, modifyPiece,
    getLotPiece, getCartonLot, getCartonPiece, getItemModels, getItemServices, getStockPiece, getAllTypeMouvementStock,
} = require("../controllers/Stock/stockController")

router.get('/getAllStock', getAllStock);
router.put('/setStockPiece/:item_id/:model_id/:service_id', setStockPiece);
router.get('/getAllModels', getAllModels);
router.post('/addPiece', addPiece);
router.get('/getAllMouvementStock', getAllMouvementStock);
router.get('/getPiece/:id', getPiece);
router.put('/modifyPiece/:id', modifyPiece);
router.get('/getLotPiece/:id', getLotPiece);
router.get('/getCartonLot/:id', getCartonLot);
router.get('/getCartonPiece/:item_id/:model_id/:service_id', getCartonPiece);
router.get('/getItemModels/:id', getItemModels);
router.get('/getItemServices/:id', getItemServices);
router.get('/getStockPiece/:item_id/:model_id/:service_id', getStockPiece)
router.get('/getAllTypeMouvementStock', getAllTypeMouvementStock)

module.exports = router