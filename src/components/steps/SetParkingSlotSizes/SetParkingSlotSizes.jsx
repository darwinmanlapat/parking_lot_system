import { useWizard } from "react-use-wizard";
import "./SetParkingSlotSizes.scss";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import { useEffect, useState } from "react";
import ParkingSlot from "../../../lib/ParkingSlot";

const SetParkingSlotSizes = (props) => {
    const { activeStep, previousStep, nextStep } = useWizard();
    const [parkingSlot, setParkingSlot] = useState(null);

    useEffect(() => setParkingSlot(new ParkingSlot(props.parkingSlotSizes)), [props.parkingSlotSizes]);

    const handleParkingSlotSizeChange = (rowIndex, columnIndex, cellValue) => {
        props.setParkingSlotSizes(parkingSlot.updateSizes(rowIndex, columnIndex, cellValue));
    }

    return (
        <div className="set-parking-slot-sizes">
            <div className="row">
                <div className="col-8">
                    <ParkingMap
                        step={activeStep}
                        config={props.parkingMapConfig}
                        entryPoints={props.entryPoints}
                        handleParkingSlotSizeChange={handleParkingSlotSizeChange}
                    />
                </div>

                <div className="col-4 input-col">
                    <h5>Set the parking slot sizes</h5>

                    <div className="row col-11 step-nav-buttons">
                        <div className="col">
                            <button className="btn btn-primary prev-button" onClick={() => previousStep()}>Previous</button>
                        </div>

                        <div className="col">
                            <button className="btn btn-success next-button" onClick={() => nextStep()}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetParkingSlotSizes;