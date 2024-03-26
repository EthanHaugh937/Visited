import {
  Button,
  DescriptionsProps,
  List,
  Modal,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { useFetchUserAttributes } from "../../apis/authentication";
import { DeleteOutlined } from "@ant-design/icons";
import { Dispatch, SetStateAction } from "react";

export interface AccountSettingsModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export function AccountSettingsModal({
  showModal,
  setShowModal,
}: AccountSettingsModalProps) {
  const { isLoading, userInfo } = useFetchUserAttributes();
  const { confirm } = Modal;

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Email",
      children: userInfo?.email,
    },
    {
      key: "2",
      label: "User ID",
      children: userInfo?.sub,
    },
  ];

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleAccountDelete = () => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <DeleteOutlined type="danger" />,
      content: "This will delete your account and all its data!",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        console.log("OK");
      },
    });
  };

  return (
    <Modal
      open={showModal}
      footer={[
        <Button onClick={handleAccountDelete} danger>
          Delete Account
        </Button>,
        <Button type="primary" onClick={handleModalCancel}>
          Close
        </Button>,
      ]}
      onCancel={handleModalCancel}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <Typography.Title level={4}>User Info</Typography.Title>
          <List
            dataSource={items}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <Typography.Text type="secondary">
                    {item.label}:
                  </Typography.Text>{" "}
                  {item.children}
                </Space>
              </List.Item>
            )}
          />
        </>
      )}
    </Modal>
  );
}

export default AccountSettingsModal;
