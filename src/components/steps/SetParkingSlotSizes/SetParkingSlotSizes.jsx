import { useWizard } from "react-use-wizard";
import "./SetParkingSlotSizes.scss";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import { useEffect, useState } from "react";
import ParkingSlot from "../../../lib/ParkingSlot";

const SetParkingSlotSizes = (props) => {
    const { activeStep, previousStep, nextStep } = useWizard();
    const [ parkingSlot, setParkingSLot ] = useState(null);

    useEffect(() => setParkingSLot(new ParkingSlot(props.parkingSlotSizes)), [props.parkingSlotSizes]);
    
    const handleParkingSlotSizeChange = (rowIndex, columnIndex, cellValue) => {
        props.setParkingSlotSizes(parkingSlot.updateSizes(rowIndex, columnIndex, cellValue));
    }

    return (
        <div className="set-parking-slot-sizes">
            <div className="row">
                <h2>Set the parking slot sizes</h2>

                <div className="col-8">
                    <ParkingMap
                        step={activeStep}
                        config={props.parkingMapConfig}
                        entryPoints={props.entryPoints}
                        handleParkingSlotSizeChange={handleParkingSlotSizeChange}
                    />
                </div>

                <div className="col-4">
                    <div className="step-nav-buttons">
                        <button onClick={() => previousStep()}>Previous</button>
                        <button onClick={() => nextStep()}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetParkingSlotSizes;