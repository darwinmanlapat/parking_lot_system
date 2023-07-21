const Stepper = (props) => {
    const currentValue = props.value;
    
    return (
        <div className="col-xl-7" data-cy={props.data_cy}>
            <div className="input-group">
                <div className="input-group-prepend">
                    <button
                        className="btn btn-outline-primary"
                        data-cy="stepper-decrement"
                        type="button"
                        onClick={() => {
                            if (currentValue > props.min) {
                                props.setCurrentValue(currentValue - 1);
                            }
                        }}
                    >-</button>
                </div>

                <input type="text" className="form-control text-center" value={currentValue} disabled />

                <div className="input-group-prepend">
                    <button
                        className="btn btn-outline-primary"
                        data-cy="stepper-increment"
                        type="button"
                        onClick={() => {
                            if (currentValue < props.max) {
                                props.setCurrentValue(Number(currentValue) + 1);
                            }
                        }}
                    >+</button>
                </div>
            </div>
        </div>
    );
}

export default Stepper;