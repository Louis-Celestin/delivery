-- AlterTable
ALTER TABLE `fichiers` MODIFY `role` ENUM('livreur', 'receveur', 'demandeur', 'validateur', 'regularisateur', 'generateur') NOT NULL;
