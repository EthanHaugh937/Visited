import { Col, Row } from "antd";
import styles from "./visited_statistics.module.css";
import { StatisticVisualisation } from "../statistics/countries_visited/countries_visited";
import {
  numberOfUNCountries,
  visitedCountriesPercentageCircleColours,
  wishCountriesPercentageCircleColours,
} from "../../const";

export interface VisitedStatisticsProps {
  visitedPlaces: Array<string>;
}

export function VisitedStatistics({ visitedPlaces }: VisitedStatisticsProps) {
  const visitedCountries = Array.from(visitedPlaces, (id) => {
    return id.split("-")[0];
  });

  // Statistics container; resize depending on page size
  return (
    <Row className={styles.statisticsContainer} wrap={false}>
      <Col xs={24} sm={24} md={7} lg={7} xl={8} className="mx-2 mt-2">
        <div className={styles.card}>Test</div>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mx-2 mt-2">
        <StatisticVisualisation
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
