import { Button, Col, List, Row } from "antd";
import styles from "./visited_statistics.module.css";
import { StatisticVisualisation } from "../statistics/countries_visited/countries_visited";
import {
  numberOfUNCountries,
  visitedCountriesPercentageCircleColours,
  wishCountriesPercentageCircleColours,
} from "../../const";
import {
  useGetUserLocationsResponse,
  useGetUserWishLocationsResponse,
} from "../../types/types";
import { EditOutlined } from "@ant-design/icons";

export interface VisitedStatisticsProps {
  visitedResponse: useGetUserLocationsResponse;
  wishResponse: useGetUserWishLocationsResponse;
}

export function VisitedStatistics({
  visitedResponse,
  wishResponse,
}: VisitedStatisticsProps) {
  const visitedCountries: string[] = [];

  const data = [
    { item: "Visited Places", value: "visited" },
    { item: "Wish list", value: "wish" },
  ];

  visitedResponse.locations.map((record) => {
    const countryCode = record.location.split("-")[0];
    if (!visitedCountries.includes(countryCode)) {
      visitedCountries.push(countryCode);
    }
    return null;
  });

  // Statistics container; resize depending on page size
  return (
    <Row className={styles.statisticsContainer} wrap={false}>
      <Col xs={24} sm={24} md={7} lg={7} xl={8} className="mx-2 mt-2">
        <div className={styles.card}>
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    shape="circle"
                    icon={<EditOutlined />}
                    ghost
                    onClick={() => {
                      console.log(item.value);
                    }}
                  ></Button>,
                ]}
              >
                {item.item}
              </List.Item>
            )}
          />
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
  );
}

export default VisitedStatistics;
