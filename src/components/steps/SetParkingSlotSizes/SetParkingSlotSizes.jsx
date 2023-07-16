import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./SetParkingSlotSizes.scss";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import { SizeEnum } from "../../../enums/Sizes";

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

    const handleParkingSlotSizeChange = (rowIndex, columnIndex, cellValue) => {
        props.updateParkingMap(rowIndex, columnIndex, cellValue);

        const { [SizeEnum.SMALL]: small, [SizeEnum.MEDIUM]: medium, [SizeEnum.LARGE]: large } = props.parkingSlotSizes;

        const previousSize = small.some(slot => slot.rowIndex === rowIndex && slot.columnIndex === columnIndex)
            ? SizeEnum.SMALL
            : medium.some(slot => slot.rowIndex === rowIndex && slot.columnIndex === columnIndex)
                ? SizeEnum.MEDIUM
                : SizeEnum.LARGE;

        const updatedSizes = { ...props.parkingSlotSizes };

        updatedSizes[previousSize] = updatedSizes[previousSize].filter(coord => coord.rowIndex !== rowIndex || coord.columnIndex !== columnIndex)

        // Add the coordinate to the new size
        updatedSizes[cellValue] = [...updatedSizes[cellValue], { rowIndex, columnIndex }];

        props.setParkingSlotSizes(updatedSizes)
    }

    return (
        <div className="set-parking-slot-sizes">
            <h1>Set the parking slot sizes</h1>

            <div className="step-nav-buttons">
                <button onClick={() => previousStep()}>Previous</button>
                <button onClick={() => nextStep()}>Next</button>
            </div>

            <ParkingMap parkingMap={props.parkingMap} step={activeStep} entryPoints={props.entryPoints} handleParkingSlotSizeChange={handleParkingSlotSizeChange} />
        </div>
    );
}

export default SetParkingSlotSizes;