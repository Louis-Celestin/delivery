const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Stats livreurs
// 
const nbdeliverycharger =  async(req,res)=>{

    const {id} = req.params
    const user = await prisma.users.findFirst({
        where : {
            id_user : parseInt(id)
        }
    })
    if(!user) return res.status(404).json({message :"Utilisateur non trouvé"})
        

    await prisma.transactions.count({
        where : {
            user_id : parseInt(id)
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
    const {datedebut, datefin} = req.body
    const {id} = req.params

    const user = await prisma.users.findFirst({
        where : {
            id_user : parseInt(id)
        }
    })
    if(!user) return res.status(404).json({message :"Utilisateur non trouvé"})
        

    await prisma.transactions.count({
        where: {
            AND: [
                { user_id: parseInt(id) },
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
    const {id} = req.params
    const user = await prisma.users.findFirst({
        where : {
            id_user : parseInt(id),
        },
    })
    if(!user) return res.status(404).json({message :"Utilisateur non trouvé"})
    console.log(id)
    await prisma.transactions.count({
        where : {
            AND : {
                user_id : parseInt(id),
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
    // const {user_id} = req.body
    const {id} = req.params
    const user = await prisma.users.findFirst({
        where : {
            id_user : parseInt(id)
        }
    })
    if(!user) return res.status(404).json({message :"Utilisateur non trouvé"})
        
    console.log(id)
    await prisma.transactions.count({
        where : {
            AND : {
                user_id : parseInt(id),
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
    // const {user_id} = req.body
    const {id} = req.params
    const user = await prisma.users.findFirst({
        where : {
            id_user : parseInt(id)
        }
    })
    if(!user) return res.status(404).json({message :"Utilisateur non trouvé"})
        
    const [
        nblivraisontpegim,
        nblivraisontpemobile,
        livraisontperepare,
        livraisontpemaj,

    ] = await Promise.all([
        prisma.livraison.count({
            where: {
                type_livraison_id : 1,
                user_id : parseInt(id),
                statut_livraison : "livre"
            }
        }),
        prisma.livraison.count({
            where: {
                type_livraison_id : 4,
                user_id : parseInt(id),
                statut_livraison : "livre"
            }
        }),
        prisma.livraison.count({
            where: {
                type_livraison_id : 2,
                user_id : parseInt(id),
                statut_livraison : "livre"
            }
        }),
        prisma.livraison.count({
            where: {
                type_livraison_id : 3,
                user_id : parseInt(id),
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

// Stats receveurs

const statsreceveurs = async(req,res)=>{
    // const {user_id} = req.body
    const {id} = req.params
    const user = await prisma.users.findFirst({
        where : {
            id_user : parseInt(id)
        },
        include : {
            roles : {
                where : {
                    id_role : 2
                }
            }
        }
    })
    if(!user) return res.status(404).json({message :"Utilisateur non trouvé"})
        console.log(user)
    if(user.role_id !== 2) return res.status(404).json({message :"Utilisateur non recepteur"})
     
        
    const [
        nbtpegimreçus,
        nbtpemobilereçus,
        nbtpereparesreçus,
        nbtpemajreçus,
        nbchargeursreçus,
    ] = await Promise.all([
        prisma.validations.findMany({
            where: {
                user_id: parseInt(id),
                etat_validation: "valide",
                livraison: {
                  type_livraison_id: 1
                }
              },
              select: {
                livraison: {
                  select: {
                    qte_totale_livraison: true
                  }
                }
              }
        }).then((results) => {
            let total = 0;
            results.forEach((result) => {
                total += result.livraison.qte_totale_livraison;
            });
            return total;
        }).catch(err => {
            console.log(err);
        }),
        prisma.validations.findMany({
            where: {
                user_id: parseInt(id),
                etat_validation: "valide",
                livraison: {
                  type_livraison_id: 4
                }
              },
              select: {
                livraison: {
                  select: {
                    qte_totale_livraison: true
                  }
                }
              }
        }).then((results) => {
            let total = 0;
            results.forEach((result) => {
                total += result.livraison.qte_totale_livraison;
            });
            return total;
        }).catch(err => {
            console.log(err);
        }),
        prisma.validations.findMany({
            where: {
                user_id: parseInt(id),
                etat_validation: "valide",
                livraison: {
                  type_livraison_id: 2
                }
              },
              select: {
                livraison: {
                  select: {
                    qte_totale_livraison: true
                  }
                }
              }
        }).then((results) => {
            let total = 0;
            results.forEach((result) => {
                total += result.livraison.qte_totale_livraison;
            });
            return total;
        }).catch(err => {
            console.log(err);
        }),
        prisma.validations.findMany({
            where: {
                user_id: parseInt(id),
                etat_validation: "valide",
                livraison: {
                  type_livraison_id: 3
                }
              },
              select: {
                livraison: {
                  select: {
                    qte_totale_livraison: true
                  }
                }
              }
        }).then((results) => {
            let total = 0;
            results.forEach((result) => {
                total += result.livraison.qte_totale_livraison;
            });
            return total;
        }).catch(err => {
            console.log(err);
        }),
        prisma.validations.count({
            where: {
                user_id: parseInt(id),
                etat_validation: "valide",
                livraison: {
                  type_livraison_id: 5
                }
              }
        }).then((results) => {
            return results;
        }).catch(err => {
            console.log(err);
        }),
    ]).catch(err => {
        console.log(err);
    });

    const results = {
        nbtpegimreçus,
        nbtpemobilereçus,
        nbtpereparesreçus,
        nbtpemajreçus,
        nbchargeursreçus
    }
    if (results) {
        return res.status(200).json({ statsreceveurs: results });
    } else {
        return res.status(404).json({ message: "Aucune donnée" });
    }
}


// Nombre TPE livrés par TYPE par période

const nbetpepartypeparperiod = async (req, res) => {
    const { id } = req.params;
    const { debut, fin } = req.body;

    // Validate dates
    if (!debut || !fin) {
        return res.status(400).json({ message: "Veuillez fournir les dates de début et de fin." });
    }

    const startDate = new Date(debut);
    const endDate = new Date(fin);

    const user = await prisma.users.findFirst({
        where: {
            id_user: parseInt(id)
        },
        include: {
            roles: {
                where: {
                    id_role: 1
                }
            }
        }
    });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    if (user.role_id !== 1) return res.status(403).json({ message: "Utilisateur non livreur" });

    try {
        const [
            nbtpegimreçus,
            nbtpemobilereçus,
            nbtpereparesreçus,
            nbtpemajreçus,
            nbchargeursreçus,
        ] = await Promise.all([
            // Type 1 - TPE GIM
           prisma.livraison.count({
            where: {
                type_livraison_id : 1,
                user_id : parseInt(id),
                statut_livraison : "livre",
                date_validation: {
                        gte: startDate,
                        lte: endDate
                    },
            }
        }),

            // Type 4 - TPE Mobile
            prisma.validations.findMany({
                where: {
                    user_id: parseInt(id),
                    etat_validation: "valide",
                    date_validation: {
                        gte: startDate,
                        lte: endDate
                    },
                    livraison: {
                        type_livraison_id: 4
                    }
                },
                select: {
                    livraison: {
                        select: {
                            qte_totale_livraison: true
                        }
                    }
                }
            }).then((results) => {
                let total = 0;
                results.forEach((result) => {
                    total += result.livraison.qte_totale_livraison;
                });
                return total;
            }).catch(err => {
                console.log(err);
            }),

            // Type 2 - TPE Réparés
            prisma.validations.findMany({
                where: {
                    user_id: parseInt(id),
                    etat_validation: "valide",
                    date_validation: {
                        gte: startDate,
                        lte: endDate
                    },
                    livraison: {
                        type_livraison_id: 2
                    }
                },
                select: {
                    livraison: {
                        select: {
                            qte_totale_livraison: true
                        }
                    }
                }
            }).then((results) => {
                let total = 0;
                results.forEach((result) => {
                    total += result.livraison.qte_totale_livraison;
                });
                return total;
            }).catch(err => {
                console.log(err);
            }),

            // Type 3 - TPE MAJ
            prisma.validations.findMany({
                where: {
                    user_id: parseInt(id),
                    etat_validation: "valide",
                    date_validation: {
                        gte: startDate,
                        lte: endDate
                    },
                    livraison: {
                        type_livraison_id: 3
                    }
                },
                select: {
                    livraison: {
                        select: {
                            qte_totale_livraison: true
                        }
                    }
                }
            }).then((results) => {
                let total = 0;
                results.forEach((result) => {
                    total += result.livraison.qte_totale_livraison;
                });
                return total;
            }).catch(err => {
                console.log(err);
            }),

            // Type 5 - Chargeurs (count only)
            prisma.validations.count({
                where: {
                    user_id: parseInt(id),
                    etat_validation: "valide",
                    date_validation: {
                        gte: startDate,
                        lte: endDate
                    },
                    livraison: {
                        type_livraison_id: 5
                    }
                }
            })
        ]);

        const results = {
            nbtpegimreçus,
            nbtpemobilereçus,
            nbtpereparesreçus,
            nbtpemajreçus,
            nbchargeursreçus
        };

        return res.status(200).json({ statsreceveurs: results });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors du calcul des statistiques." });
    }
};


// const nbetpepartypeparperiod = async (req, res) => {
//     const { datedebut, datefin } = req.body;
//     const { id } = req.params;

//     try {
//         const user = await prisma.users.findFirst({
//             where: { id_user: parseInt(id) },
//             include: {
//                 roles: {
//                     where: { id_role: 1 }
//                 }
//             }
//         });

//         if (!user) {
//             return res.status(404).json({ message: "Utilisateur non trouvé" });
//         }

//         if (user.role_id !== 1) {
//             return res.status(403).json({ message: "Utilisateur non recepteur" });
//         }

//         const startDate = new Date(datedebut);
//         const endDate = new Date(datefin);

//         const getTotalLivraisonByType = async (typeId) => {
//             const records = await prisma.validations.findMany({
//                 where: {
//                     date_validation: {
//                         gte: startDate,
//                         lte: endDate
//                     },
//                     user_id: parseInt(id),
//                     etat_validation: "valide",
//                     livraison: {
//                         type_livraison_id: typeId
//                     }
//                 },
//                 select: {
//                     livraison: {
//                         select: {
//                             qte_totale_livraison: true
//                         }
//                     }
//                 }
//             });

//             return records.reduce((total, record) => total + record.livraison.qte_totale_livraison, 0);
//         };

//         const [
//             nbtpegimreçus,
//             nbtpemobilereçus,
//             nbtpereparesreçus,
//             nbtpemajreçus
//         ] = await Promise.all([
//             getTotalLivraisonByType(1),
//             getTotalLivraisonByType(4),
//             getTotalLivraisonByType(2),
//             getTotalLivraisonByType(3)
//         ]);

//         const nbchargeursreçus = await prisma.validations.count({
//             where: {
//                 date_validation: {
//                     gte: startDate,
//                     lte: endDate
//                 },
//                 user_id: parseInt(id),
//                 etat_validation: "valide",
//                 livraison: {
//                     type_livraison_id: 5
//                 }
//             }
//         });

//         const results = {
//             nbtpegimreçus,
//             nbtpemobilereçus,
//             nbtpereparesreçus,
//             nbtpemajreçus,
//             nbchargeursreçus
//         };

//         return res.status(200).json({ tpepartypeparperiod: results });
//     } catch (error) {
//         console.error("Erreur serveur :", error);
//         return res.status(500).json({ message: "Erreur interne du serveur" });
//     }
// };


// const nbetpepartypeparperiod = async(req,res)=>{
//     const {datedebut, datefin} = req.body
//     const {id} = req.params

//     const user = await prisma.users.findFirst({
//         where : {
//             id_user : parseInt(id)
//         },
//         include : {
//             roles : {
//                 where : {
//                     id_role : 1
//                 }
//             }
//         }
//     })
//     if(!user) return res.status(404).json({message :"Utilisateur non trouvé"})
//         console.log(user)
//     if(user.role_id !== 1) return res.status(404).json({message :"Utilisateur non recepteur"})
    
//     const [
//         nbtpegimreçus,
//         nbtpemobilereçus,
//         nbtpereparesreçus,
//         nbtpemajreçus,
//         nbchargeursreçus,
//     ] = await Promise.all([
//         prisma.validations.findMany({
//             where: {
//                 date_transaction: { gte: new Date(datedebut) },
//                 date_transaction: { lte: new Date(datefin) },
//                 user_id: parseInt(id),
//                 etat_validation: "valide",
//                 livraison: {
//                   type_livraison_id: 1
//                 }
//               },
//               select: {
//                 livraison: {
//                   select: {
//                     qte_totale_livraison: true
//                   }
//                 }
//               }
//         }).then((results) => {
//             let total = 0;
//             results.forEach((result) => {
//                 total += result.livraison.qte_totale_livraison;
//             });
//             return total;
//         }).catch(err => {
//             console.log(err);
//         }),
//         prisma.validations.findMany({
//             where: {
//                 user_id: parseInt(id),
//                 etat_validation: "valide",
//                 livraison: {
//                   type_livraison_id: 4
//                 }
//               },
//               select: {
//                 livraison: {
//                   select: {
//                     qte_totale_livraison: true
//                   }
//                 }
//               }
//         }).then((results) => {
//             let total = 0;
//             results.forEach((result) => {
//                 total += result.livraison.qte_totale_livraison;
//             });
//             return total;
//         }).catch(err => {
//             console.log(err);
//         }),
//         prisma.validations.findMany({
//             where: {
//                 user_id: parseInt(id),
//                 etat_validation: "valide",
//                 livraison: {
//                   type_livraison_id: 2
//                 }
//               },
//               select: {
//                 livraison: {
//                   select: {
//                     qte_totale_livraison: true
//                   }
//                 }
//               }
//         }).then((results) => {
//             let total = 0;
//             results.forEach((result) => {
//                 total += result.livraison.qte_totale_livraison;
//             });
//             return total;
//         }).catch(err => {
//             console.log(err);
//         }),
//         prisma.validations.findMany({
//             where: {
//                 user_id: parseInt(id),
//                 etat_validation: "valide",
//                 livraison: {
//                   type_livraison_id: 3
//                 }
//               },
//               select: {
//                 livraison: {
//                   select: {
//                     qte_totale_livraison: true
//                   }
//                 }
//               }
//         }).then((results) => {
//             let total = 0;
//             results.forEach((result) => {
//                 total += result.livraison.qte_totale_livraison;
//             });
//             return total;
//         }).catch(err => {
//             console.log(err);
//         }),
//         prisma.validations.count({
//             where: {
//                 user_id: parseInt(id),
//                 etat_validation: "valide",
//                 livraison: {
//                   type_livraison_id: 5
//                 }
//               }
//         }).then((results) => {
//             return results;
//         }).catch(err => {
//             console.log(err);
//         }),
//     ]).catch(err => {
//         console.log(err);
//     });

//     const results = {
//         nbtpegimreçus,
//         nbtpemobilereçus,
//         nbtpereparesreçus,
//         nbtpemajreçus,
//         nbchargeursreçus
//     }
//     if (results) {
//         return res.status(200).json({ statsreceveurs: results });
//     } else {
//         return res.status(404).json({ message: "Aucune donnée" });
//     }
// }


module.exports = {
    nbdeliverycharger,
    nbexitcharger,
    nbreturncharger,
    nbdeliverychargeurperperdiod,
    nblivraisonpartype,
    statsreceveurs,
    nbetpepartypeparperiod,
}

