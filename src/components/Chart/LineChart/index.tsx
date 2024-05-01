import React from "react";
import {AreaClosed, LinePath} from "@visx/shape";
import {Group} from "@visx/group";
import {AxisBottom, AxisLeft} from "@visx/axis";
import {LineChartProps} from "./interfaces.ts";
import {AXIS_BOTTOM_TICK_LABEL_PROPS, AXIS_COLOR, AXIS_LEFT_TICK_LABEL_PROPS,} from "./constants.ts";
import {DataProps} from "../../../interfaces/DataProps.ts";

const LineChart: React.FC<LineChartProps> = ({
  data,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  hideBottomAxis = false,
  hideLeftAxis = false,
  stroke,
  top,
  left,
  xTickFormat,
  children,
}) => {
  if (!data) return null;
  // accessors
  const getDate = (d: DataProps) => new Date(d?.date);
  const getStockValue = (d: DataProps) => d?.price;

  if (width < 10) return null;
  return (
    <Group left={left || margin.left} top={top || margin.top}>
      <>
        <AreaClosed
            data={data}
            x={(d) => xScale(getDate(d)) || 0}
            y={(d) => yScale(getStockValue(d)) || 0}
            yScale={yScale} // Ensures the area goes down to the bottom of the chart
            strokeWidth={0} // No border stroke for the area
            stroke="transparent"
            fill="rgba(76, 154, 255, 0.3)" // You can adjust the fill color and opacity as needed
        />
      <LinePath<DataProps>
        data={data}
        x={(d) => xScale(getDate(d)) || 0}
        y={(d) => yScale(getStockValue(d)) || 0}
        strokeWidth={2.5}
        stroke={stroke}
      />

      {!hideBottomAxis && (
        <AxisBottom
          top={yMax + margin.top}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={AXIS_COLOR}
          tickStroke={AXIS_COLOR}
          tickLabelProps={() => AXIS_BOTTOM_TICK_LABEL_PROPS}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={AXIS_COLOR}
          tickStroke={AXIS_COLOR}
          tickLabelProps={() => AXIS_LEFT_TICK_LABEL_PROPS}
          tickFormat={(d) => {
            return xTickFormat ? xTickFormat(d) : d;
          }}
        />
      )}
      {children}
      </>
    </Group>
  );
};

export default LineChart;
