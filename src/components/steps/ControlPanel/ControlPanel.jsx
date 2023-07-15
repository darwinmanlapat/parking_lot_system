import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./ControlPanel.scss";

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

    useEffect(() => props.setActiveStep(activeStep), []);

    return (
        <div className="control-panel">
            <h1>Parking Lot System Control Panel</h1>

            {/* <div className="step-nav-buttons">
                <button onClick={() => previousStep()}>Previous</button>
                <button onClick={() => nextStep()}>Next</button>
            </div> */}
        </div>
    );
}

export default ControlPanel;