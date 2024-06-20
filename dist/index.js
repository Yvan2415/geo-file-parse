import JSZip from 'jszip';
import { parseShp } from 'shpjs';
import toGeoJSON from '@mapbox/togeojson';

/**
 * 获取文件类型
 *
 * @param file 文件对象
 * @returns 返回文件类型，若文件对象中没有类型则返回文件名最后一个点号后的字符串，否则返回空字符串
 */
function getType (file){
  if(file?.type) return file.type;
  const parts = file?.name.split('.');
  const lastPart = parts.pop();
  return lastPart && lastPart.length > 0 ? lastPart : '';
}

function classifyByName(files) {
  const keys = Object.keys(files);
  const nameSet = new Set();
  keys.forEach(key => {
    if(files[key].dir)
      return
    const filename = files[key].name;
    if (typeof filename !== 'string') {
      console.error(`Non-string filename encountered for key: ${key}`);
      return;
    }
    const name = filename.substring(0, filename.lastIndexOf("."));
    nameSet.add(name);
  });
  return nameSet
}

/**
 * 处理zip文件
 *
 * @param file zip文件
 * @returns 返回一个包含文件名的集合和zip文件的对象数组，如果zip文件中包含子zip文件，则返回一个包含子zip文件处理结果的数组
 */
async function handleZip(file) {
  let zip = await JSZip.loadAsync(file);
  let promiseList = [];
  Object.keys(zip.files).forEach(name => {
    if(name.endsWith('.zip')){
      promiseList.push((async () => {
        let childZip = zip.file(name).async('arraybuffer');
        return await handleZip(childZip)
      })());
      zip.remove(name);
    }
  });
  let childFile = [];
  if(promiseList.length){
    childFile = await Promise.all(promiseList);
  }
  let names = classifyByName(zip.files);
  let type = '';
  Object.keys(zip.files).some(filename => {
    let flag = ['shp', 'kml', 'geojson'].includes(getType({name: filename}));
    type = getType({name: filename});
    return flag
  });
  if(!names.size)
    return childFile.flat(Infinity)
  if(childFile.length)
    return childFile.flat(Infinity).concat({ names, zip, type })
  return [{ names, zip, type }]
}

/**
 * 读取 GeoJSON 文件并返回 Promise
 *
 * @param file GeoJSON 文件对象
 * @returns 返回解析后的文件内容字符串 Promise
 */
const geojsonReader = (file) => {
  if(file instanceof File){
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function (e) {
        let res = e.target?.result ?? {};
        resolve(JSON.parse(res));
      };
      reader.onerror = (error) => {
        reject(error);
      };
    })
  }
  return JSON.parse(res)
};

const geojsonZipReader = async (zip, names) => {
  let results = [];
  for (const name of names) {
    let res = await zip.file(`${name}.geojson`).async('string');
    results.push(JSON.parse(res));
  }
  return results;
};

const shpReader = async (shp, prj = undefined) => {
  if(shp instanceof File){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(shp);
      reader.onload = async (e) => {
        let res = await parseShp(e.target.result, prj);
        resolve(res); 
      };
      reader.onerror = (error) => {
        reject(error);
      };
    })
  }
  return await parseShp(shp, prj)
};

/**
 * 读取zip文件中的shp文件并解析成GeoJSON对象
 *
 * @param zip JSZip实例对象
 * @param names shp文件名Set
 * @param trans 是否进行坐标转换，默认为true
 * @returns 如果trans为true，则返回解析后的GeoJSON对象数组；否则返回包含解析后的GeoJSON对象数组和prj字符串的对象
 */
const shpZipReader = async (zip, names, trans = true) => {
  let results = [];
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
};

async function kmlReader(text) {
  if(text instanceof File){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(text);
      reader.onload = (e) => {
        const xml = new DOMParser().parseFromString(e.target.result, "application/xml");
        resolve(toGeoJSON.kml(xml)); 
      };
      reader.onerror = (error) => {
        reject(error);
      };
    })
  }
  const xml = new DOMParser().parseFromString(text, "application/xml");
  return toGeoJSON.kml(xml)
}

// 一个压缩包下面可能有多个地块文件
async function kmlZipReader(zip, names) {
  let results = [];
  for (const name of names) {
    let res = await zip.file(`${name}.kml`).async('string');
    results.push(await kmlReader(res));
  }
  return results;
}

const parseFuncs = {
  geojson: geojsonReader,
  geojsonZip: geojsonZipReader,
  shp: shpReader,
  shpZip: shpZipReader,
  kml: kmlReader,
  kmlZip: kmlZipReader
};

/**
 * 分析文件
 *
 * @param file 文件对象
 * @param trans 是否进行坐标转换, 只支持shp文件
 * @returns 无返回值
 */
async function parseFile (file, trans = true) {
  let type = getType(file);
  if(type.includes('zip')){ // 进行zip解析
    let res = await handleZip(file);
    const promiseList = [];
    res.forEach(item => {
      promiseList.push(parseFuncs[`${item.type}Zip`](item.zip, item.names, trans));
    });
    return [await Promise.all(promiseList)].flat(Infinity)
  } else if(type){
    return await parseFuncs[type](file, trans)
  }
}

export { geojsonReader, geojsonZipReader, kmlReader, kmlZipReader, parseFile, shpReader, shpZipReader };
