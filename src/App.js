import React, { useEffect, useState } from 'react';
import "./App.scss";
import { Wizard } from 'react-use-wizard';
import { Size } from './enums/Size';
import TableConstructor from './components/steps/TableConstructor/TableConstructor';
import SetEntryPoints from './components/steps/SetEntryPoints/SetEntryPoints';
import SetParkingSlotSizes from './components/steps/SetParkingSlotSizes/SetParkingSlotSizes';
import ControlPanel from './components/steps/ControlPanel/ControlPanel';
import ParkingLot from './lib/ParkingLot';
import config from './config';

function App() {
  const [entryPoints, setEntryPoints] = useState([]);
  const [parkingMapConfig, setParkingMapConfig] = useState({
    numEntryPoints: config.MIN_ENTRY_POINTS,
    tableSize: config.MIN_ENTRY_POINTS,
  });
  const [parkingSlotSizes, setParkingSlotSizes] = useState({
    [Size.SMALL]: [],
    [Size.MEDIUM]: [],
    [Size.LARGE]: []
  });

  // Reset the entry point list whenever the table size changes
  useEffect(() => {
    setEntryPoints([]);
  }, [parkingMapConfig.tableSize, parkingMapConfig.numEntryPoints]);

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
        const isEntryPoint = ParkingLot.isEntryPoint(entryPoints, rowIndex, columnIndex);

        if (isEntryPoint) {
          // Remove the small slot from the array
          smallSlots.filter(smallSlot =>
            smallSlot.rowIndex !== rowIndex &&
            smallSlot.columnIndex !== columnIndex
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
    // eslint-disable-next-line
  }, [entryPoints]);

  return (
    <div className="app">
      <div className="container-fluid">
        <header>
          <h1 className="title" data-cy="title">Parking Lot System</h1>
        </header>

        <section data-cy="wizard-section">
          <Wizard>
            <TableConstructor
              parkingMapConfig={parkingMapConfig}
              entryPoints={entryPoints}
              setParkingMapConfig={setParkingMapConfig}
            />

            <SetEntryPoints
              parkingMapConfig={parkingMapConfig}
              entryPoints={entryPoints}
              setParkingMapConfig={setParkingMapConfig}
              setEntryPoints={setEntryPoints}
            />

            <SetParkingSlotSizes
              parkingMapConfig={parkingMapConfig}
              entryPoints={entryPoints}
              parkingSlotSizes={parkingSlotSizes}
              setParkingMapConfig={setParkingMapConfig}
              setParkingSlotSizes={setParkingSlotSizes}
            />

            <ControlPanel
              parkingMapConfig={parkingMapConfig}
              entryPoints={entryPoints}
              parkingSlotSizes={parkingSlotSizes}
              setParkingMapConfig={setParkingMapConfig}
            />
          </Wizard>
        </section>
      </div>
    </div>
  );
}

export default App;