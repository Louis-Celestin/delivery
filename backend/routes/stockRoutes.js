const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");


const {getAllItems, setStockPiece, getAllModels, addPiece, getAllMouvementStock, getPiece, modifyPiece,
    getLotPiece, getCartonLot, getCartonPiece, getItemModels, getItemServices, getStockPiece, getAllTypeMouvementStock,
    setStockCarton, setStockPieceCarton, setStockLot, setStockCartonLot, getOneMouvement, createStock,
    getAllStocks,
} = require("../controllers/Stock/stockController")

router.get('/getAllItems', getAllItems);
router.get('/getAllModels', getAllModels);
router.post('/addPiece', addPiece);
router.get('/getAllMouvementStock', getAllMouvementStock);
router.get('/getPiece/:id', getPiece);
router.put('/modifyPiece/:id', modifyPiece);
router.get('/getLotPiece/:item_id/:model_id/:service_id', getLotPiece);
router.get('/getCartonLot/:id', getCartonLot);
router.get('/getCartonPiece/:item_id/:model_id/:service_id', getCartonPiece);
router.get('/getItemModels/:id', getItemModels);
router.get('/getItemServices/:id', getItemServices);
router.get('/getStockPiece/:item_id/:model_id/:service_id', getStockPiece);
router.get('/getAllTypeMouvementStock', getAllTypeMouvementStock);
router.put('/setStockPiece/:item_id/:model_id/:service_id', setStockPiece);
router.put('/setStockCarton/:item_id/:model_id/:service_id', setStockCarton);
router.put('/setStockPieceCarton/:item_id/:model_id/:service_id', setStockPieceCarton);
router.put('/setStockCartonLot/:item_id/:model_id/:service_id', setStockCartonLot);
router.put('/setStockLot/:item_id/:model_id/:service_id', setStockLot);
router.get('/getOneMouvement/:id', getOneMouvement);
router.put('/createStock', createStock);
router.get('/getAllStocks', getAllStocks);

module.exports = router