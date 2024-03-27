import { Col, Row } from "antd";
import styles from "./visited_statistics.module.css";
import { StatisticVisualisation } from "../statistics/countries_visited/countries_visited";
import {
  numberOfUNCountries,
  visitedCountriesPercentageCircleColours,
  wishCountriesPercentageCircleColours,
} from "../../const";
import { useGetUserLocationsResponse } from "../../types/types";

export interface VisitedStatisticsProps {
  visitedPlaces: useGetUserLocationsResponse;
}

export function VisitedStatistics({ visitedPlaces }: VisitedStatisticsProps) {
  const visitedCountries: string[] = [];
  visitedPlaces.locations.map((record) => {
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
        <div className={styles.card}>Test</div>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mx-2 mt-2">
        <StatisticVisualisation
          isLoading={visitedPlaces.isLoading}
          visualisationTitle="Visited Countries"
          completeNumberOfCountries={visitedCountries.length}
          maximumNumberOfCountries={numberOfUNCountries}
          colourGradients={visitedCountriesPercentageCircleColours}
        />
      </Col>
      <Col xs={24} sm={24} md={7} lg={7} xl={7} className="mx-2 mt-2">
        <StatisticVisualisation
          visualisationTitle="Wish List Countries Visited"
          completeNumberOfCountries={visitedCountries.length}
          maximumNumberOfCountries={6}
          colourGradients={wishCountriesPercentageCircleColours}
        />
      </Col>
    </Row>
  );
}

export default VisitedStatistics;
