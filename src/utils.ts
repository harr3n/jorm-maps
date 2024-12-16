import { Feature, FeatureCollection, Style } from "./schema";

const rgbaToAbgr = (rgba: string): string => {
  const match = rgba.match(/rgba?\((\d+), (\d+), (\d+), ([\d.]+)\)/);
  if (!match) return "00ffffff"; // Default transparent white
  const [r, g, b, a] = match.slice(1).map(Number);
  const alpha = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");
  const red = r.toString(16).padStart(2, "0");
  const green = g.toString(16).padStart(2, "0");
  const blue = b.toString(16).padStart(2, "0");
  return `${alpha}${blue}${green}${red}`;
};

const coordinatesToKml = (coordinates: number[][]): string => {
  return coordinates.map(([lng, lat]) => `${lng},${lat},0`).join(" ");
};

function mergeGeoJsonCollections(
  collections: FeatureCollection[],
): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: collections.flatMap((collection) => collection.features),
  };
}

const generateKmlStyle = (id: string | null, style: Style): string => {
  const strokeColor = style?.stroke?.color || "ff000000"; // Default black stroke
  const strokeWidth = style?.stroke?.width || 1;
  const fillColor = style?.fill?.color || "00ffffff"; // Default transparent fill

  return `
            <Style id="${id || `style-${Math.random().toString(36).substr(2, 5)}`}">
                <LineStyle>
                    <color>${rgbaToAbgr(strokeColor)}</color>
                    <width>${strokeWidth}</width>
                </LineStyle>
                <PolyStyle>
                    <color>${rgbaToAbgr(fillColor)}</color>
                </PolyStyle>
            </Style>
        `;
};

const generateKmlPlacemark = (feature: Feature): string => {
  const { geometry, properties } = feature;
  const { type, coordinates } = geometry;
  const styleId =
    properties.id || `feature-${Math.random().toString(36).substr(2, 5)}`;

  if (type === "Polygon") {
    return `
                <Placemark>
                    <name>${properties.name || ""}</name>
                    <description>${properties.description || ""}</description>
                    <styleUrl>#${styleId}</styleUrl>
                    <Polygon>
                        <outerBoundaryIs>
                            <LinearRing>
                                <coordinates>
                                    ${coordinatesToKml(coordinates[0])}
                                </coordinates>
                            </LinearRing>
                        </outerBoundaryIs>
                    </Polygon>
                </Placemark>
            `;
  } else if (type === "LineString") {
    return `
                <Placemark>
                    <name>${properties.name || ""}</name>
                    <description>${properties.description || ""}</description>
                    <styleUrl>#${styleId}</styleUrl>
                    <LineString>
                        <coordinates>
                            ${coordinatesToKml(coordinates)}
                        </coordinates>
                    </LineString>
                </Placemark>
            `;
  } else {
    console.warn(`Unsupported geometry type: ${type}`);
    return "";
  }
};

function getFormattedDate(date = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export {
  rgbaToAbgr,
  coordinatesToKml,
  generateKmlStyle,
  generateKmlPlacemark,
  mergeGeoJsonCollections,
  getFormattedDate,
};
