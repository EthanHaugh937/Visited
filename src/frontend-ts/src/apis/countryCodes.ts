import { useEffect, useState } from "react";
import axios from "axios";
import { GetCountryProvincesResponse } from "../types/types";

export interface GetCountryProvincesProps {
  country: string;
}

export function GetCountryProvinces({ country }: GetCountryProvincesProps) {
  const [provinces, setProvinces] = useState<GetCountryProvincesResponse>();

  useEffect(() => {
    if (country) {
      axios
        .post("https://countriesnow.space/api/v0.1/countries/states", {
          country: country,
        })
        .then((response) => {
          setProvinces(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [country]);

  return provinces;
}
