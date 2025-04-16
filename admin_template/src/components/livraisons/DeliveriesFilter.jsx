import 'primeicons/primeicons.css';
import DatePicker from '../form/date-picker';
import { ListIcon, BaseLinePhoneIcon, CableDataIcon, PhoneSetting } from '../../icons';


export default function DeliveriesFilter() {
    return(
        <>
            <div className="border rounded-3xl flex items-center p-4 bg-white">
                <div className='border-r pr-3 mr-3'>
                    <i className="pi pi-filter-fill"></i>
                </div>
                <div className='grid grid-cols-5 gap-2.5'>
                    <div className="border py-1 px-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-600 cursor-pointer">
                        <span className='text-sm font-medium'>TPE GIM</span>
                        <span className="p-1.5 border rounded-sm bg-cyan-700 text-white text-3xl"><BaseLinePhoneIcon /></span>
                        <span className='font-light text-sm'>Formulaires</span>
                        <span>20</span>
                    </div>
                    <div className="border py-1 px-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-600 cursor-pointer">
                        <span className='text-sm font-medium'>TPE MOBILE</span>
                        <span className="p-1.5 border rounded-sm bg-orange-300 text-white text-3xl"><BaseLinePhoneIcon /></span>
                        <span className='font-light text-sm'>Formulaires</span>
                        <span>20</span>
                    </div>
                    <div className="border py-1 px-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-600 cursor-pointer">
                        <span className='text-sm font-medium'>TPE MAJ</span>
                        <span className="p-1.5 border rounded-sm bg-emerald-700 text-white text-3xl"><BaseLinePhoneIcon /></span>
                        <span className='font-light text-sm'>Formulaires</span>
                        <span>20</span>
                    </div>
                    <div className="border py-1 px-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-600 cursor-pointer">
                        <span className='text-sm font-medium'>TPE REPARE</span>
                        <span className="p-1.5 border rounded-sm bg-error-500 text-white text-3xl"><PhoneSetting /></span>
                        <span className='font-light text-sm'>Formulaires</span>
                        <span>20</span>
                    </div>
                    <div className="border py-1 px-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-600 cursor-pointer">
                        <span className='text-sm font-medium'>CHARGEUR</span>
                        <span className="p-1.5 border rounded-sm bg-slate-500 text-white text-3xl"><CableDataIcon /></span>
                        <span className='font-light text-sm'>Formulaires</span>
                        <span>20</span>
                    </div>
                </div>
                <div className='ml-2.5'>
                    <DatePicker />
                </div>
            </div>
        </>
    )
}