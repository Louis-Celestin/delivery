const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");
// const multer = require("multer")
// const upload = multer({ storage: multer.memoryStorage() });
const {deliver,getAllLivraisons, getOneLivraison,deleteLivraison,updateLivraison, generateLivraisonPDF, deliverOld} = require("../controllers/Delivery/deliveryController")

router.post('/deliver', upload.single('signature_expediteur'), deliver);
router.get("/getAllLivraisons", getAllLivraisons);
router.get("/getOneLivraison/:id", getOneLivraison);
router.put("/updateLivraison/:id", updateLivraison);
router.get("/deleteLivraison/:id", deleteLivraison);
router.get("/pdf/:id", generateLivraisonPDF);
router.post("/deliverOld", deliverOld);


module.exports = router
