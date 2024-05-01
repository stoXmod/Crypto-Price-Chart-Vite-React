import React from "react";
import {ToggleButton, ToggleButtonGroup} from '@mui/material';
import {TimeFilters} from "../../../enums/TimeFilters.ts";
import useOptionalControlledState from "../../../hooks/useOptionalControlledState";

export const TimePeriod: {
  [key: string]: TimeFilters;
} = {
  "1D": TimeFilters.P1D,
  "7D": TimeFilters.P7D,
  "1M": TimeFilters.P1M,
  "3M": TimeFilters.P3M,
  "1Y": TimeFilters.P1Y,
  ALL: TimeFilters.ALL,
};

export const TimeFilterButtons: React.FC<{
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
}> = ({ value, onChange }) => {
  const [filter, setFilter] = useOptionalControlledState<string | undefined>({
    controlledValue: value,
    initialValue: TimeFilters.P1D,
    onChange,
  });

  return (
    <ToggleButtonGroup
      size="small"
      value={filter}
      exclusive
      onChange={(_event, value) => {
        setFilter(value);
      }}
      color="primary"
      aria-label="outlined primary button group"
    >
      {Object.keys(TimePeriod).map((t) => {
        return (
          <ToggleButton key={t} value={TimePeriod[t]}>
            {t}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
};

export default TimeFilterButtons;
