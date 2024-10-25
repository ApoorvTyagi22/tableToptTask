const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.post("/proxy/vehicle-enquiry", (req, res) => {
  const apiUrl =
    "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles";

  axios
    .post(apiUrl, req.body, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "mG1zaRgSH21lGk5mHwqgV6Y4oGkm8UpX5VNbfHoN",
      },
    })
    .then((response) => {
      console.log("Proxy request successful:", response.data);
      return response.json();
    })
    .catch((error) => {
      res.status(error.response ? error.response.status : 500).json({
        error: error.message,
      });
      console.error("Error in proxy request:", error, "for request:", req.body);
    });
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
