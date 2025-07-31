import LivraisonsToday from "../../components/dashboards/livraisons/LivraisonsToday"
import LivraisonsWeeks from "../../components/dashboards/livraisons/LivraisonsWeeks"

export default function DonneeGenerales() {


    return (    
        <>
            <div className="mb-6">
                <LivraisonsToday />
            </div>
            <div>
                <LivraisonsWeeks />
            </div>

        </>
    )
}