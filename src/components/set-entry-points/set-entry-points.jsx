import { useState } from "react";
import { useWizard } from "react-use-wizard";

import "./set-entry-points.scss";

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
    const [entryPoints, setEntryPoints] = useState([]);
    const [clickedCells, setClickedCells] = useState([]);

    const handleCellClick = (rowIndex, columnIndex) => {
        const cell = { rowIndex, columnIndex };
        const isCellClicked = clickedCells.some(
            clickedCell => clickedCell.rowIndex === rowIndex && clickedCell.columnIndex === columnIndex
        );

        // Check if a cell is clicked so we can toggle it.
        if (isCellClicked) {
            setClickedCells(clickedCells.filter(clickedCell => !(clickedCell.rowIndex === rowIndex && clickedCell.columnIndex === columnIndex)));
        } else {
            // If the is cell is not yet clicked, we should check if have the desired amount of entry points
            if (clickedCells.length < props.numEntryPoints) {
                setClickedCells([...clickedCells, cell]);
            }
        }
    };

    return (
        <div className="set-entry-points">
            <h1>Select the entry points of the parking lot</h1>
            <table border={1} width={100}>
                <tbody>
                    {props.parkingMap.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((slotType, columnIndex) => {
                                const isCellClicked = clickedCells.some(
                                    clickedCell => clickedCell.rowIndex === rowIndex && clickedCell.columnIndex === columnIndex
                                );

                                return (
                                    <td
                                        key={columnIndex}
                                        className={isCellClicked ? 'clicked' : ''}
                                        onClick={() => handleCellClick(rowIndex, columnIndex)}
                                    >
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SetEntryPoints;