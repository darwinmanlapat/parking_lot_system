import { useWizard } from "react-use-wizard";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import config from "../../../config";

const TableConstructor = (props) => {
    const { activeStep, nextStep } = useWizard();

    const tableSize = props.parkingMapConfig.tableSize;
    const numEntryPoints = props.parkingMapConfig.numEntryPoints;

    return (
        <div>
            <div className="row">
                <h2>Set table size and number of entry points</h2>

                <div className="col-8">
                    <ParkingMap
                        step={activeStep}
                        config={props.parkingMapConfig}
                        entryPoints={props.entryPoints}
                    />
                </div>

                <div className="col-4">
                    <div>
                        <label>
                            Number of Entry Points:
                            <input
                                type="number"
                                min={config.MIN_ENTRY_POINTS}
                                max={props.parkingMapConfig.tableSize * 2}
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
                            Size of the table:
                            <input
                                type="number"
                                min={config.MIN_ENTRY_POINTS}
                                max={config.MAX_TABLE_SIZE}
                                value={tableSize}
                                onChange={e => {
                                    props.setParkingMapConfig(prevConfig => {
                                        return {
                                            ...prevConfig,
                                            tableSize: parseInt(e.target.value),
                                        }
                                    });
                                }}
                            />
                        </label>
                    </div>

                    <button onClick={() => nextStep()}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default TableConstructor;