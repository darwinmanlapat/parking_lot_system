import { useState } from "react";
import { useWizard } from "react-use-wizard";

const TableConstructor = (props) => {
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

    // const [status, setStatus] = useState('create-table');

    return (
        <div>
            <h1>Set table size and number of entry points</h1>
            <div>
                <label>
                    Number of Entry Points:
                    <input
                        type="number"
                        min="3"
                        value={props.numEntryPoints}
                        onChange={e => props.setNumEntryPoints(parseInt(e.target.value))}
                    />
                </label>
            </div>

            <div>
                <label>
                    Number of Rows:
                    <input
                        type="number"
                        min={props.numEntryPoints}
                        value={props.numRows}
                        onChange={e => props.setNumRows(parseInt(e.target.value))}
                    />
                </label>
            </div>

            <div>
                <label>
                    Number of Columns:
                    <input
                        type="number"
                        min={props.numEntryPoints}
                        value={props.numColumns}
                        onChange={e => props.setNumColumns(parseInt(e.target.value))}
                    />
                </label>
            </div>

            {/* <button onClick={() => nextStep()}>Next</button> */}
            <button onClick={() => nextStep()}>Next</button>
        </div>
    );
}

export default TableConstructor;