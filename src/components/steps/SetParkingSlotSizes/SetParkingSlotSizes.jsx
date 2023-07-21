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
                <div className="col-6">
                    <ParkingMap
                        step={activeStep}
                        config={props.parkingMapConfig}
                        entryPoints={props.entryPoints}
                        handleParkingSlotSizeChange={handleParkingSlotSizeChange}
                    />
                </div>

                <div className="col-6 input-col">
                    <h5 data-cy="section-title">Set the parking slot sizes</h5>

                    <div>Please set the parking slot sizes on the table.</div>

                    <div className="row col-11 step-nav-buttons">
                        <div className="col">
                            <button
                                data-cy="set-parking-slot-sizes-prev-button"
                                className="btn btn-primary prev-button"
                                onClick={() => previousStep()}
                            >Previous</button>
                        </div>

                        <div className="col">
                            <button
                                data-cy="set-parking-slot-sizes-next-button"
                                className="btn btn-success next-button"
                                onClick={() => nextStep()}
                            >Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetParkingSlotSizes;