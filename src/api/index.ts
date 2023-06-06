import axios from "axios";
import RinexToCSVService from "./services";

// TODO: общий функционал, надо вынести (??)
// FIXME: эта штука создается где?
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "https://services.simurg.space/rinex-to-csv",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export class Api {
  rinexToCsvService: RinexToCSVService | null = null;

  constructor() {
    this.rinexToCsvService = new RinexToCSVService(axiosInstance);
  }
}

export default Api;
