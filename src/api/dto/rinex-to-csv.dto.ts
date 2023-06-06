export type FileUploadServerResponse = {
  filename: string;
  proc_id: string;
};

export type CalculationsRunServerResponse = {
  // TODO: узнать все статусы ответа
  status: string;
  nav: string;
  obs: string;
};

// TODO: возможно эти статусы можно будет получать с бэка
export enum NavigationMeasurementEnum {
  L1C = "L1C",
  C1C = "C1C",
  L2I = "L2I",
  C2I = "C2I",
}

export type RinexToCSVNavigationOptions = {
  g_signals: NavigationMeasurementEnum[];
  e_signals: NavigationMeasurementEnum[];
  c_signals: NavigationMeasurementEnum[];
  r_signals: NavigationMeasurementEnum[];
  s_signals: NavigationMeasurementEnum[];
};

export type RinexToCSVCalculationOptions = {
  timestep: number;
} & RinexToCSVNavigationOptions;
