import { Box, Button, Checkbox, FormControlLabel, Grid, LinearProgress, MenuItem, Select, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { Timestep } from "./types";
import { availableSystems, availableTimesteps, codes } from "./constants";
import { FormStepsCommonProps } from "../types";
import { useApi } from "src/context/ApiContext";
import { NavigationMeasurementEnum, RinexToCSVNavigationOptions } from "src/api/dto/rinex-to-csv.dto";
import { isEqual } from "lodash";

const OptionsStep = ({ onStepCompleted }: FormStepsCommonProps) => {
  const [codesState, setCodesState] = useState<RinexToCSVNavigationOptions>({
    g_signals: [],
    e_signals: [],
    c_signals: [],
    r_signals: [],
    s_signals: [],
  });
  const [timestep, setTimestep] = useState<Timestep>(30);
  const [previousOptions, setPreviousOptions] = useState<{ codes: RinexToCSVNavigationOptions; timestep: Timestep } | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);

  const api = useApi();

  const handleChangeCodeForNavigationSystem = (system: keyof RinexToCSVNavigationOptions, code: NavigationMeasurementEnum) => () => {
    setCodesState((prevState) => {
      let systemPrevCodes = prevState[system] || [];

      if (systemPrevCodes.includes(code)) {
        systemPrevCodes = systemPrevCodes.filter((val) => val !== code);
      } else {
        systemPrevCodes.push(code);
      }

      return {
        ...prevState,
        [system]: systemPrevCodes.sort(),
      };
    });
  };

  const handleRunCalculations = () => {
    setPreviousOptions({ codes: codesState, timestep });
    setCalculating(true);

    api.rinexToCsvService
      .runCalculations({ ...codesState, timestep })
      .then(() => onStepCompleted(true))
      .catch((res) => {
        console.error("error while calculations", res);
        onStepCompleted(false);
      }).finally(() => setCalculating(false));
  };

  const calculationButtonDisabled = useMemo(() => {
    const codesNotChosen = !Object.keys(codesState).length || !Object.values(codesState).flatMap((val) => val).length;
    const timestepNotChosen = !timestep;
    const equal = isEqual(previousOptions, { codes: codesState, timestep });

    return codesNotChosen || timestepNotChosen || equal || calculating;
  }, [codesState, timestep, previousOptions, calculating]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h6">Выберите опции для расчета:</Typography>
      </Grid>

      <Grid item xs={12}>
        {availableSystems.map((system) => (
          <Box sx={{mb: '10px'}}>
            <Typography sx={{color: 'primary.main', fontWeight: 600}}>{system.label}</Typography>

            {codes.map((code) => (
                <FormControlLabel
                  key={`${system.key}-${code}`}
                  control={
                    <Checkbox
                      disabled={calculating}
                      checked={codesState[system.key] ? codesState[system.key].includes(code) : false}
                      onChange={handleChangeCodeForNavigationSystem(system.key, code)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label={code}
                />
            ))}
          </Box>
        ))}
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6">Выберите временной промежуток</Typography>
      </Grid>

      <Grid item xs={12}>
        <Select sx={{minWidth: '150px'}} label='Timestep' disabled={calculating} value={timestep} onChange={(ev) => setTimestep(ev.target.value as Timestep)}>
          {availableTimesteps.map((value) => (
            <MenuItem key={value} value={value}>
              {value} сек.
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" disabled={calculationButtonDisabled} onClick={handleRunCalculations}>
          Рассчитать
        </Button>
      </Grid>

      {calculating && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6">Подождите, происходит расчет...</Typography>
          </Grid>
          <Grid item xs={6}>
            <LinearProgress/>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default OptionsStep;
