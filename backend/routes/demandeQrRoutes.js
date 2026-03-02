const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");
const uploadAll = require("../middlewares/uploadAll")

const {
    getAllTypePaiement, faireDemandeQr, getAllDemandesQr, getOneDemandeQr, uploadDemandeQr,
} = require("../controllers/Demande/demandeQrController")

router.get('/getAllTypePaiement', getAllTypePaiement);
router.post('/faireDemandeQr', faireDemandeQr);
router.get('/getAllDemandesQr', getAllDemandesQr);
router.get('/getOneDemandeQr/:id', getOneDemandeQr);
router.put('/uploadDemandeQr/:id', uploadAll.fields([
    { name: 'qrCodes'},
]), uploadDemandeQr)

module.exports = router