import { useEffect, useState } from "react";
import "./ControlPanel.scss";
import { useWizard } from "react-use-wizard";
import { isEqual, isNil } from "lodash";
import toast, { Toaster } from 'react-hot-toast';
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import ParkingLot from "../../../lib/ParkingLot";
import VehicleManager from "../../../lib/VehicleManager";
import ReactInputMask from "react-input-mask";
import config from "../../../config";

const ControlPanel = (props) => {
    const {
        activeStep,
    } = useWizard();

    const defaultVehicle = {
        license: '',
        size: 'S',
        timeIn: '',
        timeOut: '',
        coordinates: {}
    };

    const [parkingLot, setParkingLot] = useState(null);
    const [vehicleManager, setVehicleManager] = useState(null);
    const [selectedEntryPoint, setSelectedEntryPoint] = useState(null);
    const [currentVehicle, setCurrentVehicle] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [unparkedVehicles, setUnparkedVehicles] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        setParkingLot(new ParkingLot(props.parkingSlotSizes, vehicles, unparkedVehicles));
        setVehicleManager(new VehicleManager(vehicles, unparkedVehicles));
    }, [props.parkingSlotSizes, vehicles, unparkedVehicles]);

    // Disable the park/unpark button if the vehicle is valid
    useEffect(() => {
        setIsButtonDisabled(!vehicleManager?.isValidVehicle(currentVehicle));
    }, [vehicleManager, currentVehicle]);

    /**
     * Handles the click event on a parking lot cell.
     *
     * @param {number} rowIndex - The row index of the clicked cell.
     * @param {number} columnIndex - The column index of the clicked cell.
     */
    const handleCellClick = (rowIndex, columnIndex) => {
        const isEntryPointCell = ParkingLot.isEntryPoint(props.entryPoints, rowIndex, columnIndex);
        const parkedVehicle = vehicleManager.getVehicleByPosition(rowIndex, columnIndex);

        if (isEntryPointCell) {
            setSelectedEntryPoint({ rowIndex, columnIndex });
            setCurrentVehicle(defaultVehicle);
        } else if (!isNil(parkedVehicle)) {
            setCurrentVehicle(parkedVehicle);
            setSelectedEntryPoint(null);
        } else {
            setCurrentVehicle(null);
            setSelectedEntryPoint(null);
        }
    }

    const handleParkButton = () => {
        if (vehicleManager.isParked(currentVehicle, true)) {
            toast.error(`Vehicle ${currentVehicle.license} is already parked.`);
        } else {
            const isReturningVehicle = vehicleManager.isReturningVehicle(currentVehicle);
            let incomingVehicle = currentVehicle;

            if (isReturningVehicle) {
                const returningVehicle = vehicleManager.getReturningVehicle(currentVehicle);
                
                incomingVehicle = {...incomingVehicle, timeIn: returningVehicle.timeIn, size: returningVehicle.size};

                setUnparkedVehicles(unparkedVehicles.filter(unparkedVehicle =>
                    !isEqual(unparkedVehicle.coordinates, returningVehicle.coordinates)
                ));
            }

            const parkedVehicleCoordinates = parkingLot?.parkVehicle(selectedEntryPoint, incomingVehicle.size);

            if (!isNil(parkedVehicleCoordinates)) {
                toast.success(`Vehicle ${incomingVehicle.license} parked at row ${parkedVehicleCoordinates.rowIndex + 1} column ${parkedVehicleCoordinates.columnIndex + 1}.`);

                setVehicles([...vehicles, { ...incomingVehicle, coordinates: parkedVehicleCoordinates }]);
            } else {
                toast.error('Sorry, no available parking slot for your vehicle.');
            }
        }

        setCurrentVehicle(null);
        setSelectedEntryPoint(null);
    }

    const handleUnparkButton = (parkedVehicle) => {
        const parkingFee = parkingLot?.unparkVehicle(parkedVehicle);

        toast.success(`Vehicle ${parkedVehicle.license}'s parking fee is ₱${parkingFee}`);

        setCurrentVehicle(null);
        setUnparkedVehicles(prevUnparkedVehicles => [...prevUnparkedVehicles, parkedVehicle]);
        setVehicles(vehicles.filter(vehicle =>
            !isEqual(vehicle.coordinates, parkedVehicle.coordinates)
        ));
    }

    return (
        <div className="control-panel">
            <Toaster
                position="top-right"
                toastOptions={{
                    reverseOrder: true,
                    duration: config.TOAST_DURATION,
                    className: "custom-toast",
                }}
            />

            <div className="row">
                <div className="col-6">
                    <ParkingMap
                        step={activeStep}
                        vehicles={vehicles}
                        config={props.parkingMapConfig}
                        entryPoints={props.entryPoints}
                        parkingSlotSizes={props.parkingSlotSizes}
                        handleCellClick={handleCellClick}
                    />
                </div>

                <div className="col-6 input-col">
                    <h5 data-cy="section-title">Control Panel</h5>

                    <div className="row">
                        <div className="col-8">
                            {
                                selectedEntryPoint || !isNil(currentVehicle) ?
                                    <div className="park-vehicle" data-cy="park-vehicle-form">
                                        {
                                            vehicleManager.isParked(currentVehicle) ? <h6><u>Vehicle Details</u></h6> : null
                                        }

                                        {
                                            selectedEntryPoint ? <span><i>Entry Point: Row {selectedEntryPoint.rowIndex + 1} Column {selectedEntryPoint.columnIndex + 1}</i></span> : null
                                        }

                                        <div className="row">
                                            <div className="col-9">
                                                <label htmlFor="license-plate">License Plate</label>
                                                <ReactInputMask
                                                    data-cy="license-plate-field"
                                                    alwaysShowMask
                                                    autoFocus
                                                    id="license-plate"
                                                    className="form-control"
                                                    mask="aaa-9999"
                                                    disabled={vehicleManager.isParked(currentVehicle)}
                                                    value={currentVehicle.license}
                                                    beforeMaskedStateChange={({ nextState }) => {
                                                        let { value } = nextState;

                                                        value = value.toUpperCase();

                                                        return {
                                                            ...nextState,
                                                            value
                                                        };
                                                    }}
                                                    onChange={(e) => setCurrentVehicle(prevVehicle => {
                                                        return {
                                                            ...prevVehicle,
                                                            license: e.target.value,
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-9">
                                                <label htmlFor="vehicle-size">Vehicle Size</label>
                                                <select
                                                    data-cy="vehicle-size-field"
                                                    className="form-select"
                                                    id="vehicle-size"
                                                    value={currentVehicle.size}
                                                    disabled={vehicleManager.isParked(currentVehicle)}
                                                    onChange={(e) => {
                                                        setCurrentVehicle(prevVehicle => {
                                                            return {
                                                                ...prevVehicle,
                                                                size: e.target.value,
                                                            }
                                                        });
                                                    }}>
                                                    <option>S</option>
                                                    <option>M</option>
                                                    <option>L</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-9">
                                                <label htmlFor="time-in">Time in</label>
                                                <input
                                                    data-cy="time-in-field"
                                                    className="form-control"
                                                    id="time-in"
                                                    type="datetime-local"
                                                    min={new Date().toISOString().slice(0, 16)}
                                                    value={currentVehicle.timeIn}
                                                    disabled={vehicleManager.isParked(currentVehicle)}
                                                    onChange={(e) => {
                                                        setCurrentVehicle(prevVehicle => {
                                                            return {
                                                                ...prevVehicle,
                                                                timeIn: e.target.value,
                                                            }
                                                        });
                                                    }} />
                                            </div>
                                        </div>

                                        {
                                            vehicleManager.isParked(currentVehicle) ?
                                                <div className="row">
                                                    <div className="col-9">
                                                        <label htmlFor="time-out">Time out</label>
                                                        <input
                                                            data-cy="time-out-field"
                                                            className="form-control"
                                                            id="time-out"
                                                            type="datetime-local"
                                                            min={currentVehicle.timeIn.slice(0, 16)}
                                                            value={currentVehicle.timeOut}
                                                            onChange={(e) => {
                                                                setCurrentVehicle(prevVehicle => {
                                                                    return {
                                                                        ...prevVehicle,
                                                                        timeOut: e.target.value,
                                                                    }
                                                                });
                                                            }} />
                                                    </div>
                                                </div> : null
                                        }

                                        <div className="row col-11 step-nav-buttons">
                                            <div className="col">
                                                {
                                                    vehicleManager.isParked(currentVehicle) ?
                                                        <button
                                                            data-cy="unpark-button"
                                                            className="btn btn-success"
                                                            disabled={isButtonDisabled}
                                                            onClick={() => handleUnparkButton(currentVehicle)}
                                                        >Unpark Vehicle</button> :

                                                        <button
                                                            data-cy="park-button"
                                                            className="btn btn-success"
                                                            onClick={() => handleParkButton()}
                                                            disabled={isButtonDisabled}
                                                        >Park Vehicle</button>
                                                }
                                            </div>
                                        </div>
                                    </div> : <div>Please select an entry point to park a vehicle or a parked vehicle's license plate to unpark it.</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlPanel;