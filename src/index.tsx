import { AppProps } from "single-spa";
import { AppPropsProvider } from "./context/AppPropsContext";
import { ApiProvider } from "./context/ApiContext";
import RinexToCSVContent from "./views/PageContent";
import { Container, Typography } from "@mui/material";

function Root(props: AppProps) {
  return (
    <AppPropsProvider props={props}>
      <ApiProvider>
        <Container>
          <Typography variant='h3'>Rinex To CSV</Typography>
          <RinexToCSVContent />
        </Container>
      </ApiProvider>
    </AppPropsProvider>
  );
}

export default Root;
