import JSZip from 'jszip'
/**
 * 获取文件类型
 *
 * @param file 文件对象
 * @returns 返回文件类型，若文件对象中没有类型则返回文件名最后一个点号后的字符串，否则返回空字符串
 */
export function getType (file){
  if(file?.type) return file.type;
  const parts = file?.name.split('.');
  const lastPart = parts.pop();
  return lastPart && lastPart.length > 0 ? lastPart : '';
}

export function classifyByName(files) {
  const keys = Object.keys(files)
  const nameSet = new Set()
  keys.forEach(key => {
    if(files[key].dir)
      return
    const filename = files[key].name
    if (typeof filename !== 'string') {
      console.error(`Non-string filename encountered for key: ${key}`);
      return;
    }
    const name = filename.substring(0, filename.lastIndexOf("."))
    nameSet.add(name)
  })
  return nameSet
}

/**
 * 处理zip文件
 *
 * @param file zip文件
 * @returns 返回一个包含文件名的集合和zip文件的对象数组，如果zip文件中包含子zip文件，则返回一个包含子zip文件处理结果的数组
 */
export async function handleZip(file) {
  let zip = await JSZip.loadAsync(file)
  let promiseList = []
  Object.keys(zip.files).forEach(name => {
    if(name.endsWith('.zip')){
      promiseList.push((async () => {
        let childZip = zip.file(name).async('arraybuffer')
        return await handleZip(childZip)
      })())
      zip.remove(name)
    }
  })
  let childFile = []
  if(promiseList.length){
    childFile = await Promise.all(promiseList)
  }
  let names = classifyByName(zip.files)
  let type = ''
  Object.keys(zip.files).some(filename => {
    let flag = ['shp', 'kml', 'geojson'].includes(getType({name: filename}))
    type = getType({name: filename})
    return flag
  })
  if(!names.size)
    return childFile.flat(Infinity)
  if(childFile.length)
    return childFile.flat(Infinity).concat({ names, zip, type })
  return [{ names, zip, type }]
}


