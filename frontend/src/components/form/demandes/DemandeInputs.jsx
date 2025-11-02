import { useEffect, useState, useRef } from "react"
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Checkbox from "../input/Checkbox.tsx";
import Select from "../Select.tsx";
import { MultiSelect } from "primereact/multiselect";
import TextArea from "../input/TextArea.tsx";
import Swal from 'sweetalert2'
import { Modal } from "../../ui/modal/index.tsx";
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from "react-router";

import { Stock } from "../../../backend/stock/Stock.js";
import { Users } from "../../../backend/users/Users.js";

export default function DemandeInputs() {

  const stockData = new Stock()
  const userData = new Users()

  const [loading, setLoading] = useState(false)
  const [errorForm, setErrorForm] = useState('')

  const [items, setItems] = useState([])
  const [optionsItems, setOptionsItems] = useState([])

  const [models, setModels] = useState([])
  const [optionsModels, setOptionsModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [nomModel, setNomModel] = useState('')

  const [servicesPiece, setServicesPiece] = useState([])
  const [optionsServicesPiece, setOptionsServicesPieces] = useState([])
  const [selectedServicePiece, setSelectedServicePiece] = useState(null)
  const [nomServicePiece, setNomServicePiece] = useState('')

  const [selectedPiece, setSelectedPiece] = useState(null)
  const [nomPiece, setNomPiece] = useState('')

  const [parLot, setParLot] = useState(false)
  const [parCartonLot, setParCartonLot] = useState(false)
  const [parPieceCarton, setParPieceCarton] = useState(false)
  const [parCarton, setParCarton] = useState(false)
  const [parPiece, setParPiece] = useState(false)

  const [quantitePiece, setQuantitePiece] = useState(null)
  const [newStockPiece, setNewStockPiece] = useState(0)
  const [finalStockPiece, setFinaleStockPiece] = useState(0)
  const [entreeParPieceModalOpen, setEntreeParPieceModalOpen] = useState(false)
  const [sortieParPieceModalOpen, setSortieParPieceModalOpen] = useState(false)

  const [quantiteCarton, setQuantiteCarton] = useState(null)
  const [newStockCarton, setNewStockCarton] = useState(0)
  const [finalStockCarton, setFinalStockCarton] = useState(0)
  const [quantitePieceCarton, setQuantitePieceCarton] = useState(0)
  const [entreeParCartonModalOpen, setEntreeParCartonModalOpen] = useState(false)
  const [sortieParCartonModalOpen, setSortieParCartonModalOpen] = useState(false)
  const [selectedCartons, setSelectedCartons] = useState([])
  const [listeCartons, setListeCartons] = useState([])

  const [stockPieceCarton, setStockPieceCarton] = useState(0)
  const [finalStockPieceCarton, setFinalStockPieceCarton] = useState(0)
  const [selectedCarton, setSelectedCarton] = useState(null)
  const [entreeParPieceCartonModalOpen, setEntreeParPieceCartonModalOpen] = useState(false)
  const [sortieParPieceCartonModalOpen, setSortieParPieceCartonModalOpen] = useState(false)
  const [nomCarton, setNomCarton] = useState('')

  const [stockCartonLot, setStockCartonLot] = useState(0)
  const [finalStockCartonLot, setFinalStockCartonLot] = useState(0)
  const [selectedLot, setSelectedLot] = useState(null)
  const [nomLot, setNomLot] = useState('')
  const [entreeParCartonLotModalOpen, setEntreeParCartonLotModalOpen] = useState(false)
  const [sortieParCartonLotModalOpen, setSortieParCartonLotModalOpen] = useState(false)
  const [stockPieceLot, setStockPieceLot] = useState(0)
  const [finalStockPieceLot, setFinalStockPieceLot] = useState(0)

  const [quantiteLot, setQuantiteLot] = useState(null)
  const [newStockLot, setNewStockLot] = useState(0)
  const [finalStockLot, setFinalStockLot] = useState(0)
  const [quantiteCartonLot, setQuantiteCartonLot] = useState(0)
  const [selectedLots, setSelectedLots] = useState([])
  const [listeLots, setListeLots] = useState([])
  const [entreeParLotModalOpen, setEntreeParLotModalOpen] = useState(false)
  const [sortieParLotModalOpen, setSortieParLotModalOpen] = useState(false)

  const [optionsLot, setOptionsLot] = useState([])
  const [optionsCartons, setOptionsCartons] = useState([])

  const [servicesUsers, setServicesUsers] = useState([])
  const [serviceUser, setServiceUser] = useState(null)
  const [nomServiceUser, setNomServiceUser] = useState('')
  const [optionsServicesUsers, setOptionsServicesUsers] = useState([])

  const [userList, setUserList] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [nomUser, setNomUser] = useState('')
  const [optionsUsers, setOptionsUsers] = useState([])

  const [motif, setMotif] = useState('')

  const [commentaire, setCommentaire] = useState('')

  const [nomenclaure, setNomenclature] = useState('')

  const [fields, setFields] = useState([])
  const [otherFields, setOtherFields] = useState([])

  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const items_data = await stockData.getAllStock()
        setItems(items_data)
        const options_items = items_data.map((item) => ({
          value: item.id_piece,
          label: item.nom_piece.toUpperCase(),
        }))
        setOptionsItems(options_items)

        const services_data = await userData.getAllServices()
        setServicesUsers(services_data)
        const options_services = services_data.map((item) => ({
          value: item.id,
          label: item.nom_service.toUpperCase()
        }))
        setOptionsServicesUsers(options_services)

        const users_data = await userData.getAllUsers()
        setUserList(users_data)
        const options_users = users_data.map((item) => ({
          value: item.id_user,
          label: item.fullname,
        }))
        setOptionsUsers(options_users)

      } catch (error) {
        console.log(error)
        setErrorForm('Une erreur est survenue lors de la génération du formulaire.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSelectPiece = async (value) => {
    setSelectedPiece(value)
    const piece = items.find((item) => {
      return item.id_piece == value
    })

    const nom = piece ? piece.nom_piece.toUpperCase() : ''
    setNomPiece(nom)

    const itemModels_data = await stockData.getItemModels(value)
    const options_models = itemModels_data.model_piece.map((item) => ({
      value: item.id_model,
      label: item.nom_model.toUpperCase()
    }))
    setOptionsModels(options_models)
    setModels(itemModels_data.model_piece)

    const itemService_data = await stockData.getItemServices(value)
    const options_services = itemService_data.services.map((item) => ({
      value: item.id,
      label: item.nom_service.toUpperCase()
    }))
    setOptionsServicesPieces(options_services)
    setServicesPiece(itemService_data.services)
  }

  const handleSelectModel = (value) => {
    console.log('Selected model value: ', value)
    const model = models.find((item) => {
      return item.id_model == value
    })
    const nomModel = model ? model.nom_model : ''
    setNomModel(nomModel)
    setSelectedModel(value)
  }

  const handleSelectServicePiece = (value) => {
    console.log('Selected service value: ', value)
    const service = servicesPiece.find((item) => {
      return item.id == value
    })
    const nomService = service ? service.nom_service : ''
    setNomServicePiece(nomService)
    setSelectedServicePiece(value)
  }

  useEffect(() => {
    const fetchQuantite = async () => {
      if (!selectedModel || !selectedServicePiece) return // wait until both are chosen
      try {
        const quantite_piece = await stockData.getStockPiece(selectedPiece, selectedModel, selectedServicePiece)
        setQuantitePiece(quantite_piece)
        console.log(quantite_piece)

        const stock_carton_all = await stockData.getCartonPiece(selectedPiece, selectedModel, selectedServicePiece)
        const stock_carton = stock_carton_all.filter((item) => {
          return item.is_deleted == false
        })
        setQuantiteCarton(stock_carton.length)
        const carton_simple = stock_carton.filter((item) => {
          return item.lot_id == null
        })
        const options_carton = carton_simple.map((item) => ({
          value: item.id,
          label: `Carton ${item.numero_carton} - ${item.quantite_totale_piece} pièces`
        }))
        setOptionsCartons(options_carton)
        setListeCartons(stock_carton)

        const stock_lot_all = await stockData.getLotPiece(id, selectedModel, selectedServicePiece)
        const stock_lot = stock_lot_all.filter((item) => {
          return item.is_deleted == false
        })
        setQuantiteLot(stock_lot.length)
        setListeLots(stock_lot)
        const options_lot = stock_lot.map((item) => ({
          value: item.id,
          label: `Lot ${item.numero_lot} - ${item.quantite_carton} cartons - ${item.quantite_piece} pièces`
        }))
        setOptionsLot(options_lot)

      } catch (error) {
        console.log("Error fetching quantity", error)
      }
    }

    fetchQuantite()
  }, [selectedPiece, selectedModel, selectedServicePiece])

  const handleSelectLotCarton = async (id) => {
    setSelectedLot(id)
    const cartons_data_all = await stockData.getCartonLot(id)
    const cartons_data = cartons_data_all.filter((item) => {
      return item.is_deleted == false
    })
    const options_cartons = cartons_data.map((item) => ({
      value: item.id,
      label: `Carton ${item.numero_carton} - ${item.quantite_totale_piece} pièces`
    }))
    setOptionsCartons(options_cartons)

    const lot = listeLots.find((item) => {
      return item.id == id
    })
    const nom = lot ? `Lot ${lot.numero_lot}` : ''
    setNomLot(nom)
    const totalCarton = lot ? lot.quantite_carton_lot : 0
    setQuantiteCartonLot(totalCarton)
    const stockCarton = lot ? lot.quantite_carton : 0
    setStockCartonLot(stockCarton)
    const stockPiece = lot ? lot.quantite_piece : 0
    setStockPieceLot(stockPiece)
  }

  const handleSelectCarton = (value) => {
    setSelectedCarton(value)
    const carton = listeCartons.find((item) => {
      return item.id == value
    })
    const nom = carton ? (carton.lot_id ? `Lot ${carton.numero_lot} - Carton ${carton.numero_carton}` : `Carton ${carton.numero_carton}`) : ('')
    setNomCarton(nom)
    const totalPiece = carton ? carton.quantite_piece_carton : 0
    setQuantitePieceCarton(totalPiece)
    const stock = carton ? carton.quantite_totale_piece : 0
    setStockPieceCarton(stock)
  }

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      { id: Date.now(), titre: "", information: "" }
    ]);
  };

  const handleFieldChange = (id, fieldName, value) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, [fieldName]: value } : f
      )
    );
  };

  const handleRemoveField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <>
      <div className="flex justify-center">
        {loading ? (
          <>
            <span className="text-sm">Loading...</span>
          </>
        ) : (
          <>
            {errorForm ? (
              <>
                <div className="text-error-600 bg-error-300 font-medium flex items-center justify-center rounded-3xl text-sm p-4">
                  {errorForm}
                </div>
              </>
            ) : (
              <>
                <ComponentCard className="md:w-1/2 w-full" title={`Demande`}>
                  <div className="space-y-6">
                    <div className="space-y-5">
                      <div className="text-center">
                        <span className="text-sm font-semibold">Informations générales</span>
                      </div>
                      <div>
                        <Label>Service Demandeur <span className="text-red-700">*</span></Label>
                        <Select
                          options={optionsServicesUsers}
                          placeholder="Choisir une option"
                          onChange={""}
                          className="dark:bg-dark-900"
                        />
                      </div>
                      <div>
                        <Label>Demandeur <span className="text-red-700">*</span></Label>
                        <Select
                          options={optionsUsers}
                          placeholder="Choisir une option"
                          onChange={""}
                          className="dark:bg-dark-900"
                        />
                      </div>
                      <div>
                        <Label>Motif <span className="text-red-700">*</span></Label>
                        <Input
                          type="text"
                          value={motif}
                          onChange={(e) => {
                            const value = e.target.value
                            setMotif(value)
                          }}
                        />
                      </div>
                      <div>
                        <Label>Commentaire</Label>
                        <TextArea
                          type="text"
                          value={commentaire}
                          onChange={(e) => {
                            const value = e.target.value
                            setCommentaire(value)
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="text-center">
                        <span className="text-sm font-semibold">Informations sur pièce</span>
                      </div>
                      <div>
                        <Label>Pièce <span className="text-red-700">*</span></Label>
                        <Select
                          options={optionsItems}
                          placeholder="Choisir une option"
                          onChange={handleSelectPiece}
                          className="dark:bg-dark-900"
                        />
                      </div>
                      <div>
                        <Label>Service <span className="text-red-700">*</span></Label>
                        <Select
                          options={optionsServicesPiece}
                          placeholder="Choisir une option"
                          onChange={handleSelectServicePiece}
                          className="dark:bg-dark-900"
                        />
                      </div>
                      <div>
                        <Label>Modèle <span className="text-red-700">*</span></Label>
                        <Select
                          options={optionsModels}
                          placeholder="Choisir une option"
                          onChange={handleSelectModel}
                          className="dark:bg-dark-900"
                        />
                      </div>
                      <div>
                        <span>Faire une demande  : </span>
                        <div>
                          <div className="flex items-center gap-3 my-2">
                            <Checkbox
                              checked={parLot}
                              onChange={() => {
                                if (parLot) {
                                  setParLot(false)
                                } else {
                                  setParLot(true)
                                  setParCarton(false)
                                  setParCartonLot(false)
                                  setParPiece(false)
                                  setParPieceCarton(false)
                                }
                              }}
                              readOnly
                              label="Par Lot"
                            />
                          </div>
                          <div className="flex items-center gap-3 my-2">
                            <Checkbox
                              checked={parCartonLot}
                              onChange={() => {
                                if (parCartonLot) {
                                  setParCartonLot(false)
                                } else {
                                  setParLot(false)
                                  setParCarton(false)
                                  setParCartonLot(true)
                                  setParPiece(false)
                                  setParPieceCarton(false)
                                }
                              }}
                              readOnly
                              label="Par Carton-Lot"
                            />
                          </div>
                          <div className="flex items-center gap-3 my-2">
                            <Checkbox
                              checked={parPieceCarton}
                              onChange={() => {
                                if (parPieceCarton) {
                                  setParCartonLot(false)
                                } else {
                                  setParLot(false)
                                  setParCarton(false)
                                  setParCartonLot(false)
                                  setParPiece(false)
                                  setParPieceCarton(true)
                                }
                              }}
                              readOnly
                              label="Par Pièce-Carton"
                            />
                          </div>
                          <div className="flex items-center gap-3 my-2">
                            <Checkbox
                              checked={parCarton}
                              onChange={() => {
                                if (parCarton) {
                                  setParCarton(false)
                                } else {
                                  setParLot(false)
                                  setParCarton(true)
                                  setParCartonLot(false)
                                  setParPiece(false)
                                  setParPieceCarton(false)
                                }
                              }}
                              readOnly
                              label="Par Carton"
                            />
                          </div>
                          <div className="flex items-center gap-3 my-2">
                            <Checkbox
                              checked={parPiece}
                              onChange={() => {
                                if (parPiece) {
                                  setParPiece(false)
                                } else {
                                  setParLot(false)
                                  setParCarton(false)
                                  setParCartonLot(false)
                                  setParPiece(true)
                                  setParPieceCarton(false)
                                }
                              }}
                              readOnly
                              label="Par Pièce"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        {parLot ? (
                          <>
                            <div className="">
                              <div className="space-y-5">
                                <div className="py-3 text-center">
                                  <span className="text-sm font-semibold">Demande par lots</span>
                                </div>
                                <div>
                                  <div>
                                    <MultiSelect
                                      value={selectedLots}
                                      options={optionsLot}
                                      display="chip"
                                      optionLabel="label"
                                      maxSelectedLabels={3}
                                      onChange={(e) => setSelectedLots(e.value)}
                                      placeholder="Choisir le(s) lot(s)"
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        {parCartonLot ? (
                          <>
                            <div>
                              <div className="space-y-5">
                                <div className="py-3 text-center">
                                  <span className="text-sm font-semibold">Demande par cartons-lot</span>
                                </div>
                                <div className="space-y-5">
                                  <div>
                                    <Label>Choisir le lot</Label>
                                    <Select
                                      options={optionsLot}
                                      placeholder="Choisir une option"
                                      className="dark:bg-dark-900"
                                      onChange={handleSelectLotCarton}
                                    />
                                  </div>
                                  {selectedLot ? (
                                    <>
                                      <div>
                                        <MultiSelect
                                          value={selectedCartons}
                                          options={optionsCartons}
                                          display="chip"
                                          optionLabel="label"
                                          maxSelectedLabels={4}
                                          onChange={(e) => setSelectedCartons(e.value)}
                                          placeholder="Choisir le(s) carton(s)"
                                          className="w-full"
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        {parPieceCarton ? (
                          <>
                            <div className="space-y-5">
                              <div>
                                <div className="py-3 text-center">
                                  <span className="text-sm font-semibold">Demande par pièce-carton</span>
                                </div>
                                <div className="space-y-5">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label>Choisir le lot</Label>
                                      <Select
                                        options={optionsLot}
                                        placeholder="Choisir une option"
                                        className="dark:bg-dark-900"
                                        onChange={handleSelectLotCarton}
                                      />
                                    </div>
                                    <div>
                                      <Label>Choisir le carton</Label>
                                      <Select
                                        options={optionsCartons}
                                        placeholder="Choisir une option"
                                        className="dark:bg-dark-900"
                                        onChange={handleSelectCarton}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Quantité pièce</Label>
                                    <Input type="number" id="input" value={newStockPiece}
                                      onChange={(e) => {
                                        const value = Number(e.target.value)
                                        if (value >= 0) {
                                          setNewStockPiece(value)
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        {parCarton ? (
                          <>
                            <div className="">
                              <div className="space-y-5">
                                <div className="text-center">
                                  <span className="text-sm font-semibold">Demande par cartons</span>
                                </div>
                                <div>
                                  <MultiSelect
                                    value={selectedCartons}
                                    options={optionsCartons}
                                    display="chip"
                                    optionLabel="label"
                                    maxSelectedLabels={3}
                                    onChange={(e) => setSelectedCartons(e.value)}
                                    placeholder="Choisir le(s) carton(s)"
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                        {parPiece ? (
                          <>
                            <div className="space-y-5">
                              <div>
                                <div className="py-3 text-center">
                                  <span className="text-sm font-semibold">Demande par pièce</span>
                                </div>
                                <div>
                                  <Label>Quantité</Label>
                                  <Input type="number" id="input" value={newStockPiece}
                                    onChange={(e) => {
                                      const value = Number(e.target.value)
                                      if (value >= 0) {
                                        setNewStockPiece(value)
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div>
                        <Label>Nomenclature</Label>
                        <Input
                          type="text"
                          value={nomenclaure}
                          onChange={(e) => {
                            const value = e.target.value
                            setNomenclature(value)
                          }}
                        />
                      </div>
                      <div>
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex justify-center items-center relative mb-2 rounded"
                          >
                            {/* Remove button */}
                            <div className="absolute right-0 top-0">
                              <button
                                type="button"
                                onClick={() => handleRemoveField(field.id)}
                                className="text-red-500"
                              >
                                <i className="pi pi-times"></i>
                              </button>
                            </div>

                            {/* First input */}
                            <div className="me-1">
                              <Label htmlFor={`titre-${field.id}`}>
                                Titre champ {index + 1}
                              </Label>
                              <Input
                                type="text"
                                id={`titre-${field.id}`}
                                value={field.titre}
                                onChange={(e) =>
                                  handleFieldChange(field.id, "titre", e.target.value)
                                }
                                className="border rounded px-2 py-1"
                              />
                            </div>

                            {/* Second input */}
                            <div className="ms-1">
                              <Label htmlFor={`info-${field.id}`}>Information</Label>
                              <Input
                                type="text"
                                id={`info-${field.id}`}
                                value={field.information}
                                onChange={(e) =>
                                  handleFieldChange(field.id, "information", e.target.value)
                                }
                                className="border rounded px-2 py-1"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={handleAddField}
                        >
                          <span className="text-xs text-gray-500 font-medium"> <span className="underline">Ajouter un champ </span><span className="text-xl">+</span></span>
                        </button>
                      </div>
                    </div>
                    {parLot ? (
                      <>
                        <div className="text-center">
                          {loadingValidation ? (
                            <>
                              <div>
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" animationDuration=".5s" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-full flex justify-center items-center">
                                <button className="w-1/2 flex items-center justify-between bg-green-400 p-2 rounded-2xl"
                                  onClick={handleEntreeParCarton}
                                >
                                  <span>Entrée</span>
                                  <i className="pi pi-arrow-circle-down"></i>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) :(
                      <></>
                    )}
                    <div>
                      <span className="text-error-600 font-medium flex items-center justify-center text-sm">
                        {error}
                      </span>
                    </div>
                    <div className="text-right text-gray-500">
                      <span className="text-xs font-medium">
                        Les champs suivis par un <span className="text-red-700">*</span> sont obligatoires
                      </span>
                    </div>
                  </div>
                </ComponentCard>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}