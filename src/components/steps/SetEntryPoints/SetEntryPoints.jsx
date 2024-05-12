import { useWizard } from "react-use-wizard";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import ParkingLot from "../../../lib/ParkingLot";
import { useEffect, useState } from "react";
import { isEqual } from "lodash";

const SetEntryPoints = (props) => {
    const { activeStep, previousStep, nextStep } = useWizard();
    const [disableNextButton, setDisableNextButton] = useState(false)

    useEffect(() => {
        if (props.entryPoints.length === props.parkingMapConfig.numEntryPoints) {
            setDisableNextButton(true);
        } else {
            setDisableNextButton(false);
        }
    }, [props.entryPoints, props.parkingMapConfig.numEntryPoints]);


    const handleCellClick = (rowIndex, columnIndex) => {
        const isOuterCell = rowIndex === 0 || rowIndex === props.parkingMapConfig.tableSize - 1 || columnIndex === 0 || columnIndex === props.parkingMapConfig.tableSize - 1;

        if (isOuterCell) {
            const isEntryPointCell = ParkingLot.isEntryPoint(props.entryPoints, rowIndex, columnIndex);

            if (isEntryPointCell) {
                props.setEntryPoints(props.entryPoints.filter(clickedCell => !isEqual(clickedCell, {rowIndex, columnIndex})));
            } else {
                if (props.entryPoints.length < props.parkingMapConfig.numEntryPoints) {
                    props.setEntryPoints([...props.entryPoints, { rowIndex, columnIndex }]);
                }
            }
        }
    }

    return (
        <div className="set-entry-points">
            <div className="row">
                <div className="col-6">
                    <ParkingMap
                        step={activeStep}
                        config={props.parkingMapConfig}
                        entryPoints={props.entryPoints}
                        handleCellClick={handleCellClick}
                    />
                </div>

                <div className="col-6 input-col">
                    <h5 data-cy="section-title">Select the entry points of the parking lot</h5>
                    <div className="row">
                        <div className="entry-point-list col-10" data-cy="entry-point-list">
                            <ul className="list-group">
                                {
                                    props.entryPoints.map((entryPoint, cellIndex) => (
                                        <li className="list-group-item" key={"entry-point-cell" + cellIndex}>
                                            Entry Point # {cellIndex + 1}: (Row {entryPoint.rowIndex + 1}, Column {entryPoint.columnIndex + 1})
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>

                    <div className="row col-11 step-nav-buttons">
                        <div className="col">
                            <button
                                data-cy="set-entry-points-prev-button"
                                className="btn btn-primary prev-button"
                                onClick={previousStep}
                            >Previous</button>
                        </div>

                        <div className="col">
                            <button
                                data-cy="set-entry-points-next-button"
                                className="btn btn-success next-button"
                                disabled={!disableNextButton}
                                onClick={nextStep}
                            >Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SetEntryPoints;