const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../config/clouddinaryConifg");


// Attribuer une quantité à un stock choisi en fonction de l'ID du stock.
const setStock = async (req, res) =>{

}


// Obtenir la quantité d'un stock
const getStock = async (req, res) =>{

}


// Augmenter la quantité d'un stock
const plusQte = async (req, res) =>{

}


// Diminuer la quantité d'un stock
const minusQte = async (req, res) =>{

}
