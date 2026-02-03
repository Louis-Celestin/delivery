<>
// DemandeInputs.jsx : code pour checkbox types de demande

    <div>
        {hasLot ? (
            <>
                <div className="flex items-center gap-3 my-2">
                    {/* Demande par lot */}
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
                    {/* Par carton lot */}
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
                        label="Par Carton"
                    />
                </div>
            </>
        ) : (
            <></>
        )}
        {hasCarton || hasLot ? (
            <>
                <div className="flex items-center gap-3 my-2">
                    {/* Par piece carton */}
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
                        label="Par Pièce"
                    />
                </div>
            </>
        ) : (
            <></>
        )}
        {hasCarton && !hasLot ? (
            <>
                <div className="flex items-center gap-3 my-2">
                    {/* Par carton */}
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
            </>
        ) : (
            <></>
        )}
        {(!hasCarton && !hasLot) ? (
            <>
                <div className="flex items-center gap-3 my-2">
                    {/* Par piece */}
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
            </>
        ) : (
            <></>
        )}
    </div>

// Différents champs pour les différents types de demande
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
// Modals pour confirmation de demandes par types
    <div>
        {/* DEMANDE PAR LOT */}
        <Modal isOpen={sortieParLotModalOpen} onClose={() => setSortieParLotModalOpen(false)} className="p-4 max-w-md">
            <div className="space-y-5">
                <div className="w-full text-center">
                    <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Sortie stock</span>
                </div>
                <div className="text-center flex flex-col">
                    <span className="font-bold text-sm">
                        {nomStock}
                    </span>
                    <span>
                        <span className="text-sm text-gray-800 font-medium">{nomPiece} </span>
                        -
                        <span className="font-semibold"> {nomModel}</span> |
                        <span className="font-medium text-gray-700"> {nomServicePiece}</span>
                    </span>
                </div>
                <div className="ms-5 text-center">
                    <span className="text-sm text-gray-800 underline">Motif: {motif}</span>
                </div>
                <div className="space-y-2">
                    <div className="space-y-1 ms-5 border-b pb-2 text-sm">
                        <div>
                            <span>Quantité lot initiale : {quantiteLot ? quantiteLot : '0'}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-red-600 font-bold">-{selectedLots.length}</span></span>
                        </div>
                        <div>
                            <span>Stock final lot : {finalStockLot}</span>
                        </div>
                    </div>
                    <div className="space-y-1 ms-5 border-b pb-2 text-sm">
                        <div>
                            <span>Quantité carton initiale : {quantiteCarton ? quantiteCarton : '0'}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-red-600 font-bold">-{newStockCarton}</span></span>
                        </div>
                        <div>
                            <span>Stock final carton : {finalStockCarton}</span>
                        </div>
                    </div>
                    <div className="space-y-1 ms-5 text-sm">
                        <div>
                            <span>Quantité pièce initiale : {quantitePiece ? quantitePiece : '0'}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-red-600 font-bold">-{newStockPiece}</span></span>
                        </div>
                        <div>
                            <span>Stock final pièce : {finalStockPiece}</span>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6 flex justify-center items-center'>
                    <button
                        onClick={handleValidate}
                        className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                        Valider
                    </button>
                </div>
            </div>
        </Modal>
        {/* DEMANDE PAR CARTON LOT */}
        <Modal isOpen={sortieParCartonLotModalOpen} onClose={() => setSortieParCartonLotModalOpen(false)} className="p-4 max-w-md">
            <div className="space-y-5">
                <div className="w-full text-center">
                    <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Sortie stock</span>
                </div>
                <div className="text-center flex flex-col">
                    <span className="font-bold text-sm">
                        {nomStock}
                    </span>
                    <span>
                        <span className="text-sm text-gray-800 font-medium">{nomPiece} </span>
                        -
                        <span className="font-semibold"> {nomModel}</span> |
                        <span className="font-medium text-gray-700"> {nomServicePiece}</span>
                    </span>
                </div>
                <div className="ms-5 text-center">
                    <span className="text-sm text-gray-800 underline">Motif: {motif}</span>
                </div>
                <div className="space-y-2">
                    <div className="space-y-1 ms-5 border-b pb-2 text-sm">
                        <div>
                            <span>Lot sélectionné : {nomLot}</span>
                        </div>
                        <div>
                            <span>Quantité initiale : {stockCartonLot}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-red-600 font-bold">-{newStockCarton}</span></span>
                        </div>
                        <div>
                            <span>Stock final : {finalStockCartonLot}</span>
                        </div>
                    </div>
                    <div className="space-y-1 ms-5 border-b pb-2 text-sm">
                        <div>
                            <span>Quantité carton initiale : {quantiteCarton ? quantiteCarton : '0'}</span>
                        </div>
                        <div>
                            <span>Stock final carton : {finalStockCarton}</span>
                        </div>
                    </div>
                    <div className="space-y-1 ms-5 text-sm">
                        <div>
                            <span>Quantité pièce initiale : {quantitePiece ? quantitePiece : '0'}</span>
                        </div>
                        <div>
                            <span>Stock final pièce : {finalStockPiece}</span>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6 flex justify-center items-center'>
                    <button
                        onClick={handleValidate}
                        className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                        Valider
                    </button>
                </div>
            </div>
        </Modal>
        {/* DEMANDE PAR PIECE CARTON */}
        <Modal isOpen={sortieParPieceCartonModalOpen} onClose={() => setSortieParPieceCartonModalOpen(false)} className="p-4 max-w-md">
            <div className="space-y-5">
                <div className="w-full text-center">
                    <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Sortie stock</span>
                </div>
                <div className="text-center flex flex-col">
                    <span className="font-bold text-sm">
                        {nomStock}
                    </span>
                    <span>
                        <span className="text-sm text-gray-800 font-medium">{nomPiece} </span>
                        -
                        <span className="font-semibold"> {nomModel}</span> |
                        <span className="font-medium text-gray-700"> {nomServicePiece}</span>
                    </span>
                </div>
                <div className="ms-5 text-center">
                    <span className="text-sm text-gray-800 underline">Motif: {motif}</span>
                </div>
                <div className="space-y-2">
                    <div className="space-y-1 ms-5 border-b pb-2 text-sm">
                        <div>
                            <span>Carton sélectionné : {nomCarton}</span>
                        </div>
                        <div>
                            <span>Quantité initiale : {stockPieceCarton}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-red-600 font-bold">-{newStockPiece}</span></span>
                        </div>
                        <div>
                            <span>Stock final : {finalStockPieceCarton}</span>
                        </div>
                    </div>
                    <div className="space-y-1 ms-5 text-sm">
                        <div>
                            <span>Quantité pièce initiale : {quantitePiece ? quantitePiece : '0'}</span>
                        </div>
                        <div>
                            <span>Stock final pièce : {finalStockPiece}</span>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6 flex justify-center items-center'>
                    <button
                        onClick={handleValidate}
                        className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                        Valider
                    </button>
                </div>
            </div>
        </Modal>
        {/* DEMANDE PAR CARTON */}
        <Modal isOpen={sortieParCartonModalOpen} onClose={() => setSortieParCartonModalOpen(false)} className="p-4 max-w-md">
            <div className="space-y-5">
                <div className="w-full text-center">
                    <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Sortie stock</span>
                </div>
                <div className="text-center flex flex-col">
                    <span className="font-bold text-sm">
                        {nomStock}
                    </span>
                    <span>
                        <span className="text-sm text-gray-800 font-medium">{nomPiece} </span>
                        -
                        <span className="font-semibold"> {nomModel}</span> |
                        <span className="font-medium text-gray-700"> {nomServicePiece}</span>
                    </span>
                </div>
                <div className="ms-5 text-center">
                    <span className="text-sm text-gray-800 underline">Motif: {motif}</span>
                </div>
                <div className="space-y-2">
                    <div className="space-y-1 ms-5 border-b pb-2 text-sm">
                        <div>
                            <span>Quantité carton initiale : {quantiteCarton ? quantiteCarton : '0'}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-red-600 font-bold">-{selectedCartons.length}</span></span>
                        </div>
                        <div>
                            <span>Stock final carton : {finalStockCarton}</span>
                        </div>
                    </div>
                    <div className="space-y-1 ms-5 text-sm">
                        <div>
                            <span>Quantité pièce initiale : {quantitePiece ? quantitePiece : '0'}</span>
                        </div>
                        <div>
                            <span>Mouvement : <span className="text-red-600 font-bold">-{newStockPiece}</span></span>
                        </div>
                        <div>
                            <span>Stock final pièce : {finalStockPiece}</span>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6 flex justify-center items-center'>
                    <button
                        onClick={handleValidate}
                        className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                        Valider
                    </button>
                </div>
            </div>
        </Modal>
        {/* DEMANDE PAR PIECE */}
        <Modal isOpen={sortieParPieceModalOpen} onClose={() => setSortieParPieceModalOpen(false)} className="p-4 max-w-md">
            <div className="space-y-5">
                <div className="w-full text-center">
                    <span className="p-3 rounded bg-blue-200 text-blue-500 font-medium">Demande</span>
                </div>
                <div className="text-center flex flex-col">
                    <span className="font-bold text-sm">
                        {nomStock}
                    </span>
                    <span>
                        <span className="text-sm text-gray-800 font-medium">{nomPiece} </span>
                        -
                        <span className="font-semibold"> {nomModel}</span> |
                        <span className="font-medium text-gray-700"> {nomServicePiece}</span>
                    </span>
                </div>
                <div className="ms-5 text-center">
                    <span className="text-sm text-gray-800 underline">Motif: {motif}</span>
                </div>
                <div className="space-y-1 ms-5">
                    <div>
                        <span>Quantité initiale : {quantitePiece ? quantitePiece : '0'}</span>
                    </div>
                    <div>
                        <span>Demande : <span className="text-red-600 font-bold">-{newStockPiece}</span></span>
                    </div>
                    <div>
                        <span>Stock final : {finalStockPiece}</span>
                    </div>
                </div>
                <div className='w-full mt-6 flex justify-center items-center'>
                    <button
                        onClick={handleValidate}
                        className='w-1/4 mx-3 bg-green-400 rounded-2xl h-10 flex justify-center items-center'>
                        Valider
                    </button>
                </div>
            </div>
        </Modal>
    </div>
</>
