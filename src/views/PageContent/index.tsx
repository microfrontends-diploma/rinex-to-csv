import { useMemo, useState } from "react";
import Stepper from "@mui/material/Stepper";
import { Box, Button, Grid, Step, StepLabel } from "@mui/material";
import { RinexToCSVSteps } from "./types";
import { steps, stepsDisabledInitialState } from "./constants";
import FilesStep from "src/components/FormSteps/FilesStep";
import OptionsStep from "src/components/FormSteps/OptionsStep";
import ResultStep from "src/components/FormSteps/ResultStep";

const RinexToCSVContent = () => {
  const [currentStep, setCurrentStep] = useState<RinexToCSVSteps>(RinexToCSVSteps.FILES);
  const [stepsDisabledState, setStepsDiabledState] = useState<Record<RinexToCSVSteps, boolean>>(stepsDisabledInitialState);

  const handleChangeStepState = (step: RinexToCSVSteps) => (completed: boolean) => {
    const nextStep = step + 1;
    setStepsDiabledState((prevState) => ({
      ...prevState,
      [nextStep]: !completed,
    }));
  };

  const handleReset = () => {
    setCurrentStep(RinexToCSVSteps.FILES);
    setStepsDiabledState(stepsDisabledInitialState);
  };

  const handleNextStep = () => setCurrentStep((prevStep) => prevStep + 1);

  const formContent = useMemo(() => {
    switch (currentStep) {
      case RinexToCSVSteps.FILES:
        return <FilesStep onStepCompleted={handleChangeStepState(RinexToCSVSteps.FILES)} />;
      case RinexToCSVSteps.OPTIONS:
        return <OptionsStep onStepCompleted={handleChangeStepState(RinexToCSVSteps.OPTIONS)} />;
      case RinexToCSVSteps.RESULT:
        return <ResultStep />;
    }
  }, [currentStep]);

  const nextStepDisabled = useMemo(() => {
    switch (currentStep) {
      case RinexToCSVSteps.FILES:
        return stepsDisabledState[RinexToCSVSteps.OPTIONS];
      case RinexToCSVSteps.OPTIONS:
        return stepsDisabledState[RinexToCSVSteps.RESULT];
    }
  }, [currentStep, stepsDisabledState]);

  return (
    <Box>
      <Stepper activeStep={currentStep}>
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {formContent}
      <Grid container spacing={1}>
        {currentStep === RinexToCSVSteps.RESULT && (
          <Grid item xs={4}>
            <Button onClick={handleReset}>Вернуться к загрузке файлов</Button>
          </Grid>
        )}
        {currentStep !== RinexToCSVSteps.RESULT && (
          <Grid item xs={2}>
            <Button disabled={nextStepDisabled} onClick={handleNextStep}>
              Следующий шаг
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default RinexToCSVContent;
