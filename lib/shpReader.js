import { parseShp } from 'shpjs'

export const shpReader = async (shp, prj = undefined) => {
  if(shp instanceof File){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(shp)
      reader.onload = async (e) => {
        let res = await parseShp(e.target.result, prj)
        resolve(res) 
      }
      reader.onerror = (error) => {
        reject(error);
      };
    })
  }
  return await parseShp(shp, prj)
}

/**
 * 读取zip文件中的shp文件并解析成GeoJSON对象
 *
 * @param zip JSZip实例对象
 * @param names shp文件名Set
 * @param trans 是否进行坐标转换，默认为true
 * @returns 如果trans为true，则返回解析后的GeoJSON对象数组；否则返回包含解析后的GeoJSON对象数组和prj字符串的对象
 */
export const shpZipReader = async (zip, names, trans = true) => {
  let results = []
  let prjStr;
  for (const name of names) {
    let [shp, prj] = await Promise.all([
      zip.file(`${name}.shp`).async('arraybuffer'),
      zip.file(`${name}.prj`)?.async('string')
    ]);
    results.push(await shpReader(shp, trans ? prj : undefined));
    prjStr = prj; // 假设我们只需要最后一个prj文件的内容
  }
  if(trans){
    return results
  } else {
    return {
      value: results,
      prj: prjStr
    }
  }
}
