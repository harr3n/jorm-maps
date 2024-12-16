import axios from "axios";
import {
  generateKmlPlacemark,
  generateKmlStyle,
  getFormattedDate,
  mergeGeoJsonCollections,
} from "./utils";
import { FeatureCollection } from "./schema";
import { uploadOrUpdateFile } from "./drive";

async function fetchGeoJson(url: string): Promise<FeatureCollection> {
  try {
    const response = await axios.get(url);
    const data = FeatureCollection.parse(response.data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch or validate GeoJSON from ${url}:`, error);
    throw error;
  }
}

function geoJsonToKml(featureCollection: FeatureCollection): string {
  const kmlStyles = featureCollection.features
    .map((feature) =>
      generateKmlStyle(feature.properties.id, feature.properties.style),
    )
    .join("\n");

  const kmlPlacemarks = featureCollection.features
    .map((feature) => generateKmlPlacemark(feature))
    .join("\n");

  return `
        <kml xmlns="http://www.opengis.net/kml/2.2">
            <Document>
                <name>Jorm - Friåkningsområden</name>
                <description>Pia doin it at da strip</description>
                ${kmlStyles}
                ${kmlPlacemarks}
            </Document>
        </kml>
    `;
}

async function main() {
  const polygonsUrl = "https://www.vinterturism.se/api/map/geojson/polygons/";
  const linesUrl = "https://www.vinterturism.se/api/map/geojson/lines/";

  try {
    console.log("Fetching GeoJSON data...");
    const collections = await Promise.all([
      fetchGeoJson(polygonsUrl),
      fetchGeoJson(linesUrl),
    ]);

    console.log("Merging GeoJSON collections...");
    const mergedGeoJson = mergeGeoJsonCollections([...collections]);

    console.log("Converting merged GeoJSON to KML...");
    const kml = geoJsonToKml(mergedGeoJson);
    await uploadOrUpdateFile(
      kml,
      `${getFormattedDate()} Regleringsområde - Frostviken.kml`,
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
