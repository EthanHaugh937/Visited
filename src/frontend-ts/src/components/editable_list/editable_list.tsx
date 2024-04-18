import { EditOutlined } from "@ant-design/icons";
import Typography from "antd/es/typography";
import List from "antd/es/list";
import Button from "antd/es/button";
import { ListData } from "../../types/types";

export interface EditableListProps {
  dataSource: Array<ListData>;
}

export function EditableList({ dataSource }: EditableListProps) {
  return (
    <List
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item
          className="mx-2"
          actions={[
            <Button
              shape="circle"
              icon={<EditOutlined />}
              id={item.key}
              ghost
              onClick={() => {
                item.action(true);
              }}
            />,
          ]}
        >
          <Typography.Title
            level={5}
            className="statisticsTitle"
            type="secondary"
          >
            {item.value}
          </Typography.Title>
        </List.Item>
      )}
    />
  );
}

export default EditableList;
