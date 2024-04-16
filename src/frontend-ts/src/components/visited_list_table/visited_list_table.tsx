import { DeleteOutlined } from "@ant-design/icons";
import { Modal, Table, TableColumnsType, notification } from "antd";
import { useEffect, useState } from "react";
import {
  UseDeleteUserVisitedLocation,
  useGetUserLocations,
} from "../../apis/user_locations";
import { locations } from "../../types/types";
import styles from "./visited_list_table.module.css";

export function VisitedListTable() {
  const [refetch, setRefetch] = useState<boolean>(false);
  const { isLoading, locations } = useGetUserLocations({ refetch });

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
        return UseDeleteUserVisitedLocation({ recordId: id })
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

  const [notificationApi, contextHolder] = notification.useNotification();

  const countriesList = new Set(
    Array.from(locations, (record) => record.country)
  );

  const openErrorNotificationWithIcon = (error: string) => {
    notificationApi["error"]({
      message: "There was a problem!",
      description: error,
    });
  };

  const openSuccessNotificationWithIcon = (message: string) => {
    notificationApi["success"]({
      message: message,
    });
  };

  const columns: TableColumnsType<locations> = [
    {
      title: "Country",
      render: (record) => {
        return record.country;
      },
      filters: Array.from(countriesList, (record) => {
        return { text: record, value: record };
      }).sort((a, b) => a.value.localeCompare(b.value)),
      onFilter: (value, record) =>
        record.country.indexOf(value as string) === 0,
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: "Province",
      render: (record) => {
        return record.province;
      },
    },
    {
      title: "Duration",
      render: (record: locations) => {
        const arrived = new Date(
          record.arrival?.replaceAll("Z", "/") as string
        );
        const departed = new Date(
          record.departure?.replaceAll("Z", "/") as string
        );

        const vacationDays =
          (departed.getTime() - arrived.getTime()) / (1000 * 3600 * 24);
        return Math.floor(vacationDays);
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
      <Table
        id="visited-places-table"
        key="table"
        loading={isLoading}
        dataSource={locations}
        columns={columns}
      />
    </>
  );
}

export default VisitedListTable;
