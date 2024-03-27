import { useGetUserLocations } from "../../apis/user_locations";
import Map from "../map_visualisation/map_visualisation";
import VisitedStatistics from "../visited_statistics/visited_statistics";
import { Row } from "antd";

export function MapVisualisationView() {
  const locations = useGetUserLocations()
  
  return (
    <>
      <Row className="mb-3">
        <Map visitedPlaces={locations}/>
      </Row>

      <VisitedStatistics visitedPlaces={locations} />
    </>
  );
}

export default MapVisualisationView;
