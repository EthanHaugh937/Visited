import NavigationHeader from "../navigation_header/navigation-header";
import { Col, Row } from "antd/es/grid";
import MapVisualisationView from "../map_visualisation_view/map_visualisation_view";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "../../aws-exports";
import styles from "./app.module.css";

Amplify.configure(awsconfig);

function App() {
  return (
    <Authenticator className="mt-4">
      <Row className={styles.header}>
        <Col span={24}>
          <NavigationHeader />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <MapVisualisationView />
        </Col>
      </Row>
    </Authenticator>
  );
}

export default App;
