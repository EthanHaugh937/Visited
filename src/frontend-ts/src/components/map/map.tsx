import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import styles from "./map.module.css";
import { useLayoutEffect } from "react";

export function Map() {
  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
        panX: "none",
        panY: "none",
        draggable: false,
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"]
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      interactive: true,
      fill: am5.color(0xaaaaaa),
      templateField: "polygonSettings"
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#6c6765")
    });
    
    const polygonTemplate = polygonSeries.mapPolygons.template

    polygonTemplate.events.on("click", function(ev) {console.log(ev.target.dataItem?.dataContext)})
    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" className={`${styles.map} mt-2`}></div>;
}

export default Map;
