import { useEffect, useState } from "react";
import { useGetUserLocations } from "../../apis/user_locations";
import Map from "../map_visualisation/map_visualisation";
import VisitedStatistics from "../visited_statistics/visited_statistics";
import { Row } from "antd";
import { CountryData } from "../../types/types";
import VisitedLocationModal from "../visited_location_modal/visited_location_modal";

export function MapVisualisationView() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [countryData, setCountryData] = useState<CountryData>({
    country: "",
    province: "",
    countryCode: "",
    provinceCode: "",
  });

  useEffect(() => {
    if (showModal === false) {
      setRefetch(true);
    }
  }, [showModal]);

  const locations = useGetUserLocations({ refetch, setRefetch });

  return (
    <>
      <Row className="mb-3">
        <Map
          visitedPlaces={locations}
          setCountryData={setCountryData}
          setModalOpen={setShowModal}
        />
      </Row>

      <VisitedStatistics visitedPlaces={locations} />

      <VisitedLocationModal
        showModal={showModal}
        setShowModal={setShowModal}
        countryData={countryData}
      />
    </>
  );
}

export default MapVisualisationView;
