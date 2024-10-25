import { fetchCarFromReg } from "./src.js";

const garage = {
  count: 1,
  cars: [{ reg: "AA19 AAA" }, { reg: "AA19EEE" }, {}], // Sample cars
};

const carsToDisplay = [{}];

const Garage = {
  isValidRegPlate(reg) {
    const regPattern = /^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$/;
    return regPattern.test(this.formatRegPlate(reg));
  },
  formatRegPlate(reg) {
    if (typeof reg !== "string") {
      console.log("Invalid input: registration plate must be a string: ", reg);
      return "";
    }
    return reg.replace(/\s/g, "").toUpperCase();
  },
  add(reg) {
    reg = this.formatRegPlate(reg);
    if (!this.isValidRegPlate(reg)) {
      console.log("Invalid registration plate");
      return false;
    }
    const car = { reg };
    garage.cars.push(car);
    garage.count++;
    console.log("Car added with reg ", reg);
    return true;
  },
  async fetchAllCars() {
    const carDetails = await Promise.all(
      garage.cars.map(async (car) => {
        const formattedReg = this.formatRegPlate(car.reg);
        if (this.isValidRegPlate(formattedReg)) {
          try {
            const returnedBody = await fetchCarFromReg(formattedReg);
            const carInfo = {
              make: returnedBody.make,
              color: returnedBody.colour,
              yearOfManufacture: returnedBody.yearOfManufacture,
            };
            console.log(
              "Car details,",
              carInfo,
              "fetched for reg ",
              formattedReg
            );
            carsToDisplay.push(carInfo);
          } catch (error) {
            console.error(`Failed to fetch data for ${formattedReg}:`, error);
            return { ...car, error: "Failed to fetch data" };
          }
        } else {
          return { ...car, error: "Invalid registration" };
        }
      })
    );
    this.displayCars();
  },
  displayCars() {
    const carInfoDiv = document.getElementById("car-info");
    carInfoDiv.innerHTML = ""; // Clear previous content

    carsToDisplay.forEach((car) => {
      if (!car.make) return;
      const carElement = document.createElement("div");
      carElement.className = "car";
      if (car.error) {
        carElement.textContent = `Error: ${car.error}`;
      } else {
        carElement.textContent = `Make: ${car.make}, Color: ${car.color}, Year: ${car.yearOfManufacture}`;
      }
      carInfoDiv.appendChild(carElement);
    });
  },
  delete(reg) {
    const index = garage.cars.findIndex((car) => car.reg === reg);
    if (index !== -1) {
      garage.cars.splice(index, 1); // Properly remove the car
      garage.count--;
      console.log("Car deleted with reg ", reg);
      return true;
    }
    console.log("Car not found with reg ", reg);
    return false;
  },
  get(reg) {
    const car = garage.cars.find((car) => car.reg === reg);
    if (car) {
      return car;
    }
    console.log("Car not found with reg ", reg);
    return null;
  },
};

export { Garage };
