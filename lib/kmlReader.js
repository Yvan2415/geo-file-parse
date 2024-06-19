import toGeoJSON from '@mapbox/togeojson'

export async function kmlReader(text) {
  if(text instanceof File){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(text)
      reader.onload = (e) => {
        const xml = new DOMParser().parseFromString(e.target.result, "application/xml");
        resolve(toGeoJSON.kml(xml)) 
      }
      reader.onerror = (error) => {
        reject(error);
      };
    })
  }
  const xml = new DOMParser().parseFromString(text, "application/xml");
  return toGeoJSON.kml(xml)
}

// 一个压缩包下面可能有多个地块文件
export async function kmlZipReader(zip, names) {
  let results = []
  for (const name of names) {
    let res = await zip.file(`${name}.kml`).async('string')
    results.push(await kmlReader(res));
  }
  return results;
}
