import { useEffect, useState } from "react";
import "./ControlPanel.scss";
import { useWizard } from "react-use-wizard";
import { isNil } from "lodash";
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

    useEffect(() => console.log('selectedEntryPoint', selectedEntryPoint), [selectedEntryPoint]);

    useEffect(() => console.log('currentVehicle', currentVehicle), [currentVehicle]);

    useEffect(() => console.log('vehicles', vehicles), [vehicles]);

    useEffect(() => console.log('unparkedVehicles', unparkedVehicles), [unparkedVehicles]);

    useEffect(() => {
        setParkingLot(new ParkingLot(props.parkingSlotSizes, vehicles, unparkedVehicles));
        setVehicleManager(new VehicleManager(vehicles, unparkedVehicles));
    }, [props.parkingSlotSizes, vehicles, unparkedVehicles]);

    useEffect(() => {
        setIsButtonDisabled(!vehicleManager?.isValidVehicle(currentVehicle));
    }, [vehicleManager, currentVehicle]);

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
        const parkedVehicleCoordinates = parkingLot?.parkVehicle(selectedEntryPoint, currentVehicle.size);

        if (!isNil(parkedVehicleCoordinates)) {
            const isReturningVehicle = vehicleManager?.isReturningVehicle(currentVehicle);
            let vehicleTimeIn = currentVehicle.timeIn;

            // Replace the returning vehicle's time in with its previous time in to simulate the continuous rate
            if (isReturningVehicle) {
                const returningVehicle = vehicleManager.getReturningVehicle(currentVehicle);

                vehicleTimeIn = returningVehicle.timeIn;

                setUnparkedVehicles(unparkedVehicles.filter(unparkedVehicle =>
                    !(unparkedVehicle.coordinates.rowIndex === returningVehicle.coordinates.rowIndex &&
                        unparkedVehicle.coordinates.columnIndex === returningVehicle.coordinates.columnIndex)
                ));
            }

            toast.success(`Vehicle ${currentVehicle.license} parked at row ${parkedVehicleCoordinates.rowIndex} column ${parkedVehicleCoordinates.columnIndex}.`);

            setVehicles([...vehicles, { ...currentVehicle, coordinates: parkedVehicleCoordinates, timeIn: vehicleTimeIn }]);
        } else {
            toast.error('Sorry, no available parking slot for your vehicle.');
        }

        setCurrentVehicle(null);
        setSelectedEntryPoint(null);
    }

    const handleUnparkButton = (parkedVehicle) => {
        const parkingFee = parkingLot?.unparkVehicle(parkedVehicle);

        // TODO: Add this to the screen instead of using an alert
        toast.success(`Vehicle ${parkedVehicle.license}'s parking fee is ₱${parkingFee}`);

        setCurrentVehicle(null);
        setUnparkedVehicles(prevUnparkedVehicles => [...prevUnparkedVehicles, parkedVehicle]);
        setVehicles(vehicles.filter(vehicle =>
            !(vehicle.coordinates.rowIndex === parkedVehicle.coordinates.rowIndex &&
                vehicle.coordinates.columnIndex === parkedVehicle.coordinates.columnIndex)
        ));
    }

    return (
        <div className="control-panel">
            <Toaster
                position="top-right"
                toastOptions={{
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
                    <h5>Control Panel</h5>

                    <div className="row">
                        <div className="col-8">
                            {
                                selectedEntryPoint || !isNil(currentVehicle) ?
                                    <div className="park-vehicle">
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
                                                            className="btn btn-success"
                                                            disabled={isButtonDisabled}
                                                            onClick={() => handleUnparkButton(currentVehicle)}
                                                        >Unpark Vehicle</button> :

                                                        <button
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