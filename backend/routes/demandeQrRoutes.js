const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploads");
const uploadAll = require("../middlewares/uploadAll")

const {
    getAllTypePaiement, faireDemandeQr, getAllDemandesQr,
} = require("../controllers/Demande/demandeQrController")

router.get('/getAllTypePaiement', getAllTypePaiement);
router.post('/faireDemandeQr', faireDemandeQr);
router.get('/getAllDemandesQr', getAllDemandesQr);

module.exports = router