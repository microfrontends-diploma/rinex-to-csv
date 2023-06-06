import { NavigationMeasurementEnum, RinexToCSVNavigationOptions } from "src/api/dto/rinex-to-csv.dto";
import { Timestep } from "./types";

export const availableSystems: Array<{ key: keyof RinexToCSVNavigationOptions; label: string }> = [
  { key: "g_signals", label: "GPS" },
  { key: "r_signals", label: "GLONASS" },
  { key: "e_signals", label: "Galileo" },
  { key: "c_signals", label: "BeiDou" },
  { key: "s_signals", label: "SBAS" },
];

// TODO: скорее всего эти коды надо будет получать с отдельного эндпоинта
export const codes: NavigationMeasurementEnum[] = [
  NavigationMeasurementEnum.L1C,
  NavigationMeasurementEnum.C1C,
  NavigationMeasurementEnum.L2I,
  NavigationMeasurementEnum.C2I,
];

export const availableTimesteps: Timestep[] = [10, 30, 60, 120];
