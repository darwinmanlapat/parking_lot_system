import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./ControlPanel.scss";
import ParkingLot from "../../../lib/ParkingLot";

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

    useEffect(() => {
        props.setActiveStep(activeStep);
    }, []);

    const parkVehicle = () => {

    }

    return (
        <div className="control-panel">
            <h1>Parking Lot System Control Panel</h1>

            <div className="park-vehicle">
                <h3>Vehicle Details</h3>
                <div>
                    <label for="vehicle-size">Vehicle Size</label>
                    <select id="vehicle-size">
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                    </select>
                </div>
                <div>
                    <label for="time-in">Time-in</label>
                    <input id="time-in" type="datetime-local" />
                </div>
                <button onClick={() => parkVehicle()}>Park Vehicle</button>
            </div>

            <div className="step-nav-buttons">
                <button onClick={() => previousStep()}>Previous</button>
            </div>
        </div>
    );
}

export default ControlPanel;