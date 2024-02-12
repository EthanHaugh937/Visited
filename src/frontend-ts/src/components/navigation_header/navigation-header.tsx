import { Divider } from "antd";
import styles from "./navigation-header.module.css";

function NavigationHeader() {
  return (
    <div className={`${styles.header} bg-black-3`}>
      <div className={`px-3 mt-2`}>LOGO</div>
      <div className={`${styles.navElement} px-3 mt-2`}>
        <nav className={styles.nav}>
          <a href="/home" className={styles.authenticationText}>
            Login
          </a>
          <Divider type="vertical" className={`${styles.divider} mx-3`} />
          <a
            href="/home"
            className={`${styles.authenticationText} ${styles.signupPill} px-2 py-1`}
          >
            Sign Up
          </a>
        </nav>
      </div>
    </div>
  );
}

export default NavigationHeader;
