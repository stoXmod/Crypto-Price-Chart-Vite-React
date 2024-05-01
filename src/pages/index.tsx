import React from "react";
import {Alert, CircularProgress, Container, Grid, Snackbar} from '@mui/material'
import useAxios from "axios-hooks";
import {MarketContext} from "../contexts/MarketProvider.tsx";
import useWindowDimensions from "../hooks/useWindowDimensions";
import {DataProps} from "../interfaces/DataProps.ts";
import PrimaryChart from "../components/Chart/PrimaryChart";
import SecondaryChart from "../components/Chart/SecondaryChart";
import TimeFilterButtons from "../components/Chart/TimeFilterButtons";
import './index.scss'

const PriceChart = () => {
    const {
        filteredDataState: { filteredData },
    } = React.useContext(MarketContext);

    const [timeFilter, setTimeFilter] = React.useState<string>("1");
    const [isErrorMessage, setIsErrorMessage] = React.useState<string>("");
    const [boxWidth, setBoxWidth] = React.useState<number>(0);
    const { height } = useWindowDimensions();
    const [{ data, loading, error }, fetch] = useAxios<
        { prices: [number, number][] },
        { message: string }
    >(
        {
            url: `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${timeFilter}`,
            method: "GET",
        },
        { manual: true }
    );
    const gridItemRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        console.log('🚀 hfdkjhfjksdhfdskfjh')
        fetch();
    }, [timeFilter]);

    React.useEffect(() => {
        if (error) {
            setIsErrorMessage(error.message);
        }
    }, [error]);

    React.useEffect(() => {
        const handleResize = (width?: number) => {
            setBoxWidth(width || 0);
        };

        handleResize(gridItemRef.current?.clientWidth || 0);

        window.addEventListener("resize", () =>
            handleResize(gridItemRef?.current?.clientWidth || 0)
        );

        return () => {
            window.removeEventListener("resize", () => handleResize());
        };
    }, [gridItemRef]);

    const mappedData: DataProps[] = React.useMemo(() => {
        return data
            ? data?.prices.map((ele:
                [number, number]
            ) => ({
                date: new Date(ele[0]).toString(),
                price: ele[1],
            }))
            : [];
    }, [data]);


    return (
        <Container style={{width: 1000, height: 800}}>
            <Grid ref={gridItemRef} style={{userSelect: 'none'}} item xs={12} md={10} lg={8}>
                <div className={'header'}>
                    <div className={'title'}>Bitcoin</div>
                    <TimeFilterButtons
                        value={timeFilter}
                        onChange={(v) => setTimeFilter(v || "")}
                    />
                </div>
                {loading ? (
                    <div style={{display: 'flex', height: 500, alignItems: 'center'}}>
                    <CircularProgress
                        size={24}
                        style={{ margin: 'auto', color: 'black' }}
                    />
                    </div>
                ) : mappedData?.length ? (
                    <>
                        <PrimaryChart
                            data={filteredData ?? []}
                            height={Math.floor(height * 0.4)}
                            width={boxWidth}
                            margin={{
                                top: 16,
                                right: 16,
                                bottom: 40,
                                left: 48,
                            }}
                        />
                        <SecondaryChart
                            data={mappedData ?? []}
                            height={Math.floor(height * 0.1)}
                            width={boxWidth}
                            margin={{
                                top: 0,
                                right: 16,
                                bottom: 24,
                                left: 48,
                            }}
                        />
                    </>
                ) : null}
            </Grid>
            <Snackbar open={!!isErrorMessage}>
                <Alert severity="error">
                    {isErrorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PriceChart;
