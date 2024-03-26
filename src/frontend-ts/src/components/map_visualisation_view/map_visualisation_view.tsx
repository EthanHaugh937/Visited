import Map from "../map_visualisation/map_visualisation";
import VisitedStatistics from "../visited_statistics/visited_statistics";
import { Row } from "antd";

export function MapVisualisationView() {
  const visitedPlaces = ["US-AK", "US-CO", "GB-SCT", "IE-CN"];

  return (
    <>
      <Row className="mb-3">
        <Map visitedPlaces={visitedPlaces} />
      </Row>

      <VisitedStatistics visitedPlaces={visitedPlaces} />
    </>
  );
}

export default MapVisualisationView;
