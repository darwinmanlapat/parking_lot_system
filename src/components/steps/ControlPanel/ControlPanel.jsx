import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./ControlPanel.scss";
import ParkingLot from "../../../lib/ParkingLot";
import ParkingMap from "../../common/ParkingMap/ParkingMap";

const ControlPanel = (props) => {
    const {
        isLoading,
        isLastStep,
        isFirstStep,
        activeStep,
        stepCount,
        previousStep,
        nextStep,
        goToStep,
        handleStep,
    } = useWizard();

    const [selectedEntryPoint, setSelectedEntryPoint] = useState(null);

    const handleCellClick = () => {

    }

    const parkVehicle = () => {

    }

    return (
        <div className="control-panel">
            <h1>Parking Lot System Control Panel</h1>

            {
                selectedEntryPoint ?
                    <div className="park-vehicle">
                        <h3>Vehicle Details</h3>
                        <div>
                            <label htmlFor="vehicle-size">Vehicle Size</label>
                            <select id="vehicle-size">
                                <option>S</option>
                                <option>M</option>
                                <option>L</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="time-in">Time-in</label>
                            <input id="time-in" type="datetime-local" />
                        </div>
                        <button onClick={() => parkVehicle()}>Park Vehicle</button>
                    </div> : null
            }

            <div className="step-nav-buttons">
                <button onClick={() => previousStep()}>Previous</button>
            </div>

            <ParkingMap parkingMap={props.parkingMap} step={activeStep} handleCellClick={handleCellClick} />
        </div>
    );
}

export default ControlPanel;