import {
  Button,
  DatePicker,
  Form,
  Modal,
  Space,
  Typography,
  notification,
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GetCountries } from "../../apis/countries";
import { AddVisitedLocationRequest, CountryData } from "../../types/types";
import styles from "./visited_location_modal.module.css";
import { fetchAuthSession } from "aws-amplify/auth";
import axios, { AxiosError } from "axios";
import CountrySelect from "../country_province_dropdown_select/country_select";
import { ProvinceSelect } from "../country_province_dropdown_select/province_select";

export interface VisitedLocationModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setRefetch: Dispatch<SetStateAction<boolean>>;
  countryData: CountryData;
}

export function VisitedLocationModal({
  showModal,
  setShowModal,
  setRefetch,
  countryData,
}: VisitedLocationModalProps) {
  const [form] = Form.useForm();
  const [selectedCountry, setSelectedCountry] = useState<string>(
    countryData.countryCode
  );
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>(
    countryData.provinceCode
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    countryData.countryCode
  );
  const [selectedProvince, setSelectedProvince] = useState<string>(countryData.province);
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<AddVisitedLocationRequest>({
    arrival: "",
    departure: "",
    countryCode: "",
    country: "",
    provinceCode: "",
    province: "",
  });

  const [noificationApi, contextHolder] = notification.useNotification();

  const countriesResponse = GetCountries();
  const { RangePicker } = DatePicker;

  useEffect(() => {
    setSelectedCountryCode(countryData.countryCode);
    setSelectedProvinceCode(countryData.provinceCode);
  }, [countryData.countryCode, countryData.provinceCode]);

  const fireApiRequest = async () => {
    if (
      apiData.arrival &&
      apiData.departure &&
      apiData.countryCode &&
      apiData.provinceCode &&
      accessToken
    ) {
      setIsLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      await axios
        .post(
          "https://ax6v5dntdj.us-east-1.awsapprunner.com/location",
          apiData,
          config
        )
        .then(() => {
          setIsLoading(false);
          setShowModal(false);
          setRefetch(true);
          form.resetFields();
          return openSuccessNotificationWithIcon(
            "Visited Location Item Added Successfully!"
          );
        })
        .catch((error: AxiosError) => {
          setIsLoading(false);
          const err = error.response?.data as any;
          return openErrorNotificationWithIcon(err.message);
        });
    }
  };

  useEffect(() => {
    form.resetFields();
    setSelectedCountry(countryData.country);
    setSelectedProvince(countryData.province)
    form.setFieldValue("country", countryData.countryCode);
    form.setFieldValue("province", countryData.provinceCode);
  }, [form, countryData, countriesResponse]);

  const handleModalCancel = () => {
    setShowModal(false);
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

        const arrival = `${res["dates"][0]["$D"]}Z${
          res["dates"][0]["$M"] + 1
        }Z${res["dates"][0]["$y"]}`;
        const departure = `${res["dates"][1]["$D"]}Z${
          res["dates"][1]["$M"] + 1
        }Z${res["dates"][1]["$y"]}`;

        setApiData({
          arrival: arrival,
          departure: departure,
          countryCode: selectedCountryCode,
          country: selectedCountry,
          provinceCode: selectedProvinceCode,
          province: selectedProvince,
        });

        fireApiRequest();
      })
      .catch((error) => console.log(error));
  };

  const openErrorNotificationWithIcon = (error: string) => {
    noificationApi["error"]({
      message: "There was a problem!",
      description: error,
    });
  };

  const openSuccessNotificationWithIcon = (message: string) => {
    noificationApi["success"]({
      message: message,
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={showModal}
        onCancel={handleModalCancel}
        forceRender
        footer={[
          <Button onClick={handleModalCancel} key={1}>
            Cancel
          </Button>,
          <Button
            key={2}
            type={"primary"}
            loading={isLoading}
            onClick={handleFormSubmit}
          >
            Ok
          </Button>,
        ]}
      >
        <Typography.Title level={5}>Add Visited Location Item</Typography.Title>
        <Form form={form}>
          <Form.Item label="Country">
            <Space.Compact>
              <Form.Item name={"country"} noStyle>
                <CountrySelect
                  countryCode={selectedCountryCode}
                  setSelectedCountry={setSelectedCountry}
                  setSelectedCountryCode={setSelectedCountryCode}
                />
              </Form.Item>
              <Form.Item name={"province"} noStyle>
                <ProvinceSelect
                  selectedCountry={selectedCountry}
                  selectedProvinceCode={selectedProvinceCode}
                  setSelectedProvince={setSelectedProvince}
                  setSelectedProvinceCode={setSelectedProvinceCode}
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
          <Form.Item
            label="dates"
            name={"dates"}
            required
            noStyle
            rules={[{ required: true, message: "Date is required" }]}
          >
            <RangePicker className={styles.rangePicker} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default VisitedLocationModal;
