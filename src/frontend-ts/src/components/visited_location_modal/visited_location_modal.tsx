import {
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  SelectProps,
  Space,
  notification,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GetCountries } from "../../apis/countries";
import { AddVisitedLocationRequest, CountryData } from "../../types/types";
import { GetCountryProvinces } from "../../apis/countryCodes";
import styles from "./visited_location_modal.module.css";
import { fetchAuthSession } from "aws-amplify/auth";
import axios, { AxiosError } from "axios";

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
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<AddVisitedLocationRequest>({
    accessToken: "",
    arrival: "",
    departure: "",
    locationCode: "",
  });

  const countriesOptions: SelectProps["options"] = [];
  const provincesOptions: SelectProps["options"] = [];
  const [noificationApi, contextHolder] = notification.useNotification();

  const countriesResponse = GetCountries();
  const { RangePicker } = DatePicker;

  const fireApiRequest = async () => {
    if (
      apiData.arrival &&
      apiData.departure &&
      apiData.locationCode &&
      accessToken
    ) {
      setIsLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      await axios
        .post(
          `https://ax6v5dntdj.us-east-1.awsapprunner.com/location/${apiData.locationCode}/${apiData.arrival}/${apiData.departure}`,
          {},
          config
        )
        .catch((error: AxiosError) => {
          setIsLoading(false)
          const err = error.response?.data as any;
          return openNotificationWithIcon(err.message);
        });
      setIsLoading(false);
      setShowModal(false);
      form.resetFields();
    }
  };

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

  const getAccessToken = async () => {
    try {
      const session = await fetchAuthSession(); // Fetch the authentication session
      setAccessToken(session.tokens?.accessToken.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (res) => {
        await getAccessToken();
        console.log(res["dates"][0])
        const arrival = `${res["dates"][0]["$D"]}Z${res["dates"][0]["$M"]+1}Z${res["dates"][0]["$y"]}`;
        const departure = `${res["dates"][1]["$D"]}Z${res["dates"][1]["$M"]+1}Z${res["dates"][1]["$y"]}`;

        setApiData({
          accessToken: accessToken,
          arrival: arrival,
          departure: departure,
          locationCode: res.country,
        });

        fireApiRequest();
      })
      .catch((error) => console.log(error));
  };

  const openNotificationWithIcon = (error: string) => {
    noificationApi["error"]({
      message: "There was a problem!",
      description: error,
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
    <>
      {contextHolder}
      <Modal
        open={showModal}
        forceRender
        footer={[
          <Button onClick={handleModalCancel}>Cancel</Button>,
          <Button
            type={"primary"}
            loading={isLoading}
            onClick={handleFormSubmit}
          >
            Ok
          </Button>,
        ]}
      >
        <Form form={form}>
          <Form.Item label="Country">
            <Space.Compact>
              <Form.Item
                name={"country"}
                required
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
                required
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
            required
            noStyle
            rules={[{ required: true, message: "Date is required" }]}
          >
            <RangePicker showTime className={styles.rangePicker} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default VisitedLocationModal;
