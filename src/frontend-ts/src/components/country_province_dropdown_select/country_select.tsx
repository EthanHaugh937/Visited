import { Form, Select, SelectProps } from "antd";
import { GetCountries } from "../../apis/countries";
import { Dispatch, SetStateAction, useEffect } from "react";
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
  const [form] = Form.useForm();

  const countriesResponse = GetCountries();

  useEffect(() => {
    form.resetFields();
    form.setFieldValue("country", countryCode);
  }, [form, countryCode]);

  const countriesOptions: SelectProps["options"] = [];

  countriesResponse?.data.forEach((country) => {
    countriesOptions.push({
      label: country.name,
      value: country.Iso2,
    });
  });

  console.log("COUNTRY CODE: ", countryCode);

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
      onChange={handleCountryChange}
      className={styles.locationSelect}
      placeholder="Select Country"
      options={countriesOptions}
      value={countryCode}
    />
  );
}

export default CountrySelect;
