import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./SetEntryPoints.scss";
import ParkingMap from "../../common/ParkingMap/ParkingMap";

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

    const handleCellClick = (rowIndex, columnIndex) => {
        // Check if the cell is an outer cell
        const isOuterCell = rowIndex === 0 || rowIndex === props.parkingMapConfig.tableSize - 1 || columnIndex === 0 || columnIndex === props.parkingMapConfig.tableSize - 1;

        if (isOuterCell) {
            const cell = { rowIndex, columnIndex };

            const isEntryPointCell = props.entryPoints.some(
                clickedCell => clickedCell.rowIndex === rowIndex && clickedCell.columnIndex === columnIndex
            );

            // Check if a cell is clicked so we can toggle it.
            if (isEntryPointCell) {
                props.setEntryPoints(props.entryPoints.filter(clickedCell => !(clickedCell.rowIndex === rowIndex && clickedCell.columnIndex === columnIndex)));
            } else {
                // If the is cell is not yet clicked, we should check if have the desired amount of entry points
                if (props.entryPoints.length < props.parkingMapConfig.numEntryPoints) {
                    props.setEntryPoints([...props.entryPoints, cell]);
                }
            }
        }
    }

    return (
        <div className="set-entry-points">
            <div className="row">
                <h2>Select the entry points of the parking lot</h2>

                <div className="col-8">
                    <ParkingMap config={props.parkingMapConfig} step={activeStep} handleCellClick={handleCellClick} entryPoints={props.entryPoints} />
                </div>

                <div className="col-4">
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
            </div>
        </div>
    );
}

export default SetEntryPoints;