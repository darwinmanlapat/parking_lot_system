import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";
import ParkingMap from "../../common/ParkingMap/ParkingMap";

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

    const numRows = props.parkingMapConfig.numRows;
    const numColumns = props.parkingMapConfig.numColumns;
    const numEntryPoints = props.parkingMapConfig.numEntryPoints;

    const handleNumEntryPointChange = (newNumEntryPoint) => {
        props.setParkingMapConfig(prevConfig => {
            return {
                numEntryPoints: newNumEntryPoint,
                ...prevConfig,
            }
        });
    }

    return (
        <div>
            <h1>Set table size and number of entry points</h1>
            <div>
                <label>
                    Number of Entry Points:
                    <input
                        type="number"
                        min="3"
                        value={numEntryPoints}
                        onChange={e => {
                            props.setParkingMapConfig(prevConfig => {
                                return {
                                    ...prevConfig,
                                    numEntryPoints: parseInt(e.target.value),
                                }
                            });
                        }}
                    />
                </label>
            </div>

            <div>
                <label>
                    Number of Rows:
                    <input
                        type="number"
                        min={props.parkingMapConfig.numEntryPoints}
                        value={numRows}
                        onChange={e => {
                            props.setParkingMapConfig(prevConfig => {
                                return {
                                    ...prevConfig,
                                    numRows: parseInt(e.target.value),
                                }
                            });
                        }}
                    />
                </label>
            </div>

            <div>
                <label>
                    Number of Columns:
                    <input
                        type="number"
                        min={props.parkingMapConfig.numEntryPoints}
                        value={numColumns}
                        onChange={e => {
                            props.setParkingMapConfig(prevConfig => {
                                return {
                                    ...prevConfig,
                                    numColumns: parseInt(e.target.value),
                                }
                            });
                        }}
                    />
                </label>
            </div>

            <button onClick={() => nextStep()}>Next</button>

            <ParkingMap config={props.parkingMapConfig} step={activeStep} entryPoints={props.entryPoints} />
        </div>
    );
}

export default TableConstructor;