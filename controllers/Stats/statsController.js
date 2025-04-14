const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 
const nbdeliverycharger =  async(req,res)=>{

    const {user_id} = req.body

    await prisma.transactions.count({
        where : {
            user_id : parseInt(user_id)
        }
    }).then((results)=>{
        if(results){
            return res.status(200).json({nbdeliverycharger:results})
        }else{
            return res.status(404).json({message : "Aucune donnée"})
        }
    }).catch(err=>{
        console.log(err)
    })
}

// 
const nbdeliverychargeurperperdiod = async(req,res)=>{
    const {datedebut, datefin, user_id} = req.body

    await prisma.transactions.count({
        where: {
            AND: [
                { user_id: parseInt(user_id) },
                { date_transaction: { gte: new Date(datedebut) } },
                { date_transaction: { lte: new Date(datefin) } }
            ]
        }
    }).then((results) => {
        if (results) {
            return res.status(200).json({ nbdeliverychargeurperperdiod: results });
        } else {
            return res.status(404).json({ message: "Aucune donnée" });
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ message: "Erreur serveur" });
    });
}

// 
const nbexitcharger = async(req,res)=>{
    const {user_id} = req.body
    console.log(user_id)
    await prisma.transactions.count({
        where : {
            AND : {
                user_id : parseInt(user_id),
                type_transaction : 'sortie'
            }
        }
    }).then((results)=>{
        if(results){
            return res.status(200).json({nbexitcharger:results})
        }else{
            return res.status(404).json({message : "Aucune donnée"})
        }
    }).catch(err=>{
        console.log(err)
    })
}

// 
const nbreturncharger = async(req,res)=>{
    const {user_id} = req.body
    console.log(user_id)
    await prisma.transactions.count({
        where : {
            AND : {
                user_id : parseInt(user_id),
                type_transaction : 'retour'
            }
        }
    }).then((results)=>{
        if(results){
            return res.status(200).json({nbreturncharger:results})
        }else{
            return res.status(404).json({message : "Aucune donnée"})
        }
    }).catch(err=>{
        console.log(err)
    })
}


// 
const nblivraisonpartype = async(req,res)=>{
    const {user_id} = req.body
    const [
        nblivraisontpegim,
        nblivraisontpemobile,
        livraisontperepare,
        livraisontpemaj,

    ] = await Promise.all([
        prisma.livraison.count({
            where: {
                type_livraison_id : 1,
                user_id : parseInt(user_id),
                statut_livraison : "livre"
            }
        }),
        prisma.livraison.count({
            where: {
                type_livraison_id : 4,
                user_id : parseInt(user_id),
                statut_livraison : "livre"
            }
        }),
        prisma.livraison.count({
            where: {
                type_livraison_id : 2,
                user_id : parseInt(user_id),
                statut_livraison : "livre"
            }
        }),
        prisma.livraison.count({
            where: {
                type_livraison_id : 3,
                user_id : parseInt(user_id),
                statut_livraison : "livre"
            }
        })
    ]).catch(err => {
        console.log(err)
    })

    const results = {
        nblivraisontpegim,
        nblivraisontpemobile,
        livraisontperepare,
        livraisontpemaj
    }
    if (results) {
        return res.status(200).json({ nblivraisonpartype: results });
    } else {
        return res.status(404).json({ message: "Aucune donnée" });
    }
}


// 

// const 


module.exports = {
    nbdeliverycharger,
    nbexitcharger,
    nbreturncharger,
    nbdeliverychargeurperperdiod,
    nblivraisonpartype
}

