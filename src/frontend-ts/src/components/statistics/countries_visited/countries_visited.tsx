import { Col, Progress, Row, Spin, Statistic, Typography } from "antd";
import styles from "./countries_visited.module.css";
import { FireOutlined } from "@ant-design/icons";
import { ProgressProps } from "antd/es/progress/progress";

export interface StatisticVisualisationProps {
  visualisationTitle: string;
  completeNumberOfCountries: number;
  maximumNumberOfCountries: number;
  colourGradients: ProgressProps["strokeColor"];
  isLoading?: boolean;
}

export function StatisticVisualisation({
  maximumNumberOfCountries,
  completeNumberOfCountries,
  visualisationTitle,
  colourGradients,
  isLoading,
}: StatisticVisualisationProps) {
  const visitedCountriesPercentage = Number(
    (
      (completeNumberOfCountries / maximumNumberOfCountries) *
      100
    ).toLocaleString("en-us", {
      maximumFractionDigits: 1,
    })
  );

  return (
    <div className={`${styles.card} px-3 py-2`}>
      {isLoading ? (
        <Spin className={styles.loader} />
      ) : (
        <>
          <Typography.Title
            level={4}
            className="statisticsTitle"
            type="secondary"
          >
            {visualisationTitle}
          </Typography.Title>
          <Row align={"middle"} wrap={false}>
            <Col flex={2}>
              <Statistic
                value={completeNumberOfCountries || 0}
                suffix={`/ ${maximumNumberOfCountries}`}
                valueStyle={{ color: "#fff" }}
                prefix={<FireOutlined />}
                className={`${styles.statisticVizRight} mx-1`}
              />
            </Col>
            <Col flex={1} className={styles.percentageViz}>
              <Progress
                type="circle"
                percent={visitedCountriesPercentage || 0}
                size={80}
                strokeColor={colourGradients}
                format={() => null}
              />
            </Col>
            <Col flex={2} className={styles.statisticNumber}>
              <Statistic
                value={visitedCountriesPercentage || 0}
                suffix={"%"}
                valueStyle={{ color: "#fff" }}
                className={`${styles.statisticVizLeft} mx-2`}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
