import { Button, Drawer, Row } from "antd";
import styles from "./navigation-header.module.css";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "../../aws-exports";
import { signOut } from "aws-amplify/auth";
import { UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import AccountSettingsModal from "../account_settings_modal/account_settings_modal";

Amplify.configure(awsconfig);

function NavigationHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false);
  const onDrawerClose = () => {
    setDrawerOpen(false);
  };

  async function handleSignOut() {
    await signOut();
    setDrawerOpen(false);
  }

  const onDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleAccountClick = () => {
    setAccountModalOpen(true);
    setDrawerOpen(false);
  };

  return (
    <>
      <div className={`${styles.header} bg-black-3`}>
        <div className={`px-3 mt-2`}>Visited</div>
        <div className={`px-3 mt-2`}>
          <Button
            ghost
            shape="circle"
            icon={<UserOutlined />}
            onClick={onDrawerOpen}
          ></Button>
        </div>
      </div>

      <Drawer
        onClose={onDrawerClose}
        open={drawerOpen}
        placement="top"
        height={225}
        closable={false}
      >
        <Row className="mt-3" justify={"center"}>
          <Button type="text" size="large" onClick={handleAccountClick}>
            Account
          </Button>
        </Row>
        <Row className="mt-3" justify={"center"}>
          <Button type="text" size="large" onClick={handleSignOut}>
            Logout
          </Button>
        </Row>
      </Drawer>

      <AccountSettingsModal
        showModal={accountModalOpen}
        setShowModal={setAccountModalOpen}
      />
    </>
  );
}

export default NavigationHeader;
