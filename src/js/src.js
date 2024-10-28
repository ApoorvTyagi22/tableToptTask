import { Garage } from "./garage.js";

window.addEventListener("garage-loaded", start, false);
function start() {
  console.log("Garage Loaded");
}
async function fetchCarFromReg(reg) {
  console.log("Fetching car from reg:", reg);
  try {
    const apiUrl = "http://localhost:3000/proxy/vehicle-enquiry";
    const payload = {
      registrationNumber: reg,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if response status is okay
    if (!response.ok) {
      // This checks for 2xx responses
      if (response.status === 404) {
        throw new Error(
          " A car for the give registration number was not found"
        );
      }
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse and return the response
    const responseData = await response.json();
    console.log("Proxy request successful:", responseData);
    return responseData; // Make sure to return this
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error,
      "for reg:",
      reg
    );
    throw error;
  }
}
window.addEventListener("load", () => {
  // Initialize and fetch all cars when the page loads
  console.log("Garage loaded");
  Garage.initForm(); // Initialize theq form
  Garage.fetchAndDisplayCars(); // Fetch all cars and display them
});
export { fetchCarFromReg };
