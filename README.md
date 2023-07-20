# Parking Lot System

This is a parking lot system designed for the PayMongo technical exam.

## Running Locally

### Prerequisite
- Node: 16.20.1

### Steps
1. Clone this repository to your desired directory.
2. Go into the project directory and run `npm install` to install dependencies.
3. After all the dependencies are installed, run `npm run start` to start the local server.
4. When the server is up and running, it will open a tab for the app (usually it is `localhost:3000`).

## Constraints

### Entry Points

There are initially three (3) entry points, and there can be no less than three (3) leading into the parking complex. A vehicle must be assigned a possible and available slot closest to the parking entrance. The mall can decide to add new entrances later.

### Vehicle and Parking Slot Sizes

There are three types of vehicles: small (S), medium (M), and large (L), and there are three types of parking slots: small (SP), medium (MP), and large (LP).

- S vehicles can park in SP, MP, and LP parking spaces;
- M vehicles can park in MP and LP parking spaces; and
- L vehicles can park only in LP parking spaces.

### Payment Fees

Your parking system must also handle the calculation of fees, and must meet the following pricing structure:

1. All types of cars pay the flat rate of 40 pesos for the first three (3) hours;

2. The exceeding hourly rate beyond the initial three (3) hours will be charged as follows:
    - 20/hour for vehicles parked in SP;
    - 60/hour for vehicles parked in MP; and
    - 100/hour for vehicles parked in LP

    Take note that exceeding hours are charged depending on parking slot size regardless of vehicle size.

    For parking that exceeds 24 hours, every full 24-hour chunk is charged 5,000 pesos regardless of the parking slot.

    The remainder hours are charged using the method explained in (2).

    Parking fees are calculated using the rounding up method, e.g. 6.4 hours must be rounded to 7.

3. A vehicle leaving the parking complex and returning within one hour based on their exit time must be charged a continuous rate, i.e. the vehicle must be considered as if it did not leave. Otherwise, rates must be implemented as described. For example, if a vehicle exits at 10:00 and returns at 10:30, the continuous rate must apply.

## Expected Input

You are free to design the system in any pattern you wish. However, take note that the system assumes the input of the following:

1. The number of entry points to the parking complex, but no less than three (3). Assume that the entry points are also exit points, so no need to take into account the number of possible exit points.

2. The map of the parking slot. You are welcome to introduce a design that suits your approach. One suggested method, however, is to accept a list of tuples corresponding to the distance of each slot from every entry point. For example, if your parking system has three (3) entry points. The list of parking spaces may be the following: [(1,4,5), (3,2,3), ...], where the integer entry per tuple corresponds to the distance unit from every parking entry point (A, B, C).

3. The sizes of every corresponding parking slot. Again, you are welcome to introduce your own design. We suggest using a list of corresponding sizes described in integers: [0, 2, 1, 1, ...] where 0, 1, 2 means small, medium, and large in that order. Another useful design may be a dictionary of parking sizes with corresponding slots as values.

4. Two functions to park a vehicle and unpark it. The functions must consider the attributes of the vehicle as described above.
When the unpark function is called, it must also return how much the vehicle concerned is charged.


## Goals

- Complete all the requirements for the exam

- Create an interactive web app for the Parking System 

## Assumptions

Here are some of my personal assumptions and constraints for the system:

### Parking Lot Map

- We will use a 2D table to represent the map of the parking lot. This also helps with the visual representation of the map.

- We will always have the same number of rows and column to make a square map. Instead of getting the number of rows and column from the user, we will get a table size variable to make the table.

- We will also limit the table size to 10 or 100 cells.

### Entry Points

- We will only let the user designate the table's outer cells (edges and sides) as an entry point to mimick a simple parking lot.

- We will limit the maximum number of entry point to twice the table size so that the user cannot designate all the outer cells as an entry point.

### Parking

- We will check the nearest appropriate slot from top-bottom and left-right like the normal 2D table traversal but it will still calculate the distance based on the coordinates.

### Parking Fee

- Unless stated otherwise in the query on my email, we will assume that the 24-hour fee will be override any other fees of that day (including the base rate) and will only compute for the remaining hours.

- As confirmed in my email, the base rate will only apply on the first day. Any remaining hours in the subsequent days will be computed as exceeding hours.

### Returning Vehicles

- ~~Unless stated otherwise in the query on my email, returning vehicles can only return to a similar spot size to its previous spot so that we can retain the same parking fee calculation for its continuous rate. The parking logic still applies to this scenario albeit for the same parking slot size only.~~

- As confirmed in my email, returning vehicles will still follow the current parking logic and will able to park based on its size and the entry point's proximity. The continuous fee will be still be the same calculation logic for the current parking slot size regardless of its previous slot size.

- We assume that user will enter the same vehicle details (license and size) when trying to return and park.

## Improvements

- [ ] Add proper input validations
- [ ] Add styling
- [ ] Improve visual map (include animations?)
- [ ] Add Cypress e2e testing
- [ ] Improve validation on returning vehicles