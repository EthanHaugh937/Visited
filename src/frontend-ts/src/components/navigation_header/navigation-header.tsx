import { Row } from "antd/es/grid";
import Drawer from "antd/es/drawer";
import Button from "antd/es/button";
import styles from "./navigation-header.module.css";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "../../aws-exports";
import { signOut } from "aws-amplify/auth";
import UserOutlined from "@ant-design/icons/UserOutlined";
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
        <div className={`px-3 mt-2`} id="application-title">
          Visited
        </div>
        <div className={`px-3 mt-2`}>
          <Button
            ghost
            id="account-button"
            shape="circle"
            icon={<UserOutlined />}
            onClick={onDrawerOpen}
          ></Button>
        </div>
      </div>

      {/* Account pop over container */}
      <Drawer
        onClose={onDrawerClose}
        open={drawerOpen}
        placement="top"
        height={225}
        closable={false}
      >
        <Row className="mt-3" justify={"center"}>
          <Button
            type="text"
            size="large"
            onClick={handleAccountClick}
            id="view-account-details-button"
          >
            Account
          </Button>
        </Row>
        <Row className="mt-3" justify={"center"}>
          <Button
            type="text"
            size="large"
            onClick={handleSignOut}
            id="logout-button"
          >
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
