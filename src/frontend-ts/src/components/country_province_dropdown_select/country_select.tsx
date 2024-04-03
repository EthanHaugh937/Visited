import { Select, SelectProps } from "antd";
import { GetCountries } from "../../apis/countries";
import { Dispatch, SetStateAction } from "react";
import styles from "./country_select.module.css";

export interface CountryProvinceSelectProps {
  setSelectedCountry: Dispatch<SetStateAction<string>>;
  setSelectedCountryCode: Dispatch<SetStateAction<string>>;
  countryCode?: string;
}

export function CountrySelect({
  setSelectedCountry,
  setSelectedCountryCode,
  countryCode,
}: CountryProvinceSelectProps) {
  const countriesResponse = GetCountries();

  const countriesOptions: SelectProps["options"] = [];

  countriesResponse?.data.forEach((country) => {
    countriesOptions.push({
      label: country.name,
      value: country.Iso2,
    });
  });

  const handleCountryChange = (countryCode: string) => {
    countriesOptions.map((country) => {
      if (country.value === countryCode) {
        setSelectedCountry(country.label as string);
        setSelectedCountryCode(countryCode);
      }
      return null;
    });
  };

  return (
    <Select
      showSearch
      filterOption={(input, option) => {
        const label = option?.label as string;
        return label.includes(input);
      }}
      onChange={handleCountryChange}
      className={styles.locationSelect}
      placeholder="Select Country"
      options={countriesOptions}
      value={countryCode}
    />
  );
}

export default CountrySelect;
