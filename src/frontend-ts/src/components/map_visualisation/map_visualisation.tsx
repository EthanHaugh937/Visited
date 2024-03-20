import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_continentsLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_data_countries from "@amcharts/amcharts5-geodata/data/countries2";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import styles from "./map.module.css";
import { useLayoutEffect } from "react";

const countriesVisited = ["US", "CA", "GB"];

export function Map() {
  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
        panX: "none",
        panY: "none",
        draggable: false,
      })
    );

    const continentSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_continentsLow,
        exclude: ["AQ"],
      })
    );

    const countrySeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
        visible: false,
      })
    );

    // Change the default colour for countries
    continentSeries.mapPolygons.template.setAll({
      interactive: true,
      tooltipText: "{name}",
      fill: am5.color(0xaaaaaa),
      templateField: "polygonSettings",
    });

    // Highlight country on hover
    continentSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#6c6765"),
    });

    countrySeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      fill: am5.color(0xaaaaaa),
      interactive: true
    });

    countrySeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#6c6765")
    });

    // Set all visited countries to different colour
    continentSeries.data.setAll(
      Array.from(countriesVisited, (id) => {
        return { id: id, polygonSettings: { fill: am5.color("#f00") } };
      })
    );

    var data = [];
    for (var id in am5geodata_data_countries) {
      if (am5geodata_data_countries.hasOwnProperty(id)) {
        var country = am5geodata_data_countries[id];
        if (country.maps.length) {
          data.push({
            id: id,
            map: country.maps[0],
          });
        }
      }
    }
    countrySeries.data.setAll(data);

    // Handle zoom to country and drill down
    continentSeries.mapPolygons.template.events.on("click", function (ev) {
      const dataItem = ev.target
        .dataItem! as am5.DataItem<am5map.IMapPolygonSeriesDataItem>;
      const data = dataItem?.dataContext as any;
      const selectedMap = countrySeries.getDataItemById(data.id)
        ?.dataContext as any;

      // Zoom to country
      const zoomContinentAnimation = continentSeries.zoomToDataItem(dataItem);
      continentSeries.zoomToDataItem(dataItem);

      if (selectedMap.map) {
        Promise.all([
          zoomContinentAnimation?.waitForStop(),
          am5.net.load(
            "https://cdn.amcharts.com/lib/5/geodata/json/" +
              selectedMap.map +
              ".json",
            chart
          ),
        ]).then((results) => {
          var geodata = am5.JSONParser.parse(results[1].response as string);
          countrySeries.setAll({
            geoJSON: geodata,
          });

          continentSeries.hide();
          countrySeries.show();
        });
      }
    });

    return () => {
      root.dispose();
    };
  }, []);

  return <div id="chartdiv" className={`${styles.map}`} />;
}

export default Map;
