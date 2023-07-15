import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./SetEntryPoints.scss";

const SetEntryPoints = (props) => {
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
        <div className="set-entry-points">
            <h1>Select the entry points of the parking lot</h1>

            <div className="entry-point-list">
                {
                    props.entryPoints.map((entryPoint, cellIndex) => (
                        <div key={"entry-point-cell" + cellIndex}>Entry Point # {cellIndex + 1}: ({entryPoint.rowIndex}, {entryPoint.columnIndex})</div>
                    ))
                }
            </div>

            <div className="step-nav-buttons">
                <button onClick={() => previousStep()}>Previous</button>
                <button onClick={() => nextStep()}>Next</button>
            </div>
        </div>
    );
}

export default SetEntryPoints;