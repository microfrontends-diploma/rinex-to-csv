import { AppProps } from "single-spa";
import { AppPropsProvider } from "./context/AppPropsContext";
import { ApiProvider } from "./context/ApiContext";
import RinexToCSVContent from "./views/PageContent";
import { Container, Grid, Typography } from "@mui/material";

function Root(props: AppProps) {
  return (
    <AppPropsProvider props={props}>
      <ApiProvider>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h3'>Rinex To CSV</Typography>
            </Grid>

            <Grid item xs={12}>
              <RinexToCSVContent />
            </Grid>
          </Grid>
        </Container>
      </ApiProvider>
    </AppPropsProvider>
  );
}

export default Root;
