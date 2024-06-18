/**
 * 读取 GeoJSON 文件并返回 Promise
 *
 * @param file GeoJSON 文件对象
 * @returns 返回解析后的文件内容字符串 Promise
 */
export const geojsonReader = (file) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function (e) {
      let res = e.target?.result ?? {}
      resolve(JSON.parse(res))
    }
    reader.onerror = (error) => {
      reject(error);
    };
  })
}

export const geojsonZipReader = async (zip, names) => {
  let results = []
  for (const name of names) {
    let res = zip.file(`${name}.geojson`).async('string')
    results.push(JSON.parse(res));
  }
  return results;
}
