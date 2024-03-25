import { useEffect, useState } from "react";
import axios from "axios";
import { GetCountriesResponse } from "../types/types";

export function GetCountries() {
  const [countries, setCountries] = useState<GetCountriesResponse>();

  useEffect(() => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries/iso")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return countries;
}
