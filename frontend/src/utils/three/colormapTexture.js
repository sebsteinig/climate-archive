import { Color, DataTexture, LinearFilter } from "three"

function createColormapTexture(colormapName) {
  let colors

  if (colormapName == "COP26") {
    colors = [
      // 1 blue
      "rgb(209,229,240)",
      // 9 reds
      "rgb(255,245,240)",
      "rgb(254,224,210)",
      "rgb(252,187,161)",
      "rgb(252,146,114)",
      "rgb(251,106,74)",
      "rgb(239,59,44)",
      "rgb(203,24,29)",
      "rgb(165,15,21)",
      "rgb(103,0,13)",
    ]
  } else if (colormapName == "COP26v2") {
    colors = [
      "rgb(232,142,113)",
      "rgb(236,146,120)", //'rgb(230,123,93)',
      "rgb(220,90,71)", //'rgb(228,103,76)'
      //'rgb(223,82,62)',
      "rgb(208,65,51)",
      //'rgb(190,50,43)',
      "rgb(196,55,41)", // 'rgb(184,45,38)'
      "rgb(160,40,33)", //
      "rgb(127,22,26)",
      "rgb(94,14,18)",
      // 'rgb(75,19,11)',
      // 'rgb(38,10,6)',
    ]
  } else if (colormapName == "YlGnBu-9") {
    // https://colorbrewer2.org/#type=sequential&scheme=YlGnBu&n=9
    colors = [
      "rgb(255,255,217)",
      "rgb(237,248,177)",
      "rgb(199,233,180)",
      "rgb(127,205,187)",
      "rgb(65,182,196)",
      "rgb(29,145,192)",
      "rgb(34,94,168)",
      "rgb(37,52,148)",
      "rgb(8,29,88)",
    ]
  } else if (colormapName == "PiYG-12") {
    // https://colorbrewer2.org/#type=sequential&scheme=YlGnBu&n=9
    colors = [
      "rgb(142,1,82)",
      "rgb(197,27,125)",
      "rgb(222,119,174)",
      "rgb(241,182,218)",
      "rgb(253,224,239)",
      "rgb(247,247,247)",
      "rgb(247,247,247)",
      "rgb(230,245,208)",
      "rgb(184,225,134)",
      "rgb(127,188,65)",
      "rgb(77,146,33)",
      "rgb(39,100,25)",
    ]
  } else if (colormapName == "NCL_BlRd") {
    // https://colorbrewer2.org/#type=sequential&scheme=YlGnBu&n=9
    colors = [
      "rgb(22,49,116)",
      "rgb(41,86,171)",
      "rgb(91,159,235)",
      "rgb(125,190,247)",
      "rgb(183,239,253)",
      "rgb(222,251,254)",
      "rgb(254,247,207)",
      "rgb(249,213,109)",
      "rgb(241,150,54)",
      "rgb(235,85,40)",
      "rgb(197,46,28)",
      "rgb(152,29,19)",
    ]
  } else if (colormapName == "RdYlBu") {
    // https://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=11
    colors = [
      "rgb(49,54,149)",
      "rgb(69,117,180)",
      "rgb(116,173,209)",
      "rgb(171,217,233)",
      "rgb(224,243,248)",
      "rgb(255,255,191)",
      "rgb(254,224,144)",
      "rgb(253,174,97)",
      "rgb(244,109,67)",
      "rgb(215,48,39)",
      "rgb(165,0,38)",
    ]
  } else if (colormapName == "RdBu_custom") {
    // https://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=11
    colors = [
      "rgb(0,20,50)",
      "rgb(5,48,97)",
      "rgb(33,102,172)",
      "rgb(67,147,195)",
      "rgb(146,197,222)",
      "rgb(247,247,247)",
      "rgb(244,165,130)",
      "rgb(214,96,77)",
      "rgb(178,24,43)",
      "rgb(103,0,31)",
      "rgb(50,0,20)",
    ]
  } else if (colormapName == "orography") {
    colors = [
      "rgb(39,90,49)",
      "rgb(53,114,54)",
      "rgb(92,166,74)",
      "rgb(133,195,107)",
      "rgb(231,255,202)",
      "rgb(199,220,140)",
      "rgb(149,137,59)",
      "rgb(114,83,33)",
      "rgb(84,41,16)",
      "rgb(98,74,56)",
      "rgb(130,115,105)",
      "rgb(159,156,152)",
    ]
  } else if (colormapName == "topography") {
    colors = [
      "rgb(0,0,42)",
      "rgb(1,0,77)",
      "rgb(2,0,115)",
      "rgb(5,0,156)",
      "rgb(7,0,199)",
      "rgb(11,0,244)",
      "rgb(12,26,244)",
      "rgb(31,69,244)",
      "rgb(49,112,245)",
      "rgb(68,154,247)",
      "rgb(88,200,249)",
      "rgb(110,249,252)",
      "rgb(39,90,49)",
      "rgb(53,114,54)",
      "rgb(92,166,74)",
      "rgb(133,195,107)",
      "rgb(231,255,202)",
      "rgb(199,220,140)",
      "rgb(149,137,59)",
      "rgb(114,83,33)",
      "rgb(84,41,16)",
      "rgb(98,74,56)",
      "rgb(130,115,105)",
      "rgb(159,156,152)",
    ]
  } else if (colormapName == "amwg_blueyellowred_whites") {
    // https://www.ncl.ucar.edu/Document/Graphics/ColorTables/amwg_blueyellowred.shtml
    colors = [
      "rgb(130,32,240)",
      "rgb(0,0,150)",
      "rgb(0,0,205)",
      "rgb(65,105,225)",
      "rgb(30,144,255)",
      "rgb(0,191,255)",
      "rgb(160,210,255)",
      "rgb(210,245,255)",

      "rgb(255,255,255)",
      "rgb(255,255,255)",

      "rgb(255,255,200)",
      "rgb(255,225,50)",
      "rgb(255,170,0)",
      "rgb(255,110,0)",
      "rgb(255,0,0)",
      "rgb(200,0,0)",
      "rgb(160,35,35)",
      "rgb(255,105,180)",
    ]
  }

  const width = colors.length
  const height = 1

  const size = width * height
  const data = new Uint8Array(4 * size)

  for (let i = 0; i < size; i++) {
    const rgb = new Color(colors[i])

    const stride = i * 4

    data[stride] = rgb.r * 255
    data[stride + 1] = rgb.g * 255
    data[stride + 2] = rgb.b * 255
    data[stride + 3] = 1 * 255
  }

  // used the buffer to create a DataTexture
  const colormapTexture = new DataTexture(data, width, height)
  colormapTexture.needsUpdate = true
  colormapTexture.minFilter = LinearFilter
  colormapTexture.maxFilter = LinearFilter

  return colormapTexture
}

export { createColormapTexture }
