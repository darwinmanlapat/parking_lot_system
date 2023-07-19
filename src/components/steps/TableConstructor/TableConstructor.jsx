import { useWizard } from "react-use-wizard";
import "./TableConstructor.scss";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import config from "../../../config";
import Stepper from "../../common/Stepper/Stepper";

const TableConstructor = (props) => {
    const { activeStep, nextStep } = useWizard();

    return (
        <div className="table-constructor">
            <div className="row">
                <h2>Set table size and number of entry points</h2>

                <div className="col-8">
                    <ParkingMap
                        step={activeStep}
                        config={props.parkingMapConfig}
                        entryPoints={props.entryPoints}
                    />
                </div>

                <div className="col-4 input-col">
                    <div className="row">
                        <div className="col-8">
                            <label className="form-label">Number of Entry Points:</label>
                            <Stepper 
                                min={config.MIN_ENTRY_POINTS}
                                max={props.parkingMapConfig.tableSize * 2}
                                value={props.parkingMapConfig.numEntryPoints}
                                setCurrentValue={stepValue => {
                                    props.setParkingMapConfig(prevConfig => {
                                        return {
                                            ...prevConfig,
                                            numEntryPoints: stepValue,
                                        }
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-8">
                            <label className="form-label">Size of the table:</label>
                            <Stepper 
                                min={config.MIN_ENTRY_POINTS}
                                max={config.MAX_TABLE_SIZE}
                                value={props.parkingMapConfig.tableSize}
                                setCurrentValue={stepValue => {
                                    props.setParkingMapConfig(prevConfig => {
                                        return {
                                            ...prevConfig,
                                            tableSize: stepValue,
                                        }
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-8">
                            <button className="btn btn-success next-button" type="button" onClick={() => nextStep()}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableConstructor;