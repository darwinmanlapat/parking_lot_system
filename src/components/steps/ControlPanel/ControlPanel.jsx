import { useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";

import "./ControlPanel.scss";
import ParkingLot from "../../../lib/ParkingLot";
import ParkingMap from "../../common/ParkingMap/ParkingMap";
import { SizeEnum } from "../../../enums/Sizes";

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
        coordinates: {}
    };

    const [selectedEntryPoint, setSelectedEntryPoint] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [currentVehicle, setCurrentVehicle] = useState(defaultVehicle);

    useEffect(() => console.log('selectedEntryPoint', selectedEntryPoint), [selectedEntryPoint]);

    useEffect(() => console.log('currentVehicle', currentVehicle), [currentVehicle]);

    useEffect(() => console.log('vehicles', vehicles), [vehicles]);

    const handleCellClick = (rowIndex, columnIndex) => {
        const isEntryPointCell = props.entryPoints.some(
            entryPointCell => entryPointCell.rowIndex === rowIndex && entryPointCell.columnIndex === columnIndex
        );

        if (isEntryPointCell) {
            setSelectedEntryPoint({ rowIndex, columnIndex });
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

        setCurrentVehicle(defaultVehicle);
        setSelectedEntryPoint(null);
    }

    // NOTE: Need to update this algorithm to get the closest slot in a clockwise direction.
    const findClosestAvailableSlot = (entryPoint, parkingSlotCoordinates) => {
        const entryPointIndex = props.entryPoints.findIndex(
            (coordinate) => entryPoint.rowIndex === coordinate.rowIndex && entryPoint.columnIndex === coordinate.columnIndex
        );

        // let closestSlot = null;
        let closestSlots = [];
        let minDistance = Infinity;

        for (const coordinates of parkingSlotCoordinates) {
            const distance = calculateDistance(entryPoint, coordinates);
            if (distance <= minDistance && !isSlotOccupied(coordinates)) {
                // minDistance = distance;
                // closestSlot = coordinates;
                if (distance < minDistance) {
                    closestSlots = [coordinates];
                } else {
                    closestSlots.push(coordinates);
                }

                minDistance = distance;
            }
        }

        // If there are no close slots, return null immediately
        if (closestSlots.length === 0) {
            return null;
        }

        return getClosestClockwiseSlot(closestSlots);
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

    const getClosestClockwiseSlot = (parkingSlotCoordinates) => {
        const sortedCoordinates = [...parkingSlotCoordinates];

        sortedCoordinates.sort((coord1, coord2) => {
            if (coord1.rowIndex !== coord2.rowIndex) {
                return coord2.rowIndex - coord1.rowIndex; // Sort by highest row
            } else {
                return coord1.columnIndex - coord2.columnIndex; // Sort by lowest column
            }
        });

        return sortedCoordinates[0] ?? null;
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
                selectedEntryPoint ?
                    <div className="park-vehicle">
                        <h3>Vehicle Details</h3>
                        <div>Entry Point: Row {selectedEntryPoint.rowIndex} Column {selectedEntryPoint.columnIndex}</div>
                        <div>
                            <label htmlFor="license-plate">License Plate</label>
                            <input type="text" id="license-plate" onChange={(e) => {
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
                            <select id="vehicle-size" onChange={(e) => {
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
                            <label htmlFor="time-in">Time-in</label>
                            <input id="time-in" type="datetime-local" onChange={(e) => {
                                setCurrentVehicle(prevVehicle => {
                                    return {
                                        ...prevVehicle,
                                        time_in: e.target.value,
                                    }
                                });
                            }} />
                        </div>
                        <button onClick={() => parkVehicle()}>Park Vehicle</button>
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