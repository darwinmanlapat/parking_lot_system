import { isNil } from "lodash";
import { useEffect, useState } from "react";
import config from "../../../config";
import { Sizes } from "../../../enums/Size";
import ParkingLot from "../../../lib/ParkingLot";
import ParkingSlot from "../../../lib/ParkingSlot";
import VehicleManager from "../../../lib/VehicleManager";
import "./ParkingMap.scss";

const ParkingMap = (props) => {
	const [parkingSlot, setParkingSLot] = useState(null);
	const [vehicleManager, setVehicleManager] = useState(null);

	useEffect(
		() => setParkingSLot(new ParkingSlot(props.parkingSlotSizes)),
		[props.parkingSlotSizes]
	);
	useEffect(
		() => setVehicleManager(new VehicleManager(props.vehicles)),
		[props.vehicles]
	);

	const renderCell = (rowIndex, columnIndex) => {
		if (props.step === 2) {
			return (
				<select
					className="size-select"
					onChange={(e) =>
						props.handleParkingSlotSizeChange(
							rowIndex,
							columnIndex,
							e.target.value
						)
					}
				>
					<option>{Sizes.SMALL}</option>
					<option>{Sizes.MEDIUM}</option>
					<option>{Sizes.LARGE}</option>
				</select>
			);
		}

		if (props.step === 3) {
			const vehicle = vehicleManager?.getVehicleByPosition(
				rowIndex,
				columnIndex
			);

			if (!isNil(vehicle)) {
				return <div className="parked-vehicle">{vehicle.license}</div>;
			}

			return parkingSlot?.getSizeByCoordinates(rowIndex, columnIndex);
		}
	};

	return (
		<div className="parking-map" data-cy="parking-map">
			<center>
				<table className="table table-bordered border-primary">
					<tbody>
						{props.config.tableSize >= config.MIN_ENTRY_POINTS &&
						props.config.tableSize <= config.MAX_TABLE_SIZE
							? Array.from(
									{ length: props.config.tableSize },
									(row, rowIndex) => (
										<tr key={"parking-map-row" + rowIndex}>
											{Array.from(
												{ length: props.config.tableSize },
												(column, columnIndex) => {
													const isEntryPoint = ParkingLot.isEntryPoint(
														props.entryPoints,
														rowIndex,
														columnIndex
													);

													return (
														<td
															key={"parking-map-column" + columnIndex}
															className={
																isEntryPoint && props.step !== 0
																	? "clicked"
																	: ""
															}
															onClick={() => {
																if (props.handleCellClick) {
																	props.handleCellClick(rowIndex, columnIndex);
																}
															}}
														>
															{!isEntryPoint
																? renderCell(rowIndex, columnIndex)
																: null}
														</td>
													);
												}
											)}
										</tr>
									)
							  )
							: null}
					</tbody>
				</table>
			</center>
		</div>
	);
};

export default ParkingMap;
