import { useState } from "react";
import { useWizard } from "react-use-wizard";

import "./SetParkingSlotSizes.scss";
import ParkingMap from "../common/ParkingMap/ParkingMap";

const SetParkingSlotSizes = (props) => {
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

    const handleCellClick = (rowIndex, columnIndex) => {
    };

    return (
        <div className="set-parking-slot-sizes">
            <h1>Set the parking slot sizes</h1>
            
            <ParkingMap step={activeStep} parkingMap={props.parkingMap} handleCellClick={handleCellClick} />

            <div className="step-nav-buttons">
                <button onClick={() => previousStep()}>Previous</button>
                <button onClick={() => nextStep()}>Next</button>
            </div>
        </div>
    );
}

export default SetParkingSlotSizes;