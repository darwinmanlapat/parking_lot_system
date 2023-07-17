import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./ControlPanel.scss";
import ParkingLot from "../../../lib/ParkingLot";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import { SizeEnum } from "../../../enums/Sizes";
import { getParkingSlotSize } from "../../../helpers/getParkingSlotSize";

const ControlPanel = (props) => {
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

    const defaultVehicle = {
        license: '',
        size: 'S',
        time_in: '',
        time_out: '',
        coordinates: {}
    };

    const [selectedEntryPoint, setSelectedEntryPoint] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [currentVehicle, setCurrentVehicle] = useState(null);

    useEffect(() => console.log('selectedEntryPoint', selectedEntryPoint), [selectedEntryPoint]);

    useEffect(() => console.log('currentVehicle', currentVehicle), [currentVehicle]);

    useEffect(() => console.log('vehicles', vehicles), [vehicles]);

    const handleCellClick = (rowIndex, columnIndex) => {
        const isEntryPointCell = props.entryPoints.some(
            entryPointCell => entryPointCell.rowIndex === rowIndex && entryPointCell.columnIndex === columnIndex
        );
        const parkedVehicleIndex = vehicles.findIndex(
            vehicle => vehicle.coordinates.rowIndex === rowIndex && vehicle.coordinates.columnIndex === columnIndex
        );

        if (isEntryPointCell) {
            setSelectedEntryPoint({ rowIndex, columnIndex });
            setCurrentVehicle(defaultVehicle);
        } else if (parkedVehicleIndex >= 0) {
            setCurrentVehicle(vehicles[parkedVehicleIndex]);
        } else {
            setCurrentVehicle(null);
            setSelectedEntryPoint(null);
        }
    }

    const parkVehicle = () => {
        const parkingSlotCoordinates = possibleParkingSlots(currentVehicle.size);

        const availableSlot = findClosestAvailableSlot(selectedEntryPoint, parkingSlotCoordinates);

        if (availableSlot) {
            setVehicles([...vehicles, { ...currentVehicle, coordinates: availableSlot }]);
            alert(`Vehicle with license plate ${currentVehicle.license} parked at coordinates (${availableSlot.rowIndex}, ${availableSlot.columnIndex})`);
        } else {
            alert('No available parking slots for the vehicle type.');
        }

        setCurrentVehicle(null);
        setSelectedEntryPoint(null);
    }

    const unParkVehicle = (parkedVehicle) => {
        const parkedVehicleIndex = vehicles.findIndex(
            vehicle => parkedVehicle.coordinates.rowIndex === vehicle.rowIndex && parkedVehicle.coordinates.columnIndex === vehicle.columnIndex
        );

        const parkedVehicleSlotSize = getParkingSlotSize(parkedVehicle.coordinates.rowIndex, parkedVehicle.coordinates.columnIndex, props.parkingSlotSizes);

        alert(calculateFee(parkedVehicle, parkedVehicleSlotSize));

        const adjustedVehicles = [...vehicles];

        adjustedVehicles.splice(parkedVehicleIndex, 1);

        setCurrentVehicle(null);
        setVehicles([...adjustedVehicles]);
    }

    const calculateFee = (unParkedVehicle, slotType) => {
        const { time_in, time_out } = unParkedVehicle;

        const timeDiff = Math.ceil((new Date(time_out) - new Date(time_in)) / (1000 * 60 * 60)); // hours rounded up
        const baseRate = 40;

        let exceedingHourlyRate = 0;

        if (slotType === SizeEnum.SMALL) exceedingHourlyRate = 20;
        else if (slotType === SizeEnum.MEDIUM) exceedingHourlyRate = 60;
        else if (slotType === SizeEnum.LARGE) exceedingHourlyRate = 100;

        const full24Hour = Math.floor(timeDiff / 24);
        const remainderHours = timeDiff % 24;

        const full24HoursFee = full24Hour * 5000;
        const remainderHoursFee = full24HoursFee > 0 ? calculateExceedingHoursFee(remainderHours, exceedingHourlyRate) : 0;
        const exceedingHoursFee = full24HoursFee > 0 ? 0 : calculateExceedingHoursFee(remainderHours, exceedingHourlyRate);

        const fee = (baseRate * Math.max(full24Hour, 1)) + exceedingHoursFee + full24HoursFee + remainderHoursFee;

        return fee;
    }

    const calculateExceedingHoursFee = (exceedingHours, exceedingHourlyRate) => {
        return Math.max(exceedingHours - 3, 0) * exceedingHourlyRate;
    }

    const findClosestAvailableSlot = (entryPoint, parkingSlotCoordinates) => {
        let closestSlot = null;
        let minDistance = Infinity;

        for (const coordinates of parkingSlotCoordinates) {
            const distance = calculateDistance(entryPoint, coordinates);
            if (distance < minDistance && !isSlotOccupied(coordinates)) {
                minDistance = distance;
                closestSlot = coordinates;
            }
        }

        return closestSlot;
    };

    const isSlotOccupied = (coordinates) => {
        return vehicles.some((vehicle) => vehicle.coordinates.rowIndex === coordinates.rowIndex && vehicle.coordinates.columnIndex === coordinates.columnIndex);
    };

    const possibleParkingSlots = (vehicleType) => {
        const smallSlots = props.parkingSlotSizes[SizeEnum.SMALL];
        const mediumSlots = props.parkingSlotSizes[SizeEnum.MEDIUM];
        const largeSlots = props.parkingSlotSizes[SizeEnum.LARGE];

        if (vehicleType === SizeEnum.SMALL) {
            return smallSlots.concat(mediumSlots, largeSlots);
        }

        if (vehicleType === SizeEnum.MEDIUM) {
            return mediumSlots.concat(largeSlots);
        }

        if (vehicleType === SizeEnum.LARGE) {
            return largeSlots;
        }
    };

    const calculateDistance = (point1, point2) => {
        const dx = Math.abs(point1.rowIndex - point2.rowIndex);
        const dy = Math.abs(point1.columnIndex - point2.columnIndex);
        return Math.max(dx, dy);
    };

    return (
        <div className="control-panel">
            <h1>Parking Lot System Control Panel</h1>

            {
                selectedEntryPoint || !!currentVehicle ?
                    <div className="park-vehicle">
                        <h3>Vehicle Details</h3>
                        {
                            selectedEntryPoint ? <div>Entry Point: Row {selectedEntryPoint.rowIndex} Column {selectedEntryPoint.columnIndex}</div> : null
                        }
                        <div>
                            <label htmlFor="license-plate">License Plate</label>
                            <input type="text" id="license-plate" value={currentVehicle.license} onChange={(e) => {
                                setCurrentVehicle(prevVehicle => {
                                    return {
                                        ...prevVehicle,
                                        license: e.target.value,
                                    }
                                });
                            }} />
                        </div>
                        <div>
                            <label htmlFor="vehicle-size">Vehicle Size</label>
                            <select id="vehicle-size" value={currentVehicle.size} onChange={(e) => {
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
                        <div>
                            <label htmlFor="time-in">Time in</label>
                            <input id="time-in" type="datetime-local" value={currentVehicle.time_in} onChange={(e) => {
                                setCurrentVehicle(prevVehicle => {
                                    return {
                                        ...prevVehicle,
                                        time_in: e.target.value,
                                    }
                                });
                            }} />
                        </div>
                        {
                            Object.keys(currentVehicle.coordinates).length !== 0 ?
                                <div>
                                    <label htmlFor="time-out">Time out</label>
                                    <input id="time-out" type="datetime-local" value={currentVehicle.time_out} onChange={(e) => {
                                        setCurrentVehicle(prevVehicle => {
                                            return {
                                                ...prevVehicle,
                                                time_out: e.target.value,
                                            }
                                        });
                                    }} />
                                </div> : null
                        }

                        {
                            Object.keys(currentVehicle.coordinates).length !== 0 ?
                                <button onClick={() => unParkVehicle(currentVehicle)}>Unpark Vehicle</button> : <button onClick={() => parkVehicle()}>Park Vehicle</button>
                        }
                    </div> : null
            }

            <div className="step-nav-buttons">
                <button onClick={() => previousStep()}>Previous</button>
            </div>

            <ParkingMap config={props.parkingMapConfig} step={activeStep} handleCellClick={handleCellClick} entryPoints={props.entryPoints} parkingSlotSizes={props.parkingSlotSizes} vehicles={vehicles} />
        </div>
    );
}

export default ControlPanel;