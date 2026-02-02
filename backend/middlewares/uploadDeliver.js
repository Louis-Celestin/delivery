const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = "uploads/";

        if (file.fieldname === "signature_expediteur") {
            dir = "uploads/signatures/";
        } else if (file.fieldname === "files") {
            dir = "uploads/files/";
        }

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "signature_expediteur") {
        // Signature → image only
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("La signature doit être une image"));
        }
        //   } else if (file.fieldname === "files") {
        //     // Documents
        //     const allowed = [
        //       "image/",
        //       "application/pdf",
        //       "application/vnd.ms-excel",
        //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        //     ];

        //     if (allowed.some(type => file.mimetype.startsWith(type))) {
        //       cb(null, true);
        //     } else {
        //       cb(new Error("Type de fichier non supporté"));
        //     }
    } else {
        cb(null, false);
    }
};

const uploadDeliver = multer({ storage, fileFilter });

module.exports = uploadDeliver;