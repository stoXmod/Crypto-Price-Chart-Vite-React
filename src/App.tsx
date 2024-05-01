import {Route, Routes} from "react-router-dom";
import './App.css'
import PriceChart from "./pages";
import MarketProvider from "./contexts/MarketProvider.tsx";

function App() {
    return (
        <>
            <MarketProvider>
            <Routes>
                <Route path={'/'} element={<PriceChart/>}/>
            </Routes>
            </MarketProvider>
        </>
    )
}

export default App;

