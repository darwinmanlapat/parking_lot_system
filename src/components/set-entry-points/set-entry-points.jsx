import { useState } from "react";
import { useWizard } from "react-use-wizard";

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
    const [ entryPoints, setEntryPoints ] = useState([]);

    const handleCellClick = (e) => {
        const cellCoordinates = [e.target.parentElement.parentElement.rowIndex, e.target.parentElement.cellIndex];
        

        if (entryPoints < props.numEntryPoints) {
            setEntryPoints(prevEntryPoints => [...prevEntryPoints, cellCoordinates]);
        }
    }

    return (
        <div>
            <h1>Select the entry points of the parking lot</h1>
            <table border={1} width={100}>
                <tbody>
                    {props.parkingMap.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((slotType, columnIndex) => (
                                <td key={columnIndex}>
                                    <button onClick={handleCellClick}></button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SetEntryPoints;