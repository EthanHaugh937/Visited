import NavigationHeader from "../navigation_header/navigation-header";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Col, Row } from "antd";
import MapVisualisationView from "../map_visualisation_view/map_visualisation_view";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
