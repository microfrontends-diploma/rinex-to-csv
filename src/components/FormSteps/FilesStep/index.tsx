import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { validate } from "./utils";
import { FileUploadServerResponse } from "src/api/dto/rinex-to-csv.dto";
import { FormStepsCommonProps } from "../types";
import { useApi } from "src/context/ApiContext";
import { FileChangeFunction, FileUploader, FileUploaderStatuses } from "@microfrontends-diploma/shared-code";
import "@microfrontends-diploma/shared-code/dist/esm/index.css";

function FilesStep({ onStepCompleted }: FormStepsCommonProps) {
  const [rinexFileUploaded, setRinexFileUploaded] = useState<boolean>(false);
  const [navFileUploaded, setNavFileUploaded] = useState<boolean>(false);

  const api = useApi();

  useEffect(() => {
    onStepCompleted(rinexFileUploaded && navFileUploaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rinexFileUploaded, navFileUploaded]);

  const onFileChanged =
    (type: "rinex" | "nav"): FileChangeFunction =>
    (fileList, { setFilesState }, filesState) => {
      type === "rinex" ? setRinexFileUploaded(false) : setNavFileUploaded(false);

      if (fileList.length) {
        const file = fileList[0];

        if (!filesState[file.name].error.error) {
          setFilesState((prevState) => ({
            ...prevState,
            [file.name]: {
              ...prevState[file.name],
              status: FileUploaderStatuses.UPLOADING,
            },
          }));

          file.arrayBuffer().then((arrayBuffer) => {
            const formData = new FormData();
            formData.append("rinex", new Blob([new Uint8Array(arrayBuffer)]), file.name);

            api.rinexToCsvService
              .uploadFile(formData, type)
              .then((response: FileUploadServerResponse) => {
                type === "rinex" ? setRinexFileUploaded(true) : setNavFileUploaded(true);
                setFilesState((prevState) => ({
                  ...prevState,
                  [file.name]: {
                    error: { error: false },
                    status: FileUploaderStatuses.UPLOADING_SUCCESS,
                  },
                }));
              })
              .catch((err) => {
                console.error("Error appeared during uploading file", err);
                setFilesState((prevState) => ({
                  ...prevState,
                  [file.name]: {
                    error: {
                      error: true,
                      message: "Error appeared during uploading file",
                    },
                    status: FileUploaderStatuses.UPLOADING_FAIL,
                  },
                }));
              });
          });
        }
      }
    };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{mb: '10px'}}>Загрузите Rinex файл:</Typography>
        <FileUploader id='rinexFile' onChange={onFileChanged("rinex")} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" sx={{mb: '10px'}}>Загрузите Nav файл:</Typography>
        <FileUploader id='navFile' onChange={onFileChanged("nav")} />
      </Grid>
    </Grid>
  );
}

export default FilesStep;
