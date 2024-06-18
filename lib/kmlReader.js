import toGeoJSON from '@mapbox/togeojson'

export function kmlReader(text) {
  const xml = new DOMParser().parseFromString(text, "application/xml");
  return toGeoJSON.kml(xml);
}

export async function kmlZipReader(zip, names) {
  let results = []
  for (const name of names) {
    let res = await zip.file(`${name}.kml`).async('string')
    results.push(kmlReader(res));
  }
  return results;
}
