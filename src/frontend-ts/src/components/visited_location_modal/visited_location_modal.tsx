import { DatePicker, Form, Modal, Select, SelectProps, Space } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GetCountries } from "../../apis/countries";
import { CountryData } from "../../types/types";
import { GetCountryProvinces } from "../../apis/countryCodes";
import styles from "./visited_location_modal.module.css";

export interface VisitedLocationModalProps {
  // userId: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  countryData: CountryData;
}

export function VisitedLocationModal({
  showModal,
  setShowModal,
  countryData,
}: VisitedLocationModalProps) {
  const [form] = Form.useForm();
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const countriesOptions: SelectProps["options"] = [];
  const provincesOptions: SelectProps["options"] = [];

  const countriesResponse = GetCountries();
  const { RangePicker } = DatePicker;

  useEffect(() => {
    form.resetFields();
    setSelectedCountryCode(countryData.countryCode);
    setSelectedCountry(countryData.country);
    form.setFieldValue("country", countryData.countryCode);
    form.setFieldValue("province", countryData.provinceCode);
  }, [form, countryData, countriesResponse]);

  const provincesResponse = GetCountryProvinces({ country: selectedCountry });

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleCounteyChange = (countryCode: string) => {
    countriesOptions.map((country) => {
      if (country.value === countryCode) {
        return setSelectedCountry(country.label as string);
      }
      return null;
    });
  };

  countriesResponse?.data.forEach((country) => {
    countriesOptions.push({
      label: country.name,
      value: country.Iso2,
    });
  });

  provincesResponse?.data.states.forEach((province) => {
    provincesOptions.push({
      label: province.name,
      value: province.state_code,
    });
  });

  return (
    <Modal open={showModal} onCancel={handleModalCancel} forceRender>
      <Form form={form}>
        <Form.Item label="Country">
          <Space.Compact>
            <Form.Item
              name={"country"}
              noStyle
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Select
                onChange={handleCounteyChange}
                className={styles.locationSelect}
                placeholder="Select Country"
                options={countriesOptions}
                value={selectedCountryCode}
              />
            </Form.Item>
            <Form.Item
              name={"province"}
              noStyle
              rules={[{ required: true, message: "Province is required" }]}
            >
              <Select
                className={styles.locationSelect}
                placeholder="Select Province"
                options={provincesOptions}
                value={selectedCountryCode}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
        <Form.Item
          name={"dates"}
          noStyle
          rules={[{ required: true, message: "Date is required" }]}
        >
          <RangePicker showTime className={styles.rangePicker} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default VisitedLocationModal;
