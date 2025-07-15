const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");


// Attribuer une quantité à un stock choisi en fonction de l'ID du stock.
const setStock = async (req, res) =>{

}



const getAllStock = async (req, res) =>{
    try {
        const stock = await prisma.stock_dt.findMany({
            orderBy: { nom_piece: 'asc' },
        });

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du stock", error });
    }
}


// Augmenter la quantité d'un stock
const plusQte = async (req, res) =>{

}


// Diminuer la quantité d'un stock
const minusQte = async (req, res) =>{

}

module.exports = {
    setStock,
    getAllStock,
}
