import { DataProps } from "../../../interfaces/DataProps.ts";

export interface PrimaryChartProps {
  data: DataProps[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export type TooltipData = DataProps;
