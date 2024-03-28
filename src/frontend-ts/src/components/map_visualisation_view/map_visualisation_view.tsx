import { useState } from "react";
import {
  useGetUserLocations,
  useGetUserWishLocations,
} from "../../apis/user_locations";
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

  const visitedResponse = useGetUserLocations({ refetch, setRefetch });
  const wishResponse = useGetUserWishLocations();

  return (
    <>
      <Row className="mb-3">
        <Map
          visitedPlaces={visitedResponse}
          wishLocations={wishResponse}
          setCountryData={setCountryData}
          setModalOpen={setShowModal}
        />
      </Row>

      <VisitedStatistics
        visitedResponse={visitedResponse}
        wishResponse={wishResponse}
      />

      <VisitedLocationModal
        setRefetch={setRefetch}
        showModal={showModal}
        setShowModal={setShowModal}
        countryData={countryData}
      />
    </>
  );
}

export default MapVisualisationView;
