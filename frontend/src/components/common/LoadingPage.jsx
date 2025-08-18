import { useState } from "react"
import { ProgressSpinner } from "primereact/progressspinner"

export default function LoadingPage() {
    const [loading, setLoading] = useState(true)
    return(
        <>
            <div className="bg-white z-999999 w-full h-screen flex justify-center items-center absolute top-0 right-0">
                <div className="flex flex-col justify-center items-center">
                    <img src="./images/logo/greenpay.jpeg" alt="" className="w-40"/>
                    {loading ? (
                        <ProgressSpinner style={{width: '50px', height: '50px'}} />
                    ) : (<></>)}
                </div>
            </div>
        </>
    )
}