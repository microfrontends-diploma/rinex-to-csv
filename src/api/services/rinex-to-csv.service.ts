import { AxiosRequestConfig } from "axios";
import { CalculationsRunServerResponse, FileUploadServerResponse, RinexToCSVCalculationOptions } from "../dto/rinex-to-csv.dto";
import { ExtendedAxiosConfig, NetworkService } from "./network.service";

export class RinexToCSVService extends NetworkService {
  uploadFile = (data: FormData, type: "rinex" | "nav", config?: ExtendedAxiosConfig) => {
    return this.post<FormData, FileUploadServerResponse>(type === "rinex" ? "/upload_rinex" : "/upload_nav", data, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  };

  runCalculations = (calculationOptions: RinexToCSVCalculationOptions, config?: ExtendedAxiosConfig) => {
    return this.post<RinexToCSVCalculationOptions, CalculationsRunServerResponse>("/run", calculationOptions, { ...config });
  };

  getCalculationsResult = (config?: ExtendedAxiosConfig) => {
    return this.get<any>("/get_result", {
      ...config,
      responseType: "arraybuffer",
    });
  };
}
