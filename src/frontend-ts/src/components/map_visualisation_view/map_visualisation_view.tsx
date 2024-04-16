import { useEffect, useState } from "react";
import {
  useGetUserLocations,
  UseGetUserWishLocations,
} from "../../apis/user_locations";
import Map from "../map_visualisation/map_visualisation";
import VisitedStatistics from "../visited_statistics/visited_statistics";
import { FloatButton, Row, Switch } from "antd";
import { CountryData } from "../../types/types";
import VisitedLocationModal from "../visited_location_modal/visited_location_modal";
import WishListModal from "../wish_list_modal/wish_list_modal";
import {
  BulbOutlined,
  CheckOutlined,
  CloseOutlined,
  CloudOutlined,
  PlusOutlined,
} from "@ant-design/icons";

export function MapVisualisationView() {
  const [showVisitedModal, setShowVisitedModal] = useState<boolean>(false);
  const [showWishModal, setShowWishModal] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [globeVisualisation, setGlobeVisualisation] = useState<boolean>(false);
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
          globeVisualisation={globeVisualisation}
          setCountryData={setCountryData}
          setModalOpen={setShowVisitedModal}
        />
      </Row>

      {/* Button to accomodate adding new data */}
      <FloatButton.Group trigger="click" icon={<CloudOutlined />}>
        <FloatButton
          onClick={() => setShowWishModal(true)}
          icon={<BulbOutlined />}
          aria-label="produce-wishlist-modal"
        />
        <FloatButton
          onClick={() => setShowVisitedModal(true)}
          icon={<PlusOutlined />}
          aria-label="produce-visited-modal"
        />
      </FloatButton.Group>

      <Row justify={"end"}>
        <i className="bi bi-globe-americas text-primary h4"></i>
        <Switch
          className="mx-2 mt-1"
          id="switch-visualisation-btn"
          defaultValue={false}
          onChange={(event) => setGlobeVisualisation(event)}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        ></Switch>
      </Row>

      <VisitedStatistics
        visitedResponse={visitedResponse}
        wishResponse={wishResponse}
      />

      {/* Modal for adding new visited location */}
      <VisitedLocationModal
        setRefetch={setRefetch}
        showModal={showVisitedModal}
        setShowModal={setShowVisitedModal}
        countryData={countryData}
      />

      {/* Modal for adding new wish location */}
      <WishListModal
        showModal={showWishModal}
        setShowModal={setShowWishModal}
        setRefetch={setRefetch}
      />
    </>
  );
}

export default MapVisualisationView;
