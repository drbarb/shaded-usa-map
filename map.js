function shadedUsaMapWidget_Init(elem, treeName) {
  // Load data
  if (typeof tree == 'undefined') {
    treeName = 'shadedUsaMapDatasource';
  }
  if (CTS && CTS.engine && CTS.engine.forrest) {
    try {
      var data = CTS(treeName + "|States!rows").nodes[0].toJson();
      var settings = CTS(treeName + "|Settings!rows").nodes[0].toJson()[0];
      settings.Width = parseInt(settings.Width);
      settings.Height = parseInt(settings.Height);
      shadedUsaMapWidget_Draw(elem, data, settings);
    } catch(e) {
      console.log(e);
    }
  }
}

function shadedUsaMapWidget_Draw(elem, data, settings) {
  var widget = CTS.Util.$(elem);

  // Draw the style element
  var styleElem = "<style>" +
    ".shaded-usa-map-widget svg {\n" +
    "  background: " + settings.BackgroundColor + ";\n" +
    "}\n" +
    ".shaded-usa-map-widget .shaded-usa-map-widget-states path {\n" +
    "  stroke: " + settings.StateLineColor + ";\n" +
    "  stroke-width:  " + settings.StateLineWidth + ";\n" +
    "}\n" +
    ".shaded-usa-map-widget #counties path {\n" +
    "  stroke: " + settings.CountryLineColor + ";\n" +
    "  stroke-width: " + settings.CountryLineWidth + ";\n" +
    "}\n" +
    "</style>";

  CTS.Util.$('body').append(styleElem);

  var mapElem = widget.find(".shaded-usa-map-widget-map").first()[0];

  var ratio = 1.92;
  var height = 300;
  var width = height * ratio;

  if (settings.Size == 'manual') {
    width = parseInt(settings.Width);
    height = parseInt(settings.Height);
  } else {
    // Figure out the biggest.
    var boxWidth = widget.width();
    var boxHeight = widget.height();

    height = widget.height();
    width = height * ratio;

    if (width > boxWidth) {
      width = boxWidth;
      height = width / ratio;
    }
  }

  var stateMappings = new Object();
  var values = [];

  for (var i = 0; i < data.length; i++) {
    var state = data[i];
    stateMappings[state.State] = parseFloat(state.Value);
    values.push(parseFloat(state.Value));
  }

  // Returns q#-9 where # is in [0,8].
  // This is the color code.
  var colorScale = d3.scale.linear()
                  .domain([d3.min(values), d3.max(values)])
                  .rangeRound([0, 8]);

  function quantize(d) {
    return "q" + colorScale(stateMappings[d.properties.name]) + "-9";
  }

  var path = d3.geo.path();
  var scaleRatio = 1.0;

  var svg = d3.select(mapElem)
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  var states = svg.append("g")
   .attr("class", "shaded-usa-map-widget-states " + settings.ColorFamily)
   .attr("transform", "scale(" + scaleRatio + ")");

  states.selectAll("path")
    .data(window.shadedUsaMapWidget_Data.features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", quantize);
}


CTS.status.libraryLoaded.then(function() {
  CTS.on('cts-received-graft', function(evt) {
    var doit = function() {
      var widgetContainer = evt.target.value;
      shadedUsaMapWidget_Init(widgetContainer);
    };
    var tryIt = function() {
      if ((typeof d3 != 'undefined') && (typeof window.shadedUsaMapWidget_Data != 'undefined')) {
        doit();
      } else {
        setTimeout(tryIt, 100);
      }
    }
    tryIt();
  })
});

