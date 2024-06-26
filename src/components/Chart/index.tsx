import React, { useMemo, useCallback } from "react";
import { format } from "date-fns";
import numeral from "numeral";
import {
    useTooltip,
    TooltipWithBounds,
    defaultStyles as defaultToopTipStyles,
} from "@visx/tooltip";
import { scaleLinear, scaleTime } from "@visx/scale";
import { localPoint } from "@visx/event";
import { Line, Bar } from "@visx/shape";
import { max, min, extent, bisector } from "d3-array";
import {DataProps} from "../../interfaces/DataProps.ts";
import LineChart from "./LineChart";
import {Colors} from "../../enums/colors.ts";
import {PrimaryChartProps} from "./PrimaryChart/interfaces.ts";

// accessors
const getDate = (d: DataProps) => new Date(d.date);
const getStockValue = (d: DataProps) => d?.price || 0;
const getFormatValue = (d: DataProps) =>
    numeral(d?.price || 0).format("$0,0.00");
const bisectDate = bisector<DataProps, Date>((d) => new Date(d.date)).left;

const PriceChartMain: React.FC<PrimaryChartProps> = ({data, width = 10, height, margin = { top: 0, right: 0, bottom: 0,left: 0 },}) => {
    const {
        showTooltip,
        hideTooltip,
        tooltipData,
        tooltipTop = 0,
        tooltipLeft = 0,
    } = useTooltip<DataProps>();

    // bounds
    const xMax = Math.max(width - margin.left - margin.right, 0);
    const yMax = Math.max(height - margin.top - margin.bottom, 0);

    // scales
    const dateScale = useMemo(() => {
        return scaleTime({
            range: [0, xMax],
            domain: extent(data, getDate) as [Date, Date],
        });
    }, [xMax, data]);
    const priceScale = useMemo(() => {
        return scaleLinear({
            range: [yMax + margin.top, margin.top],
            domain: [min(data, getStockValue) || 0, max(data, getStockValue) || 0],
            nice: true,
        });
        //
    }, [margin.top, yMax, data]);

    // tooltip handler
    const handleTooltip = useCallback(
        (
            event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
        ) => {
            const { x } = localPoint(event) || { x: 0 };
            const currX = x - margin.left;
            const x0 = dateScale.invert(currX);
            const index = bisectDate(data, x0, 1);
            const d0 = data[index - 1];
            const d1 = data[index];
            let d = d0;

            // calculate the cursor position and convert where to position the tooltip box.
            if (d1 && getDate(d1)) {
                d =
                    x0.valueOf() - getDate(d0).valueOf() >
                    getDate(d1).valueOf() - x0.valueOf()
                        ? d1
                        : d0;
            }

            showTooltip({
                tooltipData: d,
                tooltipLeft: x,
                tooltipTop: priceScale(getStockValue(d)),
            });
        },
        [showTooltip, priceScale, dateScale, data, margin.left]
    );

    return (
        <div style={{ position: "relative", margin: "0 0 1rem" }}>
            <svg width={width} height={height}>
                <LineChart
                    data={data}
                    width={width}
                    margin={{ ...margin }}
                    yMax={yMax}
                    xScale={dateScale}
                    yScale={priceScale}
                    stroke={Colors.lapislazuli}
                    xTickFormat={(d) => {
                        return numeral(d).format(d <= 100 ? "$0.00" : "$0,0");
                    }}

                />

                {/* a transparent ele that track the pointer event, allow us to display tooltup */}
                <Bar
                    x={margin.left}
                    y={margin.top * 2}
                    width={xMax}
                    height={yMax}
                    fill="transparent"
                    rx={14}
                    onTouchStart={handleTooltip}
                    onTouchMove={handleTooltip}
                    onMouseMove={handleTooltip}
                    onMouseLeave={() => hideTooltip()}
                />
                {/* drawing the line and circle indicator to be display in cursor over a
          selected area */}
                {tooltipData && (
                    <g>
                        <Line
                            from={{ x: tooltipLeft, y: margin.top * 2 }}
                            to={{ x: tooltipLeft, y: yMax + margin.top * 2 }}
                            stroke={Colors.primary}
                            strokeWidth={2}
                            opacity={0.5}
                            pointerEvents="none"
                            strokeDasharray="5,2"
                        />
                        <circle
                            cx={tooltipLeft}
                            cy={tooltipTop + 1 + margin.top}
                            r={4}
                            fill="black"
                            fillOpacity={0.1}
                            stroke="black"
                            strokeOpacity={0.1}
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                        <circle
                            cx={tooltipLeft}
                            cy={tooltipTop + margin.top}
                            r={4}
                            fill={Colors.lapislazuli}
                            stroke="white"
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                    </g>
                )}
            </svg>
            {tooltipData && (
                <div>
                    <TooltipWithBounds
                        key={Math.random()}
                        top={tooltipTop - 12}
                        left={tooltipLeft}
                        style={{
                            ...defaultToopTipStyles,
                            background: Colors.lapislazuli,
                            padding: "0.5rem",
                            border: "1px solid white",
                            color: "white",
                        }}
                    >
                        <ul style={{ padding: "0", margin: "0", listStyle: "none" }}>
                            <li style={{ paddingBottom: "0.25rem" }}>
                                <b>{format(getDate(tooltipData), "PPpp")}</b>
                            </li>
                            <li>
                                Price: <b>{`${getFormatValue(tooltipData)}`}</b>
                            </li>
                        </ul>
                    </TooltipWithBounds>
                </div>
            )}
        </div>
    );
};

export default PriceChartMain;
