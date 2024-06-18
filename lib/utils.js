/**
 * 获取文件类型
 *
 * @param file 文件对象
 * @returns 返回文件类型，若文件对象中没有类型则返回文件名最后一个点号后的字符串，否则返回空字符串
 */
export function getType (file){
  if(file.type) return file.type;
  const parts = file.name.split('.');
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

