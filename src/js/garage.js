import { fetchCarFromReg } from "./src.js";

const garage = {
  count: 1,
  cars: [
    { reg: "AA19AAA" },
    { reg: "AA19EEE" },
    { reg: "HT24VNA" },
    { reg: "SG55FET" },
    { reg: "LF08EHV" },
    { reg: "RD23EYE" },
    // { reg: "KX69GZS" },
  ],
};

// Cache to store car details
const carDetailsCache = new Map();
const carsToDisplay = [];

const Garage = {
  initForm() {
    const form = document.getElementById("new-vehicle-form");
    if (form == null) {
      console.error("Form not found");
      return;
    }
    form.addEventListener("submit", this.handleFormSubmit.bind(this));
  },

  async handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const reg = formData.get("reg");

    if (!this.isValidRegPlate(reg)) {
      this.displayMessage(
        "Invalid registration number format. It should be 2 letters, 2 numbers, then 3 letters (e.g., AB12CDE).",
        "error"
      );
      return;
    }

    const carExists = await this.fetchCarDetails(reg);
    if (carExists.error) {
      this.displayMessage(
        `Registration number ${reg} does not exist.`,
        "error"
      );
      return;
    }

    if (this.add(reg)) {
      this.displayMessage(
        `Vehicle with registration ${reg} added successfully.`,
        "success"
      );
      event.target.reset(); // Clear the form
    } else {
      this.displayMessage(
        `Vehicle with registration ${reg} already exists.`,
        "error"
      );
    }
  },

  displayMessage(message, type) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;

    const form = document.getElementById("new-vehicle-form");
    form.appendChild(messageElement);

    // Remove the message after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 15000);
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
      console.log("Invalid registration plate", reg);
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
        status: 404,
      };
      // Cache errors too to prevent repeated failed requests
      carDetailsCache.set(formattedReg, errorInfo);
      console.error(`Failed to fetch data for ${formattedReg}:`, error);
      console.log("ErrorMessage: ", errorInfo);
      return errorInfo;
    }
  },

  async fetchAndDisplayCars(carsToFetch = garage.cars) {
    const uniqueRegs = new Set(carsToDisplay.map((car) => car.reg));

    // Only process unique registrations
    for (const car of carsToFetch) {
      const formattedReg = this.formatRegPlate(car.reg);
      if (!uniqueRegs.has(formattedReg)) {
        uniqueRegs.add(formattedReg);
        const carInfo = await this.fetchCarDetails(formattedReg);
        if (!carInfo.error) {
          carsToDisplay.push(carInfo); // Only add new car data
        } else if (carInfo.error.status === 404) {
          return carInfo;
        }
      }
    }

    this.displayCars();
  },

  displayCars() {
    console.log("Displaying cars:", carsToDisplay); // Check how often this is called
    const carImages = [
      "/image/car1.jpg",
      "/image/car2.jpg",
      "/image/car3.jpg",
      "/image/car4.jpg",
      "/image/car5.jpg",
      "/image/car6.jpg",
      "/image/car7.jpg",
      "/image/car8.jpg",
    ];

    const carInfoDiv = document.getElementById("car-info");

    if (carInfoDiv != null) {
      carInfoDiv.innerHTML = "";
    } // Clear previous content

    carsToDisplay.forEach((car) => {
      const carElement = document.createElement("div");
      carElement.className = "car";

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.innerHTML = "×";
      deleteButton.addEventListener("click", () => this.handleDelete(car.reg));

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

      const carImage = document.createElement("img");
      carImage.className = "car-image";
      const randomIndex = Math.floor(Math.random() * carImages.length);
      carImage.src = carImages[randomIndex]; // Updated path
      carImage.alt = `${car.make} image`;

      carElement.appendChild(deleteButton);
      carElement.appendChild(icon);
      carElement.appendChild(contentDiv);
      carElement.appendChild(carImage); // Add image to the right side
      if (carInfoDiv != null) {
        carInfoDiv.appendChild(carElement);
      }
    });
  },

  handleDelete(reg) {
    console.log("Deleting car with reg ", reg);
    if (this.delete(reg)) {
      this.displayCars(); // Only update display if deletion was successful
    }
  },

  delete(reg) {
    const formattedReg = this.formatRegPlate(reg);

    const garageIndex = garage.cars.findIndex(
      (car) => this.formatRegPlate(car.reg) === formattedReg
    );

    const displayIndex = carsToDisplay.findIndex(
      (car) => this.formatRegPlate(car.reg) === formattedReg
    );

    if (garageIndex !== -1 && displayIndex !== -1) {
      garage.cars.splice(garageIndex, 1);
      carsToDisplay.splice(displayIndex, 1);
      garage.count--;

      carDetailsCache.delete(formattedReg);
      console.log("Car deleted with reg ", reg);
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
