const express = require("express")
const router = express.Router();

const {nbdeliverycharger,nbreturncharger,nbexitcharger,nblivraisonpartype, nbdeliverychargeurperperdiod, statsreceveurs,nbetpepartypeparperiod,}=require("../controllers/Stats/statsController")

router.get("/nbdeliverycharger/:id", nbdeliverycharger)
router.get("/nbexitcharger/:id", nbexitcharger)
router.get("/nbreturncharger/:id", nbreturncharger)
router.get("/nblivraisonpartype/:id", nblivraisonpartype)
router.get("/nbdeliverychargeurperperdiod/:id", nbdeliverychargeurperperdiod)
router.get("/statsreceveurs/:id", statsreceveurs)
router.get("/nbetpepartypeparperiod/:id",nbetpepartypeparperiod)

module.exports = router