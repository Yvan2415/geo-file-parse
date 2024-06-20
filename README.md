# 解析geo文件转换为json格式

1. parseFile方法支持(*.geojson, *.shp, *.kml)类型, 或者此些类型的zip(支持多层嵌套)文件, 方法内部自动判断解析
2. 单文件返回 对象, 压缩包返回 数组, 需自行判断返回结果
3. 也导出geojsonReader/geojsonZipReader等方法, 提供自行解析方式

### shp文件
1. shp文件中可能还有.prj文件, 可以默认转换为wgs84格式(trans 参数), 其他文件解析后自行判断
