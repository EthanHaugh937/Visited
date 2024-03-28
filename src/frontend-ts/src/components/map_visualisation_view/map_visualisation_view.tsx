import { useState } from "react";
import {
  useGetUserLocations,
  useGetUserWishLocations,
} from "../../apis/user_locations";
import Map from "../map_visualisation/map_visualisation";
import VisitedStatistics from "../visited_statistics/visited_statistics";
import { Button, Row } from "antd";
import { CountryData } from "../../types/types";
import VisitedLocationModal from "../visited_location_modal/visited_location_modal";
import WishListModal from "../wish_list_modal/wish_list_modal";

export function MapVisualisationView() {
  const [showVisitedModal, setShowVisitedModal] = useState<boolean>(false);
  const [showWishModal, setShowWishModal] = useState<boolean>(false);
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
          setModalOpen={setShowVisitedModal}
        />
      </Row>

      <Button onClick={() => setShowWishModal(true)}>SHOW</Button>

      <VisitedStatistics
        visitedResponse={visitedResponse}
        wishResponse={wishResponse}
      />

      <VisitedLocationModal
        setRefetch={setRefetch}
        showModal={showVisitedModal}
        setShowModal={setShowVisitedModal}
        countryData={countryData}
      />

      <WishListModal
        showModal={showWishModal}
        setShowModal={setShowWishModal}
      />
    </>
  );
}

export default MapVisualisationView;
