import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_continentsLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_data_countries from "@amcharts/amcharts5-geodata/data/countries2";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import styles from "./map.module.css";
import { Dispatch, SetStateAction, useLayoutEffect } from "react";
import { CountryData, useGetUserLocationsResponse } from "../../types/types";
import { Spin } from "antd";

export interface MapProps {
  visitedPlaces: useGetUserLocationsResponse;
  wishLocations: useGetUserLocationsResponse;
  globeVisualisation: boolean;
  setCountryData: Dispatch<SetStateAction<CountryData>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export function Map({
  visitedPlaces,
  wishLocations,
  globeVisualisation,
  setCountryData,
  setModalOpen,
}: MapProps) {
  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: globeVisualisation
          ? am5map.geoOrthographic()
          : am5map.geoNaturalEarth1(),
        draggable: false,
      })
    );

    const zoomControl = chart.set(
      "zoomControl",
      am5map.ZoomControl.new(root, {})
    );

    // Create seperate map Series, exclude Antarctica
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

    const backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {})
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
          visitedPlaces.locations.find(
            (record) => record.location.split("-")[0] === targeted.id
          )
        ) {
          return am5.color("#888888");
        }
        return fill;
      }
    );

    // Add country maps to individual countries
    let data = [];
    for (const id in am5geodata_data_countries) {
      if (am5geodata_data_countries.hasOwnProperty(id)) {
        const country = am5geodata_data_countries[id];
        if (country.maps.length) {
          data.push({
            id: id,
            map: country.maps[0],
          });
        }
      }
    }
    countrySeries.data.setAll(data);

    const legend = selectedCountrySeries.children.push(
      am5.Legend.new(root, {
        nameField: "name",
        fillField: "color",
        strokeField: "color",
      })
    );

    legend.data.setAll([
      {
        name: "Vistied",
        color: am5.color("#888888"),
      },
      {
        name: "Wish List",
        color: am5.color("#EAEAEA"),
      },
    ]);

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
          const geodata = am5.JSONParser.parse(results[1].response as string);
          selectedCountrySeries.setAll({
            geoJSON: geodata,
          });

          // Recolour visited states/provinces
          selectedCountrySeries.mapPolygons.template.adapters.add(
            "fill",
            function (fill, target) {
              const targeted = target.dataItem?.dataContext! as any;
              if (
                targeted.id &&
                visitedPlaces.locations.find(
                  (record) => record.location === targeted.id
                )
              ) {
                return am5.color("#888888");
              }

              if (
                targeted.id &&
                wishLocations.locations.find(
                  (record) => record.location === targeted.id
                )
              ) {
                return am5.color("#EAEAEA");
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
      const codes = targetted.id.split("-");
      setCountryData({
        country: targetted.CNTRY,
        province: targetted.name,
        countryCode: codes[0],
        provinceCode: codes[1],
      });
      setModalOpen(true);
    });

    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color(0x000000),
      fillOpacity: 0.07,
    });

    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    });

    let homeButton = zoomControl.children.moveValue(
      am5.Button.new(root, {
        paddingTop: 10,
        paddingBottom: 10,
        icon: am5.Graphics.new(root, {
          fill: am5.color(0xffffff),
          svgPath:
            "M17, 8 L14, 8 L14, 16 L10, 16 L10 ,10 L6, 10 L6,16 L2,16 L2, 8 L0,8 L8, 1 L16, 8 Z M16, 9",
        }),
      }),
      0
    );

    // Set button backgrounds to grey
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

    am5plugins_exporting.Exporting.new(root, {
      menu: am5plugins_exporting.ExportingMenu.new(root, {}),
      pdfOptions: { disabled: true },
      printOptions: { disabled: true },
    });

    return () => {
      root.dispose();
    };
  }, [
    globeVisualisation,
    setCountryData,
    setModalOpen,
    visitedPlaces,
    wishLocations.locations,
  ]);

  return (
    <>
      {visitedPlaces.isLoading && (
        <div className={styles.mapLoaderContainer}>
          <Spin className={styles.loader} />
        </div>
      )}
      <div
        id="chartdiv"
        className={
          visitedPlaces.isLoading
            ? `${styles.map} ${styles.mapLoading}`
            : `${styles.map}`
        }
      />
    </>
  );
}

export default Map;
