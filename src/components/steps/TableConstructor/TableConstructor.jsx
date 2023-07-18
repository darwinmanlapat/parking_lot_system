import { useWizard } from "react-use-wizard";
import ParkingMap from "../../common/ParkingMap/ParkingMap";

const TableConstructor = (props) => {
    const {
        activeStep,
        nextStep,
    } = useWizard();

    const tableSize = props.parkingMapConfig.tableSize;
    const numEntryPoints = props.parkingMapConfig.numEntryPoints;

    return (
        <div>
            <div className="row">
                <h2>Set table size and number of entry points</h2>

                <div className="col-8">
                    <ParkingMap config={props.parkingMapConfig} step={activeStep} entryPoints={props.entryPoints} />
                </div>

                <div className="col-4">
                    <div>
                        <label>
                            Number of Entry Points:
                            <input
                                type="number"
                                min="3"
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
                                min="3"
                                max="10"
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