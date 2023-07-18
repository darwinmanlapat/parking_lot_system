import React, { useEffect, useState } from 'react';
import { Wizard } from 'react-use-wizard';
import TableConstructor from './components/steps/TableConstructor/TableConstructor';
import SetEntryPoints from './components/steps/SetEntryPoints/SetEntryPoints';
import SetParkingSlotSizes from './components/steps/SetParkingSlotSizes/SetParkingSlotSizes';
import ParkingMap from './components/common/ParkingMap/ParkingMap';
import ControlPanel from './components/steps/ControlPanel/ControlPanel';
import ParkingLot from './lib/ParkingLot';
import { Size } from './enums/Size';

function App() {
  const [entryPoints, setEntryPoints] = useState([]);
  const [parkingMapConfig, setParkingMapConfig] = useState({
    numEntryPoints: 3,
    tableSize: 3,
  });
  const [parkingSlotSizes, setParkingSlotSizes] = useState({
    [Size.SMALL]: [],
    [Size.MEDIUM]: [],
    [Size.LARGE]: []
  });
  // const [parkingLot, setParkingLot] = useState(null);
  // const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  // const [vehicleType, setVehicleType] = useState('');
  // const [parkedVehicle, setParkedVehicle] = useState(null);

  // const handleUnparkVehicle = () => {
  //   const entryPoints = Array.from({ length: numEntryPoints }, (_, i) => `Entry ${String.fromCharCode(65 + i)}`);
  //   const parkingSlots = [];

  //   parkingMap.forEach((row, rowIndex) => {
  //     row.forEach((slotType, columnIndex) => {
  //       const slotNumber = `${String.fromCharCode(65 + rowIndex)}${columnIndex + 1}`;
  //       parkingSlots.push(new ParkingSlot(slotNumber, slotType));
  //     });
  //   });

  //   const vehicleMap = {
  //     S: 0, // Small vehicle
  //     M: 1, // Medium vehicle
  //     L: 2, // Large vehicle
  //   };

  //   const parkingLot = new ParkingLot(entryPoints, parkingSlots, vehicleMap);
  //   parkingLot.unparkVehicle(parkedVehicle);
  //   setUnparkedVehicle(parkedVehicle);
  //   setParkedVehicle(null);
  // };

  // Reset the entry point list whenever the table size changes
  useEffect(() => {
    setEntryPoints([]);
  }, [parkingMapConfig.tableSize]);

  useEffect(() => {
    console.log('parkingMapConfig', parkingMapConfig);
  }, [parkingMapConfig]);

  useEffect(() => {
    console.log('parkingSlotSizes', parkingSlotSizes);
  }, [parkingSlotSizes]);

  useEffect(() => {
    const smallSlots = [];

    for (let rowIndex = 0; rowIndex < parkingMapConfig.tableSize; rowIndex++) {
      for (let columnIndex = 0; columnIndex < parkingMapConfig.tableSize; columnIndex++) {
        const isEntryPoint = entryPoints.some(
          entryPoint => entryPoint.rowIndex === rowIndex && entryPoint.columnIndex === columnIndex
        );

        if (isEntryPoint) {
          // Remove the small slot from the array
          smallSlots.filter(
            smallSlot => smallSlot.rowIndex !== rowIndex && smallSlot.columnIndex !== columnIndex
          );
        } else {
          // Add the slot to the small slots array
          smallSlots.push({ rowIndex, columnIndex });
        }
      }
    }

    setParkingSlotSizes({
      [Size.SMALL]: smallSlots,
      [Size.MEDIUM]: [],
      [Size.LARGE]: [],
    });
  }, [entryPoints]);

  // const updateParkingMap = (givenRowIndex, givenColumnIndex, cellValue) => {
  //   const updatedParkingMap = [...parkingMap];

  //   updatedParkingMap.map((row, rowIndex) => {
  //     row.map((column, columnIndex) => {
  //       if (rowIndex === givenRowIndex && columnIndex === givenColumnIndex) {
  //         updatedParkingMap[rowIndex][columnIndex] = cellValue;
  //       } else {
  //         updatedParkingMap[rowIndex][columnIndex] = column;
  //       }
  //     });
  //   });

  //   setParkingMap(updatedParkingMap);
  // }

  return (
    <div className="app">
      <Wizard>
        <TableConstructor parkingMapConfig={parkingMapConfig} setParkingMapConfig={setParkingMapConfig} entryPoints={entryPoints} />
        <SetEntryPoints parkingMapConfig={parkingMapConfig} setParkingMapConfig={setParkingMapConfig} entryPoints={entryPoints} setEntryPoints={setEntryPoints} />
        <SetParkingSlotSizes parkingMapConfig={parkingMapConfig} setParkingMapConfig={setParkingMapConfig} entryPoints={entryPoints} parkingSlotSizes={parkingSlotSizes} setParkingSlotSizes={setParkingSlotSizes} />
        <ControlPanel parkingMapConfig={parkingMapConfig} setParkingMapConfig={setParkingMapConfig} entryPoints={entryPoints} parkingSlotSizes={parkingSlotSizes} />
      </Wizard>
    </div>
  );
}

export default App;