import { RinexToCSVSteps } from "./types";

export const steps = ["Загрузите файлы", "Выберите опции для рассчета", "Получите результат"];

export const stepsDisabledInitialState: Record<RinexToCSVSteps, boolean> = {
  [RinexToCSVSteps.FILES]: false,
  [RinexToCSVSteps.OPTIONS]: true,
  [RinexToCSVSteps.RESULT]: true,
};
