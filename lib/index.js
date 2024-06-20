import { getType, handleZip } from './utils'
import { geojsonReader, geojsonZipReader } from './jsonReader'
import { shpReader, shpZipReader } from './shpReader'
import { kmlReader, kmlZipReader } from './kmlReader'

export {
  geojsonReader,
  geojsonZipReader,
  shpReader,
  shpZipReader,
  kmlReader,
  kmlZipReader
}

const parseFuncs = {
  geojson: geojsonReader,
  geojsonZip: geojsonZipReader,
  shp: shpReader,
  shpZip: shpZipReader,
  kml: kmlReader,
  kmlZip: kmlZipReader
}

/**
 * 分析文件
 *
 * @param file 文件对象
 * @param trans 是否进行坐标转换, 只支持shp文件
 * @returns 无返回值
 */
export async function parseFile (file, trans = true) {
  let type = getType(file);
  if(type.includes('zip')){ // 进行zip解析
    let res = await handleZip(file)
    const promiseList = []
    res.forEach(item => {
      promiseList.push(parseFuncs[`${item.type}Zip`](item.zip, item.names, trans))
    })
    return [await Promise.all(promiseList)].flat(Infinity)
  } else if(type){
    return await parseFuncs[type](file, trans)
  }
}
