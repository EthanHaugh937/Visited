import { Button, Form, Modal, Space, Typography, notification } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { AddWishLocationRequest } from "../../types/types";
import { fetchAuthSession } from "aws-amplify/auth";
import axios, { AxiosError } from "axios";
import CountrySelect from "../country_province_dropdown_select/country_select";
import { ProvinceSelect } from "../country_province_dropdown_select/province_select";

export interface WishListModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setRefetch: Dispatch<SetStateAction<boolean>>;
}
export function WishListModal({
  showModal,
  setShowModal,
  setRefetch,
}: WishListModalProps) {
  const [form] = Form.useForm();
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [apiData, setApiData] = useState<AddWishLocationRequest>({
    accessToken: "",
    locationCode: "",
  });

  const [noificationApi, contextHolder] = notification.useNotification();

  const getAccessToken = async () => {
    try {
      const session = await fetchAuthSession(); // Fetch the authentication session
      setAccessToken(session.tokens?.accessToken.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const fireApiRequest = async () => {
    if (apiData.locationCode && accessToken) {
      setIsLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      const body = {
        countryCode: selectedCountryCode,
        provinceCode: selectedProvinceCode,
        country: selectedCountry,
        province: selectedProvince,
      };

      await axios
        .post(
          "https://ax6v5dntdj.us-east-1.awsapprunner.com/api/v1.0/wishlocation",
          body,
          config
        )
        .then(() => {
          setIsLoading(false);
          setShowModal(false);
          setRefetch(true);
          form.resetFields();
          return openSuccessNotificationWithIcon(
            "Wish List Item Added Successfully!"
          );
        })
        .catch((error: AxiosError) => {
          setIsLoading(false);
          const err = error.response?.data as any;
          return openErrorNotificationWithIcon(err.message);
        });
    }
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

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(async (res) => {
        await getAccessToken();

        setApiData({
          accessToken: accessToken,
          locationCode: `${res.country}-${res.province}`,
        });

        fireApiRequest();
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={showModal}
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
        <Typography.Title level={5} id="add-wishlist-location-modal-title">
          Add Wish List Item
        </Typography.Title>
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
                  setSelectedProvince={setSelectedProvince}
                  setSelectedProvinceCode={setSelectedProvinceCode}
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default WishListModal;
