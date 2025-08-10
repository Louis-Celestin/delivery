import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DefaultInputs from "../../../components/form/form-elements/DefaultInputs";
import InputGroup from "../../../components/form/form-elements/InputGroup";
import DropzoneComponent from "../../../components/form/form-elements/DropZone";
import CheckboxComponents from "../../../components/form/form-elements/CheckboxComponents";
import RadioButtons from "../../../components/form/form-elements/RadioButtons";
import ToggleSwitch from "../../../components/form/form-elements/ToggleSwitch";
import FileInputExample from "../../../components/form/form-elements/FileInputExample";
import SelectInputs from "../../../components/form/form-elements/SelectInputs";
import TextAreaInput from "../../../components/form/form-elements/TextAreaInput";
import InputStates from "../../../components/form/form-elements/InputStates";
import PageMeta from "../../../components/common/PageMeta";

import LivraisonInputs from "../../../components/form/livraisons/LivraisonInputs";
import TerminalOrdersTable from "../../../components/tables/BasicTables/TerminalOrdersTable";

export default function LivraisonForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Livraison" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <LivraisonInputs />
              </div>
            </div>
          </div>  
        </div>
    )
}