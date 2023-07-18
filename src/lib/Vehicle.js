// Vehicle class
class Vehicle {
    constructor(license = '', size = 'S', timeIn = '', timeOut = '', coordinates = {}) {
        this._license = license;
        this._size = size;
        this._timeIn = timeIn;
        this._timeOut = timeOut;
        this._coordinates = coordinates;

        Object.defineProperty(this, 'license', {
            get: function () { return this._license; },
            set: function(license) {
                this._license = license;
            }
        });

        // Object.defineProperty(this, 'size', {
        //     get: function ( ) { return this.size; }
        // });

        // Object.defineProperty(this, 'timeIn', {
        //     get: function ( ) { return this.timeIn; }
        // });

        // Object.defineProperty(this, 'timeOut', {
        //     get: function ( ) { return this.timeOut; }
        // });

        // Object.defineProperty(this, 'coordinates', {
        //     get: function ( ) { return this.coordinates; }
        // });
    }

    hasCoordinates() {
        return Object.keys(this._coordinates).length !== 0
    }

    // get license() {
    //     return this._license;
    // }

    // set license(license) {
    //     this._license = license;
    // }

    // getLicense() {
    //     return this.license;
    // }

    // getSize() {
    //     return this.size;
    // }

    // getTimeIn() {
    //     return this.timeIn;
    // }

    // getTimeOut() {
    //     return this.timeOut;
    // }

    // getCoordinates() {
    //     return this.coordinates;
    // }
}

export default Vehicle;