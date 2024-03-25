import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_continentsLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_data_countries from "@amcharts/amcharts5-geodata/data/countries2";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import styles from "./map.module.css";
import { useLayoutEffect, useState } from "react";
import VisitedLocationModal from "../visited_location_modal/visited_location_modal";
import { CountryData } from "../../types/types";

export interface MapProps {
  visitedPlaces: Array<string>;
}

export function Map({ visitedPlaces }: MapProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [countryData, setCountryData] = useState<CountryData>({
    country: "",
    province: "",
    countryCode: "",
    provinceCode: "",
  });

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
        draggable: false,
      })
    );

    const zoomControl = chart.set(
      "zoomControl",
      am5map.ZoomControl.new(root, {})
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

    const selectedCountrySeries = chart.series.push(
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
      fill: am5.color("#aaaaaa"),
      templateField: "polygonSettings",
    });

    // Highlight country on hover
    continentSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#6c6765"),
    });

    selectedCountrySeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      fill: am5.color("#aaaaaa"),
      interactive: true,
    });

    selectedCountrySeries.mapPolygons.template.states.create("hover", {
      fill: am5.color("#6c6765"),
    });

    // Set all visited countries to different colour
    continentSeries.mapPolygons.template.adapters.add(
      "fill",
      function (fill, target) {
        const targeted = target.dataItem?.dataContext! as any;
        if (
          targeted.id &&
          visitedPlaces.find((id) => id.includes(`${targeted.id}-`))
        ) {
          return am5.color("#888888");
        }
        return fill;
      }
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
          selectedCountrySeries.setAll({
            geoJSON: geodata,
          });

          // Recolour visited states/provinces
          selectedCountrySeries.mapPolygons.template.adapters.add(
            "fill",
            function (fill, target) {
              const targeted = target.dataItem?.dataContext! as any;
              if (targeted.id && visitedPlaces.includes(targeted.id)) {
                return am5.color("#888888");
              }
              return fill;
            }
          );

          continentSeries.hide();
          selectedCountrySeries.show();
        });
      }
    });

    // Open modal with country code when state/province is clicked
    selectedCountrySeries.mapPolygons.template.events.on("click", (ev) => {
      const targetted = ev.target.dataItem?.dataContext as any;
      const codes = targetted.id.split("-")
      setCountryData({
        country: targetted.CNTRY,
        province: targetted.name,
        countryCode: codes[0],
        provinceCode: codes[1],
      });
      setShowModal(true);
    });

    let homeButton = zoomControl.children.moveValue(
      am5.Button.new(root, {
        paddingTop: 10,
        paddingBottom: 10,
        icon: am5.Graphics.new(root, {
          svgPath:
            "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
          fill: am5.color(0xffffff),
        }),
      }),
      0
    );

    zoomControl.plusButton.get("background")?.setAll({
      fill: am5.color("#6c6765"),
    });
    zoomControl.minusButton.get("background")?.setAll({
      fill: am5.color("#6c6765"),
    });
    homeButton.get("background")?.setAll({
      fill: am5.color("#6c6765"),
    });

    homeButton.events.on("click", function () {
      chart.goHome();
      continentSeries.show();
      selectedCountrySeries.hide();
    });

    return () => {
      root.dispose();
    };
  }, [visitedPlaces]);

  return (
    <>
      <div id="chartdiv" className={`${styles.map}`} />
      <VisitedLocationModal
        showModal={showModal}
        setShowModal={setShowModal}
        countryData={countryData}
      />
    </>
  );
}

export default Map;
