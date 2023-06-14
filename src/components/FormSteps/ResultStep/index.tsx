import { downloadFile } from "@microfrontends-diploma/shared-code";
import { Button, Box } from "@mui/material";
import { useApi } from "src/context/ApiContext";

const ResultStep = () => {
  const api = useApi();

  const handleDownloadResult = () => {
    api.rinexToCsvService.getCalculationsResult().then((res) => downloadFile(res, { outputName: "calc_results", format: "zip" }));
  };

  return <Button variant="contained" onClick={handleDownloadResult}>Скачать результат</Button>;
};

export default ResultStep;
