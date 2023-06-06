import { Box, Button, Checkbox, FormControlLabel, Grid, MenuItem, Select, Typography } from "@mui/material";
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
    api.rinexToCsvService
      .runCalculations({ ...codesState, timestep })
      .then(() => onStepCompleted(true))
      .catch((res) => {
        console.error("error while calculations", res);
        onStepCompleted(false);
      });
  };

  const calculationButtonDisabled = useMemo(() => {
    const codesNotChosen = !Object.keys(codesState).length || !Object.values(codesState).flatMap((val) => val).length;
    const timestepNotChosen = !timestep;
    const equal = isEqual(previousOptions, { codes: codesState, timestep });

    if (codesNotChosen || timestepNotChosen || equal) return true;

    return false;
  }, [codesState, timestep, previousOptions]);

  return (
    <Box>
      <Typography>Выберите опции для рассчета</Typography>
      {availableSystems.map((system) => (
        <Grid key={system.key} container spacing={2}>
          <Grid item xs={12}>
            <Typography>{system.label}</Typography>
          </Grid>

          {codes.map((code) => (
            <Grid key={`${system.key}-${code}`} item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={codesState[system.key] ? codesState[system.key].includes(code) : false}
                    onChange={handleChangeCodeForNavigationSystem(system.key, code)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={code}
              />
            </Grid>
          ))}
        </Grid>
      ))}

      <Box>
        <Typography>Выберите временной промежуток</Typography>
        <Select label='Timestep' value={timestep} onChange={(ev) => setTimestep(ev.target.value as Timestep)}>
          {availableTimesteps.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Button disabled={calculationButtonDisabled} onClick={handleRunCalculations}>
        Рассчитать
      </Button>
    </Box>
  );
};

export default OptionsStep;
