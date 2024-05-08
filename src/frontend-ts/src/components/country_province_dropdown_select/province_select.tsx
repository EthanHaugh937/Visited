import { Dispatch, SetStateAction } from "react";
import { useGetCountryProvinces } from "../../apis/country_codes";
import styles from "./location_select.module.css";

import Select, { SelectProps } from "antd/es/select";

export interface ProvinceSelectProps {
  selectedCountry: string;
  setSelectedProvinceCode: Dispatch<SetStateAction<string>>;
  setSelectedProvince: Dispatch<SetStateAction<string>>;
  selectedProvinceCode?: string;
}

export function ProvinceSelect({
  selectedCountry,
  setSelectedProvinceCode,
  setSelectedProvince,
  selectedProvinceCode,
}: ProvinceSelectProps) {
  const provincesOptions: SelectProps["options"] = [];

  const provincesResponse = useGetCountryProvinces({
    country: selectedCountry,
  });

  provincesResponse?.provinces?.data?.states.forEach((province) => {
    provincesOptions.push({
      label: province.name,
      value: province.state_code,
    });
  });

  const handleSelectChange = (provinceCode: string) => {
    provincesOptions.map((province) => {
      if (province.value === provinceCode) {
        setSelectedProvinceCode(provinceCode);
        return setSelectedProvince(province.label as string);
      }
      return null;
    });
  };

  return (
    <Select
      onChange={handleSelectChange}
      className={styles.locationSelect}
      placeholder="Select Province"
      options={provincesOptions}
      value={selectedProvinceCode}
      loading={provincesResponse?.isLoading}
    />
  );
}
