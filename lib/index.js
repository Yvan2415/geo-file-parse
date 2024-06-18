import { getType, classifyByName } from './utils'
import { geojsonReader } from './geojsonReader';
// import JSZip from 'jszip';
import { parseShp } from 'shpjs';
import { shpZipReader } from './shpReader';


/**
 * 分析文件
 *
 * @param file 文件对象
 * @returns 无返回值
 */
export async function analysisFile (file) {
  let type = getType(file);
  console.log(type)
  if(type === 'application/zip'){ // 进行zip解析
    handleZip(file)
  } else { // 不是压缩文件

  }
  
}

async function handleZip(file) {
  let zip = new JSZip();
  let res = await zip.loadAsync(file)
  let fileType = undefined
  Object.keys(res.files).some(function (key) {
    if(key.endsWith('.shp')){
      fileType = 'shp'
      return true
    }
  })
  let names = classifyByName(res.files)
  console.log(names)

  let res2 = await shpZipReader(zip, names)
  console.log(res2)
  // return {
  //   type,
  //   classify
  // }
}


// let zip = new JSZip();
// let res = await zip.loadAsync(file)
// zip.file('ZELENCHUKOV_RAY-STEFANOVI(11003)_2024.shp').async('arraybuffer').then(function (data) {
//   zip.file('ZELENCHUKOV_RAY-STEFANOVI(11003)_2024.prj').async('string').then(function (data2) {
//     console.log(data, data2, 'shp文件')
//     let res = parseShp(data)
//   })
// })

