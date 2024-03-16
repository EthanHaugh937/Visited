import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import styles from "./map.module.css";
import { useLayoutEffect } from "react";

const data = ["US", "CA"];

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
        exclude: ["AQ"],
      })
    );

    // Change the default colour for countries
    polygonSeries.mapPolygons.template.setAll({
      interactive: true,
      fill: am5.color(0xaaaaaa),
      templateField: "polygonSettings",
    });

    // Highlight country on hover
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#6c6765"),
    });

    const polygonTemplate = polygonSeries.mapPolygons.template;

    // Set all visited countries to different colour
    polygonSeries.data.setAll(
      Array.from(data, (id) => {
        return { id: id, polygonSettings: { fill: am5.color("#f00") } };
      })
    );

    polygonTemplate.events.on("click", function (ev) {
      console.log(ev.target.dataItem);
    });
    
    return () => {
      root.dispose();
    };
  }, [data]);

  return <div id="chartdiv" className={`${styles.map}`}></div>;
}

export default Map;
