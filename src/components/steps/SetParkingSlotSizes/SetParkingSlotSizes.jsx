import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./SetParkingSlotSizes.scss";
import ParkingMap from "../../common/ParkingMap/ParkingMap";

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

    return (
        <div className="set-parking-slot-sizes">
            <h1>Set the parking slot sizes</h1>

            <div className="step-nav-buttons">
                <button onClick={() => previousStep()}>Previous</button>
                <button onClick={() => nextStep()}>Next</button>
            </div>

            <ParkingMap parkingMap={props.parkingMap} step={activeStep} handleParkingSlotSizeChange={props.updateParkingMap} />
        </div>
    );
}

export default SetParkingSlotSizes;