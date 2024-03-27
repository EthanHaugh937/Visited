import { useEffect, useState } from "react";
import axios from "axios";
import { GetCountryProvinces, GetCountryProvincesResponse } from "../types/types";

export interface GetCountryProvincesProps {
  country: string;
}

export function useGetCountryProvinces({
  country,
}: GetCountryProvincesProps): GetCountryProvincesResponse | undefined {
  const [provinces, setProvinces] = useState<GetCountryProvinces>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (country) {
      axios
        .post("https://countriesnow.space/api/v0.1/countries/states", {
          country: country,
        })
        .then((response) => {
          setProvinces(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [country]);

  return {provinces: provinces, isLoading: isLoading};
}
