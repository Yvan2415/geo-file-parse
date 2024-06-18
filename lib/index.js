import { getType, handleZip } from './utils'
import { geojsonReader, geojsonZipReader } from './geojsonReader';
// import JSZip from 'jszip';
import { parseShp } from 'shpjs';
import { shpZipReader } from './shpReader';
import toGeoJSON from '@mapbox/togeojson'
import { kmlZipReader } from './kmlReader'


/**
 * 分析文件
 *
 * @param file 文件对象
 * @returns 无返回值
 */
export async function analysisFile (file) {
  let type = getType(file);
  console.log(type)
  // let reader = new FileReader();
  // reader.readAsText(file);
  // reader.onload = (e) => {
  //   const xml = new DOMParser().parseFromString(e.target.result, 'text/xml')
  //   let res = toGeoJSON.kml(xml)
  //   console.log(res)
  // }
  // if(type === 'application/zip'){ // 进行zip解析
    let res = await handleZip(file)

    console.log(res)
  // } else { // 不是压缩文件

  // }
  
}



