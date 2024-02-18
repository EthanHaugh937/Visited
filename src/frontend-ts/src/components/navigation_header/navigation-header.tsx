import { Divider } from "antd";
import styles from "./navigation-header.module.css";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "../../aws-exports";
import { signOut } from "aws-amplify/auth";

Amplify.configure(awsconfig);

async function handleSignOut() {
  await signOut()
}

function NavigationHeader() {
  return (
    <Authenticator className="mt-4">
      <div className={`${styles.header} bg-black-3`}>
        <div className={`px-3 mt-2`}>LOGO</div>
        <div className={`${styles.navElement} px-3 mt-2`}>
          <nav className={styles.nav}>
            <a href="/home" className={styles.authenticationText}>
              Login
            </a>
            <Divider type="vertical" className={`${styles.divider} mx-3`} />
            <button
              onClick={handleSignOut}
              className={`${styles.authenticationText} ${styles.signupPill} px-2 py-1`}
            >
              Sign Out
            </button>
          </nav>
        </div>
      </div>
    </Authenticator>
  );
}

export default NavigationHeader;
