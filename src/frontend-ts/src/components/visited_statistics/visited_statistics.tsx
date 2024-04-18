import { Col, Row } from "antd/es/grid";
import Button from "antd/es/button"
import Modal from "antd/es/modal"
import styles from "./visited_statistics.module.css";
import { StatisticVisualisation } from "../statistics/countries_visited/countries_visited";
import {
  numberOfUNCountries,
  visitedCountriesPercentageCircleColours,
  wishCountriesPercentageCircleColours,
} from "../../const";
import {
  ListData,
  useGetUserLocationsResponse,
  useGetUserWishLocationsResponse,
} from "../../types/types";
import EditableList from "../editable_list/editable_list";
import { useState } from "react";
import WishListTable from "../wish_list_table/wish_list_table";
import VisitedListTable from "../visited_list_table/visited_list_table";

export interface VisitedStatisticsProps {
  visitedResponse: useGetUserLocationsResponse;
  wishResponse: useGetUserWishLocationsResponse;
}

export function VisitedStatistics({
  visitedResponse,
  wishResponse,
}: VisitedStatisticsProps) {
  const [visitedModalOpen, setVisitedModalOpen] = useState<boolean>(false);
  const [wishModalOpen, setWishModalOpen] = useState<boolean>(false);
  const visitedCountries: string[] = [];

  // Items to show in the editable list
  const data: ListData[] = [
    { key: "visited", value: "Visited Places", action: setVisitedModalOpen },
    { key: "wish", value: "Wish List", action: setWishModalOpen },
  ];

  visitedResponse.locations.map((record) => {
    const countryCode = record.location.split("-")[0];
    if (!visitedCountries.includes(countryCode)) {
      visitedCountries.push(countryCode);
    }
    return null;
  });

  const handleModalCancel = () => {
    setVisitedModalOpen(false);
    setWishModalOpen(false);
  };

  // Statistics container; resize depending on page size
  return (
    <>
      <Row className={styles.statisticsContainer} wrap={false}>
        <Col xs={24} sm={24} md={7} lg={7} xl={8} className="mx-2 mt-2">
          <div className={styles.card}>
            <EditableList dataSource={data} />
          </div>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mx-2 mt-2">
          <StatisticVisualisation
            isLoading={visitedResponse.isLoading}
            visualisationTitle="Visited Countries"
            completeNumberOfCountries={visitedCountries.length}
            maximumNumberOfCountries={numberOfUNCountries}
            colourGradients={visitedCountriesPercentageCircleColours}
          />
        </Col>
        <Col xs={24} sm={24} md={7} lg={7} xl={7} className="mx-2 mt-2">
          <StatisticVisualisation
            isLoading={wishResponse.isLoading}
            visualisationTitle="Wish List Countries Visited"
            completeNumberOfCountries={wishResponse.wishFulfilled}
            maximumNumberOfCountries={wishResponse.locations.length}
            colourGradients={wishCountriesPercentageCircleColours}
          />
        </Col>
      </Row>
      <Modal
        destroyOnClose
        open={visitedModalOpen}
        onCancel={handleModalCancel}
        footer={
          <Button
            onClick={handleModalCancel}
            id="close-visited-locations-table"
          >
            Close
          </Button>
        }
      >
        <VisitedListTable />
      </Modal>
      <Modal
        destroyOnClose
        open={wishModalOpen}
        onCancel={handleModalCancel}
        footer={
          <Button onClick={handleModalCancel} id="close-wish-list-table">
            Close
          </Button>
        }
      >
        <WishListTable />
      </Modal>
    </>
  );
}

export default VisitedStatistics;
