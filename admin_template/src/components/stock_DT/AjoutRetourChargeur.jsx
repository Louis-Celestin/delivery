import Input from "../../components/form/input/InputField"
import Label from "../../components/form/Label"

export default function AjoutRetourChargeur() {
    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-6">
                <div>
                    <div  className="mb-6">
                        <span>Ajouter ou retirer un nombre de chargeur au stock</span>
                    </div>
                    <div>
                        <div>
                            <Label htmlFor="ajout">Ajout</Label>
                            <Input type="number" id="ajout" placeholder="Entrez un nombre" />
                            <div className="flex justify-center mt-3">
                                <button className="px-6 py-2 rounded-2xl border bg-green-400">
                                    Ajouter
                                </button>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="retour">Retour</Label>
                            <Input type="number" id="retour" placeholder="Entrez un nombre" />
                            <div className="flex justify-center mt-3">
                                <button className="px-6 py-2 rounded-2xl border bg-green-400">
                                    Retourner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}