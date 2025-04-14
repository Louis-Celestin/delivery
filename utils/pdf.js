const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");


const generateDemandePaiementPDF = async (livraison, outputPath) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    if(livraison.type_livraison_id === 1) {

        let template = fs.readFileSync(path.join(__dirname, "../statics/templates/livraison_tpe_gim.html"), "utf8");
    }else if(livraison.type_livraison_id === 2) {
        let template = fs.readFileSync(path.join(__dirname, "../statics/templates/livraison_tpe_repare.html"), "utf8");
    }else if(livraison.type_livraison_id === 3) {
        let template = fs.readFileSync(path.join(__dirname, "../statics/templates/livraison_mj_gim.html"), "utf8");
    }
    else if(livraison.type_livraison_id === 4) {
        let template = fs.readFileSync(path.join(__dirname, "../statics/templates/livraison_tpe_mobile.html"), "utf8");
    }else if(livraison.type_livraison_id === 5) {
        let template = fs.readFileSync(path.join(__dirname, "../statics/templates/livraison_chargeur_tpe.html"), "utf8");
    }


    template = template
        .replace("{{montant_lettres}}", montant_lettres || "")
        .replace("{{montant}}", demande.montant.toLocaleString() || "")
        .replace("{{motif}}", demande.motif || "")
        .replace("{{beneficiaire}}", demande.beneficiaire || "")
        .replace("{{demandeur_signature}}", demande.demandeur_signature || "Signé")
        .replace("{{approbation_dg}}", demande.approbation_dg || "Signé")
        .replace("{{approbation_daf}}", demande.approbation_daf || "Signé")
        .replace("{{signature}}", demande.signature || "Signé")
        .replace("{{beneficiaire_signature}}", demande.beneficiaire_signature || "Signé");

    await page.setContent(template, { waitUntil: "networkidle0" });

    // 🔹 Générer le PDF
    await page.pdf({
        path: outputPath,
        format: "A4",
        printBackground: true,
    });

    await browser.close();
};

module.exports = { generateDemandePaiementPDF };
