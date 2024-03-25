import NavigationHeader from "../navigation_header/navigation-header";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Col, Row } from "antd";
import MapVisualisationView from "../map_visualisation_view/map_visualisation_view";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsconfig from "../../aws-exports";

Amplify.configure(awsconfig);

function App() {
  return (
    <Authenticator className="mt-4">
      <Row>
        <Col span={24}>
        <NavigationHeader />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MapVisualisationView />} />
            <Route path="/nothome" element={<h1>Goodbye World</h1>} />
          </Routes>
        </BrowserRouter>
        </Col>
      </Row>
    </Authenticator>
  );
}

export default App;
