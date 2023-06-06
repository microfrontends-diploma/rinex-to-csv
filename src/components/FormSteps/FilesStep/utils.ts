import { FileError } from "@microfrontends-diploma/shared-code";

// FIXME: нужна ли вообще эта функция (??)
export const validate = (type: "rinex" | "nav") => (file: File) => {
  const extension = file.name.split(".").pop();

  const error: FileError = {
    error: false,
  };

  if ((extension === "rnx" && type === "nav") || (extension === "21o" && type === "rinex")) {
    error.error = true;
    error.message = "Некорректное разрешение файла";
  }

  return error;
};
