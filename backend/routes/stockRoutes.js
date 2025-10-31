const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");


const {getAllStock, setStockPiece, getAllModels, addPiece, getAllMouvementStock, getPiece, modifyPiece,
    getLotPiece, getCartonLot, getCartonPiece, getItemModels, getItemServices, getStockPiece, getAllTypeMouvementStock,
    setStockCarton, setStockPieceCarton,
} = require("../controllers/Stock/stockController")

router.get('/getAllStock', getAllStock);
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
router.put('/setStockPiece/:item_id/:model_id/:service_id', setStockPiece);
router.put('/setStockCarton/:item_id/:model_id/:service_id', setStockCarton);
router.put('/setStockPieceCarton/:item_id/:model_id/:service_id', setStockPieceCarton);

module.exports = router