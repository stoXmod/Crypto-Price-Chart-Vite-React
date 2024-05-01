import React from "react";
import {UseOptionalControlledStateProps, UseOptionalControlledStateResponse,} from "./interfaces";

export default function useOptionalControlledState<Value>({
  controlledValue,
  initialValue,
  onChange,
}: UseOptionalControlledStateProps<Value>): UseOptionalControlledStateResponse<Value> {
  const isControlled = controlledValue !== undefined;
  const [stateValue, setStateValue] = React.useState(initialValue);

  const value = isControlled ? controlledValue : stateValue;

  const onValueChange = (nextValue: Value) => {
    if (!isControlled) setStateValue(nextValue);
    if (onChange) onChange(nextValue);
  };

  return [value, onValueChange];
}
