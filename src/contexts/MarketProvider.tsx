import React, {ReactNode} from "react";
import {DataProps} from "../interfaces/DataProps.ts";

export interface MarketContextProps {
  filteredDataState: {
    filteredData: DataProps[];
    setFilteredData: React.Dispatch<React.SetStateAction<DataProps[]>>;
  };
}

export const MarketContext = React.createContext<MarketContextProps>({
  filteredDataState: {
    filteredData: [],
    setFilteredData: () => {},
  },
});

const MarketProvider = ({ children }: {children: ReactNode}) => {
  const [filteredData, setFilteredData] = React.useState<DataProps[]>([]);

  return (
    <MarketContext.Provider
      value={{
        filteredDataState: { filteredData, setFilteredData },
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export default MarketProvider;
