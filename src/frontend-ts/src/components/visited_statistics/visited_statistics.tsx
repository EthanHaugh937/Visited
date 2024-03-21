import { Card, Carousel, Col, Row, Statistic } from "antd"
import styles from './visited_statistics.module.css'

export interface VisitedStatisticsProps {
    visitedPlaces: Array<string>;
}

export function VisitedStatistics({visitedPlaces}: VisitedStatisticsProps) {   
    const visitedContinents = Array.from(visitedPlaces, (id) => {
        return id.split("-")[0];
      });

    // Statistics container; resize depending on page size 
    return (
        <Row className={styles.statisticsContainer} wrap={false}>
        <Col xs={24} sm={24} md={7} lg={7} xl={8} className="mx-2 mt-2">
          <Card className={styles.card}>Test</Card>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mx-2 mt-2">
          <Card className={styles.card}>
            <Carousel>
              <Statistic
                title="Continents Visited"
                value={visitedContinents.length}
                suffix={"/ 7"}
                className={styles.contentStyle}
              />
              <div>
                <h3>2</h3>
              </div>
            </Carousel>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={7} lg={7} xl={7} className="mx-2 mt-2">
          <Card className={styles.card}>Test</Card>
        </Col>
      </Row>
    )
}

export default VisitedStatistics