import { Garage } from "./garage.js";

import "./../css/style.css";
import "./src.js";

const garageLoadedEvent = new Event("garage-loaded");

function init() {
  //garage.delete("DR13NGH");
  const cars = [
    // { reg: "AA19 PPP" }, // does not exist
    {}, // does not exist
    // { reg: "ER19BAD" }, // does not exist
    // { reg: "ER19 NFD" }, // does not exist
    // { reg: "L2WPS" }, // does not exist
    // { reg: "AA19 SRN" }, // does not exist
    // { rag: "AA19 SRN" }, // does not exist
    // { reg: "TE57VRN" }, // does not exist
  ];
  cars.forEach((car) => {
    garage.add(car.reg);
  });
  // const del_res = garage.delete("AA19EEE");
  // console.log("T1: ", del_res);
  // console.log("T2: ", garage.get("DR13NGH"));
  // console.log("T3: ", garage.get("AA19SRN")["reg"] == "AA19SRN");
  window.dispatchEvent(garageLoadedEvent);
  console.log("Garage Loaded");
}

window.addEventListener("load", init);
document.addEventListener("DOMContentLoaded", () => {});
