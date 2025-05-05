import 'primeicons/primeicons.css';
import DatePicker from '../form/date-picker';
import { ListIcon, BaseLinePhoneIcon, CableDataIcon, PhoneSetting } from '../../icons';

import Switch from "../form/switch/Switch"

export default function DeliveriesFilter({ onFilterSelect }) {

    const handleClick = (typeId) => {
        onFilterSelect(typeId);
    };
    const handleSwitchChange = (checked) => {
        console.log("Switch is now:", checked ? "ON" : "OFF");
    };


    return(
        <>
            <div className="border rounded-3xl flex flex-col p-4 bg-white">
                <div className='flex items-center'>
                    <div className='border-r pr-3 mr-3'>
                        <i className="pi pi-filter-fill"></i>
                    </div>
                    <div className='grid grid-cols-5 gap-2.5'>
                        <div onClick={() => handleClick(1)} className="border py-1 px-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-600 cursor-pointer">
                            <span className='text-sm font-medium'>TPE GIM</span>
                            <span className="p-1.5 border rounded-sm bg-cyan-700 text-white text-3xl"><BaseLinePhoneIcon /></span>
                            <span className='font-light text-sm'>Formulaires</span>
                            
                        </div>
                        <div onClick={() => handleClick(4)} className="border py-1 px-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-600 cursor-pointer">
                            <span className='text-sm font-medium'>TPE MOBILE</span>
                            <span className="p-1.5 border rounded-sm bg-orange-300 text-white text-3xl"><BaseLinePhoneIcon /></span>
                            <span className='font-light text-sm'>Formulaires</span>
                            
                        </div>
                        <div onClick={() => handleClick(3)} className="border py-1 px-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-600 cursor-pointer">
                            <span className='text-sm font-medium'>TPE MAJ</span>
                            <span className="p-1.5 border rounded-sm bg-emerald-700 text-white text-3xl"><BaseLinePhoneIcon /></span>
                            <span className='font-light text-sm'>Formulaires</span>
                            
                        </div>
                        <div onClick={() => handleClick(2)} className="border py-1 px-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-600 cursor-pointer">
                            <span className='text-sm font-medium'>TPE REPARE</span>
                            <span className="p-1.5 border rounded-sm bg-error-500 text-white text-3xl"><PhoneSetting /></span>
                            <span className='font-light text-sm'>Formulaires</span>
                            
                        </div>
                        <div onClick={() => handleClick(5)} className="border py-1 px-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-600 cursor-pointer">
                            <span className='text-sm font-medium'>CHARGEUR</span>
                            <span className="p-1.5 border rounded-sm bg-slate-500 text-white text-3xl"><CableDataIcon /></span>
                            <span className='font-light text-sm'>Formulaires</span>
                            
                        </div>
                    </div>
                    {/* <div className='ml-2.5 flex flex-col'>
                        <div className='my-1.5'>
                            <DatePicker
                                id="date-picker"
                                label="Date Livraison"
                                placeholder="Select a date"
                                onChange={(dates, currentDateString) => {
                                // Handle your logic
                                    console.log({ dates, currentDateString });
                                }}
                              />
                        </div>
                        <div className='my-1.5'>
                            <DatePicker
                                id="date-picker"
                                label="Date Cloture"
                                placeholder="Select a date"
                                onChange={(dates, currentDateString) => {
                                // Handle your logic
                                    console.log({ dates, currentDateString });
                                }}
                            />
                        </div>
                    </div> */}
                </div>
                {/* <div className='mt-6 flex justify-center'>
                    <div className='flex gap-4'>
                        <Switch
                            label="En cours"
                            defaultChecked={true}
                            onChange={handleSwitchChange}
                            color="orange"
                            />
                        <Switch
                            label="Livré"
                            defaultChecked={true}
                            onChange={handleSwitchChange}
                            color="blue"
                            />
                    </div>
                    <div>
                    </div>
                </div> */}
            </div>
        </>
    )
}