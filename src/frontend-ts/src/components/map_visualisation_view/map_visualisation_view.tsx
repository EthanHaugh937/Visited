import { useEffect, useState } from "react";
import {
  useGetUserLocations,
  UseGetUserWishLocations,
} from "../../apis/user_locations";
import Map from "../map_visualisation/map_visualisation";
import VisitedStatistics from "../visited_statistics/visited_statistics";
import { FloatButton, Row } from "antd";
import { CountryData } from "../../types/types";
import VisitedLocationModal from "../visited_location_modal/visited_location_modal";
import WishListModal from "../wish_list_modal/wish_list_modal";
import { BulbOutlined, CloudOutlined, PlusOutlined } from "@ant-design/icons";

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

  const visitedResponse = useGetUserLocations({ refetch });
  const wishResponse = UseGetUserWishLocations({ refetch });

  useEffect(() => {
    setRefetch(false);
  }, [visitedResponse, wishResponse]);

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

      <FloatButton.Group trigger="hover" icon={<CloudOutlined />}>
        <FloatButton
          onClick={() => setShowWishModal(true)}
          icon={<BulbOutlined />}
        />
        <FloatButton
          onClick={() => setShowVisitedModal(true)}
          icon={<PlusOutlined />}
        />
      </FloatButton.Group>

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
        setRefetch={setRefetch}
      />
    </>
  );
}

export default MapVisualisationView;
