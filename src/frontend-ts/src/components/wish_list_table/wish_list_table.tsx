import { Modal, Table, TableColumnsType, notification } from "antd";
import {
  UseDeleteUserWishLocation,
  UseGetUserWishLocations,
} from "../../apis/user_locations";
import { locations } from "../../types/types";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./wish_list_table.module.css";
import { useEffect, useState } from "react";
import { ColumnFilterItem } from "antd/es/table/interface";

export function WishListTable() {
  const [refetch, setRefetch] = useState<boolean>(false);
  const { isLoading, locations } = UseGetUserWishLocations({refetch});

  const { confirm } = Modal;

  useEffect(() => {
    setRefetch(false);
  }, [locations]);

  const handleDeleteLocation = (id: string) => {
    confirm({
      title: "Are you sure you want to delete?",
      icon: <DeleteOutlined type="danger" />,
      content:
        "This will delete the wish list item, this action cannot be undone!",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        return UseDeleteUserWishLocation({ recordId: id })
          .then(() => {
            setRefetch(true);
            openSuccessNotificationWithIcon("Wish list item deleted!");
          })
          .catch((error) =>
            openErrorNotificationWithIcon(
              "There was an issue deleting the wish list item!"
            )
          );
      },
    });
  };

  const [noificationApi, contextHolder] = notification.useNotification();

  const countriesList = new Set(Array.from(locations, (record) => record.country))

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

  const columns: TableColumnsType<locations> = [
    {
      title: "Country",
      render: (record) => {
        return record.country;
      },
      filters: Array.from(countriesList, (record) => {return {text: record, value: record}}),
      onFilter: (value, record) => record.country.indexOf(value as string) === 0,
    },
    {
      title: "Province",
      render: (record) => {
        return record.province;
      },
    },
    {
      render: (record) => {
        return (
          <DeleteOutlined
            className={styles.deleteIcon}
            onClick={() => handleDeleteLocation(record.id)}
          />
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <Table loading={isLoading} dataSource={locations} columns={columns} />
    </>
  );
}

export default WishListTable;
