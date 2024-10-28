const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

app.post("/proxy/vehicle-enquiry", async (req, res) => {
  const apiUrl =
    "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles";

  try {
    const response = await axios.post(apiUrl, req.body, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "mG1zaRgSH21lGk5mHwqgV6Y4oGkm8UpX5VNbfHoN",
      },
    });

    console.log("Proxy request successful:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error in proxy request:",
      error.message,
      "for request:",
      req.body
    );

    // Send appropriate error response
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : error.message;

    res.status(statusCode).json({
      error: errorMessage,
      message: "Failed to fetch vehicle data",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
