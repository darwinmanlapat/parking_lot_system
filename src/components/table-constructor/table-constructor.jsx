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

    return (
        <div>
            <div>
                <label>
                    Number of Entry Points:
                    <input
                        type="number"
                        min="3"
                        // value={numEntryPoints}
                        onChange={e => props.setNumEntryPoints(parseInt(e.target.value))}
                    />
                </label>
            </div>

            <div>
                <label>
                    Number of Rows:
                    <input
                        type="number"
                        min="1"
                        // value={numRows}
                        onChange={e => props.setNumRows(parseInt(e.target.value))}
                    />
                </label>
            </div>

            <div>
                <label>
                    Number of Columns:
                    <input
                        type="number"
                        min="1"
                        // value={numColumns}
                        onChange={e => props.setNumColumns(parseInt(e.target.value))}
                    />
                </label>
            </div>

            <button onClick={() => nextStep()}>Next</button>
        </div>
    );
}

export default TableConstructor;