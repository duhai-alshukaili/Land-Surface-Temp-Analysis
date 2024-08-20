// Import country boundaries feature collection.
var countryBorders = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Apply filter where country name equals Uganda.
var omanBorder = countryBorders.filter(ee.Filter.eq('country_na', 'Oman'));

// Print new "ugandaBorder" object and explorer features and properties.
// There should only be one feature representing Uganda.
print(omanBorder);

// Add Oman outline to the Map as a layer.
Map.centerObject(omanBorder, 6);
Map.addLayer(omanBorder);

var visParams = {
  min: 14, 
  max: 20 , 
  palette: [
    '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
    '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
    '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
    'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
    'ff0000', 'de0101', 'c21301', 'a71001', '911003'
  ]
};


// Import night LST image collection.
var imageCollection = ee.ImageCollection("NOAA/VIIRS/001/VNP21A1N");
              

var imageArray = [];

for (var year = 2012; year <= 2023; year++) {
  var spring_start = String(year) + '-03-01';
  var spring_end   = String(year) + '-05-31';
  
  // Select only the 1km day LST data band, spring
  var studyArea = imageCollection.select('LST_1KM')
                        .filter(ee.Filter.date(spring_start, spring_end))
                        .reduce(ee.Reducer.mean())
                        .subtract(273.15)
                        .clip(omanBorder);
                        
  // Export spring image
  Export.image.toDrive({
    image: studyArea,
    description: 'StudyArea_Spring_' + year,
    folder: 'EarthEngineExports/spring',
    fileNamePrefix: 'StudyArea_Spring_' + year,
    region: omanBorder,
    scale: 1000,  // Adjust scale according to your needs
    crs: 'EPSG:4326',
    maxPixels: 1e13
  });
  
  
  
  var autumn_start = String(year) + '-09-01';
  var autumn_end   = String(year) + '-11-30';
  
  // Select only the 1km day LST data band, spring
  var studyArea = imageCollection.select('LST_1KM')
                        .filter(ee.Filter.date(autumn_start, autumn_end))
                        .reduce(ee.Reducer.mean())
                        .subtract(273.15)
                        .clip(omanBorder);
                        
  // Export autumn data
  Export.image.toDrive({
    image: studyArea,
    description: 'StudyArea_Autumn_' + year,
    folder: 'EarthEngineExports/autumn',
    fileNamePrefix: 'StudyArea_Autumn_' + year,
    region: omanBorder,
    scale: 1000,  // Adjust scale according to your needs
    crs: 'EPSG:4326',
    maxPixels: 1e13
  });
  
}
