import { fetchCarFromReg } from "./src.js";
const garage = {
  count: 1,
  cars: [
    //  { reg: "AA19AAA" },
    //  { reg: "AA19EEE" },
    //  { reg: "HT24VNA" },
    //  { reg: "SG55FET" },
    //  { reg: "LF08EHV" },
    //  { reg: "RD23EYE" },
    // { reg: "KX69GZS" },
  ],
};

// Cache to store car details
const carDetailsCache = new Map();
const carsToDisplay = [];

const Garage = {
  initForm() {
    const form = document.getElementById("new-vehicle-form");
    form.addEventListener("submit", this.handleFormSubmit.bind(this));
  },

  handleFormSubmit(event) {
    console.log(event);
    const formData = new FormData(event.target);
    const newCar = {
      reg: formData.get("reg"),
    };
    this.add(newCar.reg);
  },
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
    // Check if car already exists
    if (!garage.cars.some((car) => car.reg === reg)) {
      const car = { reg };
      garage.cars.push(car);
      garage.count++;
      console.log("Car added with reg ", reg);
      // Only fetch details for the new car
      this.fetchAndDisplayCars([car]);
    }
    return true;
  },

  async fetchCarDetails(reg) {
    const formattedReg = this.formatRegPlate(reg);

    // Check cache first
    if (carDetailsCache.has(formattedReg)) {
      console.log("Using cached data for reg ", formattedReg);
      return carDetailsCache.get(formattedReg);
    }

    if (!this.isValidRegPlate(formattedReg)) {
      return { error: "Invalid registration" };
    }

    try {
      const returnedBody = await fetchCarFromReg(formattedReg);
      const carInfo = {
        make: returnedBody.make,
        color: returnedBody.colour,
        yearOfManufacture: returnedBody.yearOfManufacture,
        reg: formattedReg,
        image: returnedBody.image,
      };
      // Store in cache
      carDetailsCache.set(formattedReg, carInfo);
      console.log("Car details fetched and cached for reg ", formattedReg);
      return carInfo;
    } catch (error) {
      const errorInfo = {
        error: error.message || "Failed to fetch data",
        reg: formattedReg,
      };
      // Cache errors too to prevent repeated failed requests
      carDetailsCache.set(formattedReg, errorInfo);
      console.error(`Failed to fetch data for ${formattedReg}:`, error);
      return errorInfo;
    }
  },

  async fetchAndDisplayCars(carsToFetch = garage.cars) {
    carsToDisplay.length = 0;
    const uniqueRegs = new Set();

    // Only process unique registrations
    for (const car of carsToFetch) {
      const formattedReg = this.formatRegPlate(car.reg);
      if (!uniqueRegs.has(formattedReg)) {
        uniqueRegs.add(formattedReg);
        const carInfo = await this.fetchCarDetails(formattedReg);
        if (!carInfo.error) {
          carsToDisplay.push(carInfo);
        }
      }
    }

    this.displayCars();
  },

  displayCars() {
    const carInfoDiv = document.getElementById("car-info");
    carInfoDiv.innerHTML = ""; // Clear previous content

    carsToDisplay.forEach((car) => {
      const carElement = document.createElement("div");
      carElement.className = "car";

      const icon = document.createElement("i");
      icon.className = car.error
        ? "fas fa-exclamation-circle error-icon"
        : "fas fa-car car-icon";

      const contentDiv = document.createElement("div");
      contentDiv.className = "car-content";

      if (car.error) {
        contentDiv.innerHTML = `<strong>Registration ${car.reg}:</strong> ${car.error}`;
        carElement.classList.add("error");
      } else {
        contentDiv.innerHTML = `
          <strong>Registration:</strong> ${car.reg}<br>
          <strong>Make:</strong> ${car.make}<br>
          <strong>Color:</strong> <span class="color-swatch" style="background-color: ${car.color};"></span> ${car.color}<br>
          <strong>Year:</strong> ${car.yearOfManufacture}
        `;
      }

      carElement.appendChild(icon);
      carElement.appendChild(contentDiv);
      carInfoDiv.appendChild(carElement);
    });
  },

  delete(reg) {
    const formattedReg = this.formatRegPlate(reg);
    const index = garage.cars.findIndex(
      (car) => this.formatRegPlate(car.reg) === formattedReg
    );
    if (index !== -1) {
      garage.cars.splice(index, 1);
      garage.count--;
      // Remove from cache
      carDetailsCache.delete(formattedReg);
      console.log("Car deleted with reg ", reg);
      this.fetchAndDisplayCars();
      return true;
    }
    console.log("Car not found with reg ", reg);
    return false;
  },

  get(reg) {
    const formattedReg = this.formatRegPlate(reg);
    const car = garage.cars.find(
      (car) => this.formatRegPlate(car.reg) === formattedReg
    );
    if (car) {
      return car;
    }
    console.log("Car not found with reg ", reg);
    return null;
  },
};

export { Garage };
