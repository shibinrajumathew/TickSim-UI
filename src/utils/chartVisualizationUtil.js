import * as d3 from "d3";
let hLineDataSet = [];
let tLineDataSet = [];
let xNewScale;
let yNewScale;
let svgXPosition = 0;
let svgYPosition = 0;
//svg mouse move
let xMousePoint = null;
let yMousePoint = null;
const fixed = (x) => Number.parseFloat(x).toFixed(2);
const round = (x) => Math.round(x);

let formatDate = d3.utcFormat("%B %-d, %Y");
let formatValue = d3.format(".2f");
let formatChange = (y0, y1) => {
  let f = d3.format("+.2%");
  return f((y1 - y0) / y0);
};
const getFormattedDate = (date, prevDate) => {
  if (prevDate && date.getDate() !== prevDate.getDate()) {
    if (prevDate && date.getMonth() !== prevDate.getMonth()) {
      if (date.getYear() !== prevDate.getYear()) {
        return getLongYear(date);
      }
      return getShortMonthName(date);
    }
    return date.getDate();
  }
  if (prevDate && date.getDate() === prevDate.getDate()) {
    return getShortTime(date);
  }
  if (prevDate === null) return getLongYear(date);
  return date.getDate();
};
const getShortMonthName = (date) => {
  let format = d3.timeFormat("%d %b");
  return format(date);
};
// const getShortDate = (date) => {
//   let format = d3.timeFormat("%d %b %Y");
//   return format(date);
// };
const getLongYear = (date) => {
  let format = d3.timeFormat("%d %b %y");
  return format(date);
};
const getShortTime = (date) => {
  let format = d3.timeFormat("%H:%M");
  return format(date);
};
const getApiDateFormat = (date) => {
  let format = d3.timeFormat("%Y-%m-%d");
  return format(date);
};

/////////////////////////////////////////////////////////////////
const getNewScales = () => {
  return {
    xNewScale,
    yNewScale,
  };
};
const removeSvg = (endingId) => {
  d3.selectAll(`g#parentGroup${endingId} g.xAxis`).remove();
  d3.selectAll(`g#parentGroup${endingId} g.yAxis`).remove();
  d3.selectAll(`g#candleWickGroup${endingId} g`).remove();
};
//mouse points
const svgMouseMove = (endingId, position, xAxisLeftEnd, xAxisRightEnd) => {
  let xPoint;
  let yPoint;

  d3.select(`svg#svgMainNode${endingId}`).on("mousemove", (event) => {
    svgXPosition = position.x;
    svgYPosition = position.y;
    xMousePoint = event.pageX - svgXPosition;
    yMousePoint = event.pageY - svgYPosition;
    xPoint = round(xNewScale.invert(xMousePoint));
    yPoint = fixed(yNewScale.invert(yMousePoint));
    moveCrossWire(endingId, xPoint, yPoint);
  });

  return { xPoint, yPoint };
};
const moveCrossWire = (endingId, xPoint, yPoint) => {
  d3.select(`line#crossWireXAxis${endingId}`)
    .attr("y1", yNewScale(yPoint))
    .attr("y2", yNewScale(yPoint));
  d3.select(`line#crossWireYAxis${endingId}`)
    .attr("x1", xNewScale(xPoint))
    .attr("x2", xNewScale(xPoint));
};
const getDateArray = (totalCandleCount, candleData) =>
  d3.range(totalCandleCount).map((i) => candleData[i].date);

function tLineDragStarted() {
  d3.select(this).raise().classed("active", true);
}
function tLineDragging(event) {
  const isRightElement = +d3.select(this).attr("data-currentElementPosition");
  const {
    sourceEvent: { pageY: y, pageX: x },
  } = event;
  let xPoint = round(xNewScale.invert(x - svgXPosition));
  let yPoint = fixed(yNewScale.invert(y - svgYPosition));

  let [oldData] = d3.select(this).data();
  const parentNode = d3.select(this.parentElement);
  const lineNode = parentNode.select("line");
  const leftCircle = parentNode.select("circle#c1");
  const rightCircle = parentNode.select("circle#c2");
  let newData = null;

  if (isRightElement) {
    newData = [
      {
        x1: oldData.x1,
        x2: xPoint,
        y1: oldData.y1,
        y2: yPoint,
      },
    ];
    parentNode.data(newData);
    rightCircle
      .attr("cx", (d) => xNewScale(d.x2))
      .attr("cy", (d) => yNewScale(d.y2));
    lineNode
      .attr("x2", (d) => xNewScale(d.x2))
      .attr("y2", (d) => yNewScale(d.y2));
  } else {
    newData = [
      {
        x1: xPoint,
        x2: oldData.x2,
        y1: yPoint,
        y2: oldData.y2,
      },
    ];
    parentNode.data(newData);
    leftCircle
      .attr("cx", (d) => xNewScale(d.x1))
      .attr("cy", (d) => yNewScale(d.y1));

    lineNode
      .attr("x1", (d) => xNewScale(d.x1))
      .attr("y1", (d) => yNewScale(d.y1));
  }
}
function tLineDragEnd(event) {
  d3.select(this).classed("active", false);
}

function hLineDragStarted(event) {
  d3.select(this).classed("active", true);
}
function hLineDragging(event) {
  const {
    sourceEvent: { pageY: y },
  } = event;
  let yPoint = fixed(yNewScale.invert(y - svgYPosition));
  let [oldData] = d3.select(this).data(); //array 0 th element
  const parentNode = d3.select(this.parentElement);
  const lineNode = parentNode.select("line");
  const circle = parentNode.select("circle");
  oldData.y = yPoint;
  lineNode.attr("y1", (d) => yNewScale(d.y)).attr("y2", (d) => yNewScale(d.y));
  circle.attr("cy", (d) => yNewScale(d.y));
}
function hLineDragEnd(e) {
  d3.select(this).classed("active", false);
}

let tLineDrag = d3
  .drag()
  .on("start", tLineDragStarted)
  .on("drag", tLineDragging)
  .on("end", tLineDragEnd);

let hLineDrag = d3
  .drag()
  .on("start", hLineDragStarted)
  .on("drag", hLineDragging)
  .on("end", hLineDragEnd);

function deleteNodeOnRightButtonClick(d) {
  d3.select(this.parentNode).remove();
}
/////////////////////////////////////////////////////////////////

// Scale
const getXScale = (totalCandleCount, xAxisLeftEnd, xAxisRightEnd) =>
  d3
    .scaleLinear()
    .domain([0, totalCandleCount])
    .range([xAxisLeftEnd, xAxisRightEnd]);
const getYScale = (candleData, yAxisTopEnd, yAxisBottomEnd) => {
  let yDomain = [
    d3.max(candleData, (d) => d.high),
    d3.min(candleData, (d) => d.low),
  ];
  let scaleModifier = d3.mean(candleData, (d) => d.high - d.low);
  yDomain = [yDomain[0] + scaleModifier, yDomain[1] - scaleModifier];
  return d3.scaleLinear().domain(yDomain).range([yAxisTopEnd, yAxisBottomEnd]);
};
// Axis
const getXAxis = (xScale, yAxisBottomEnd, dateArray) => {
  let prevDate = null;
  return d3
    .axisBottom(xScale)
    .tickSize(yAxisBottomEnd)
    .tickFormat((d) => {
      let parsedDate = parseInt(dateArray[d]);
      if (Number.isNaN(parsedDate)) return "";
      let formattedDate = new Date(dateArray[d]);
      // let prevDate = d < 1 ? null : new Date(dateArray[d - 1]);
      let xAxisFormattedDate = getFormattedDate(formattedDate, prevDate);
      prevDate = formattedDate;
      if (d === dateArray.length - 1) prevDate = null;
      return xAxisFormattedDate;
    });
};
const getYAxis = (yScale, xAxisRightEnd) =>
  d3.axisRight().scale(yScale).tickSize(xAxisRightEnd);
//Axis node
const getXAxisNode = (parentGroup) =>
  d3.select(parentGroup).append("g").attr("class", "xAxis");
const getYAxisNode = (parentGroup) =>
  d3.select(parentGroup).append("g").attr("class", "yAxis");
const attachZoomToRec = (rectNode, zoom) => d3.select(rectNode).call(zoom);

//Candle initial draw
const drawCandleAndWick = (
  parentCandleGroup,
  candleData,
  xScale,
  xBand,
  yScale,
  dateArray,
  endingId
) => {
  const g = d3
    .select("g#candleWickGroup" + endingId)
    .append("g")
    .selectAll("g")
    .data(candleData)
    .join("g");
  g.append("polygon")
    .attr("points", (d) => {
      const { open, close, date } = d;
      let xDateIndex = dateArray.indexOf(date);
      let polygonX1 = xScale(xDateIndex) - xBand;
      let polygonX2 = xScale(xDateIndex) + xBand;
      let polygonY1 = yScale(close);
      const openPrice = close === open ? open + 0.04 : open;
      let polygonY2 = yScale(openPrice);
      let candleBodyPoint =
        polygonX1 +
        "," +
        polygonY1 +
        "," +
        polygonX2 +
        "," +
        polygonY1 +
        "," +
        polygonX2 +
        "," +
        polygonY2 +
        "," +
        polygonX1 +
        "," +
        polygonY2;

      return candleBodyPoint;
    })
    .attr(
      "style",
      (d) =>
        d.open < d.close //profit
          ? "stroke:none;fill:" + d3.schemePaired[3]
          : d.open < d.close //loss
          ? "stroke:none;fill:" + d3.schemePaired[5]
          : d.high > d.close //top rejection
          ? "stroke:none;fill:" + d3.schemePaired[5]
          : "stroke:none;fill:" + d3.schemePaired[3] //equal rejection
    )
    .append("title")
    .text(
      (d) => `${formatDate(new Date(d.date))}
            Open: ${formatValue(d.open)}
            Close: ${formatValue(d.close)} (${formatChange(d.open, d.close)})
            Low: ${formatValue(d.low)}
            High: ${formatValue(d.high)}`
    );
  g.append("line")
    .attr("x1", (d) => {
      let xDateIndex = dateArray.indexOf(d.date);
      return xScale(xDateIndex);
    })
    .attr("y1", (d) => yScale(d.high))
    .attr("x2", (d) => {
      let xDateIndex = dateArray.indexOf(d.date);
      return xScale(xDateIndex);
    })
    .attr("y2", (d) => yScale(d.low))
    .attr("stroke-width", Math.max(xBand * 0.01, 1))
    .attr(
      "stroke",
      (d) =>
        d.open < d.close //profit
          ? d3.schemePaired[3]
          : d.open > d.close //loss
          ? d3.schemePaired[5]
          : d.high > d.close //top rejection
          ? d3.schemePaired[5]
          : d3.schemePaired[3] //equal rejection
    );
  return g;
};

const getZoom = (
  zoomLeftEnd,
  zoomRightEnd,
  dragLeftEnd,
  dragRightEnd,
  zoomHandler,
  xScale,
  xAxis,
  gXAxis,
  yScale,
  yAxis,
  gYAxis,
  dateArray,
  xBand,
  xAxisLeftEnd,
  xAxisRightEnd,
  endingId
) => {
  let zoom = d3
    .zoom()
    .extent([zoomLeftEnd, zoomRightEnd])
    .scaleExtent([0.1, 50])
    .translateExtent([dragLeftEnd, dragRightEnd])
    .on("zoom", (e) =>
      zoomHandler(
        e,
        xScale,
        xAxis,
        gXAxis,
        yScale,
        yAxis,
        gYAxis,
        dateArray,
        xBand,
        xAxisLeftEnd,
        xAxisRightEnd,
        endingId
      )
    );

  return zoom;
};

const initialZoom = (
  lastNCandlesCount,
  totalCandleCount,
  xScale,
  svgDimension,
  xAxis,
  gXAxis,
  yAxis,
  gYAxis,
  rect,
  zoom,
  scales
) => {
  let dXValue = xScale(totalCandleCount) - xScale(0);
  let leftCandlePoint = xScale(totalCandleCount - lastNCandlesCount);
  let rightCandlePoint = xScale(totalCandleCount);
  let deltaInitialZoomedDataPoints = rightCandlePoint - leftCandlePoint;
  let k = dXValue / deltaInitialZoomedDataPoints;
  // Translate
  let tx = svgDimension.x - k * leftCandlePoint;
  let t = d3.zoomIdentity.translate(tx, 0).scale(k);
  // Rescale the x axis
  xAxis.scale(t.rescaleX(xScale));
  gXAxis.call(xAxis);
  //Draw yAxis
  gYAxis.call(yAxis);
  // Redraw rectangle
  const rectangle = d3.select(rect);
  rectangle.call(zoom.transform, t);
};

const handleZoom = (
  xScale,
  xAxis,
  gXAxis,
  yScale,
  yAxis,
  gYAxis,
  dateArray,
  xBand,
  xAxisLeftEnd,
  xAxisRightEnd,
  endingId,
  transform
) => {
  // let { transform } = event;
  xNewScale = transform.rescaleX(xScale);
  yNewScale = transform.rescaleY(yScale);

  // Scale and Axis
  xAxis.scale(xNewScale);
  gXAxis.call(xAxis);

  yAxis.scale(yNewScale);
  gYAxis.call(yAxis);

  //  Polygon points redraw
  let candleGroup = d3.select("g#candleWickGroup" + endingId);
  redrawCandleBody(candleGroup, dateArray, xNewScale, yNewScale);
  redrawCandleWick(candleGroup, dateArray, xBand, xNewScale, yNewScale);
  //To Do format below line and separate function
  let hLineNode = d3.select("g#hLines" + endingId);
  let tLineNode = d3.select("g#tLines" + endingId);
  attachKeyPressEvent(
    hLineNode,
    tLineNode,
    endingId,
    xAxisLeftEnd,
    xAxisRightEnd
  );
  // Horizontal line redraw
  redrawHLine(hLineNode, yNewScale);
  // TrendLine redraw
  redrawTLine(tLineNode, xNewScale, yNewScale);
};
//handlers and functions
function attachKeyPressEvent(
  hLineNode,
  tLineNode,
  endingId,
  xAxisLeftEnd,
  xAxisRightEnd
) {
  //To Do format below line and separate function
  // Keyboard key press
  d3.select("#block" + endingId)
    .on("keydown", (e) =>
      handleKeyPress(
        e,
        xAxisLeftEnd,
        xAxisRightEnd,
        hLineNode,
        tLineNode,
        endingId
      )
    )
    .on("keyup", handleKeyRelease);
}
function handleKeyPress(
  e,
  xAxisLeftEnd,
  xAxisRightEnd,
  hLineNode,
  tLineNode,
  endingId
) {
  //To Do format below line and separate function
  const { keyCode } = e;

  var xAxisValue = round(xNewScale.invert(xMousePoint));
  var yAxisValue = fixed(yNewScale.invert(yMousePoint));

  // Horizontal line drawing. H or h Key
  if (keyCode === 104 || keyCode === 72) {
    hLineDataSet = [
      { x1: xAxisLeftEnd, x2: xAxisRightEnd, y: yAxisValue },
      ...hLineDataSet,
    ];
    drawHLine(hLineNode, hLineDataSet);
  }

  // TrendLine. T or t key
  if (keyCode === 116 || keyCode === 84) {
    tLineDataSet = [
      {
        x1: xAxisValue - 5,
        x2: xAxisValue + 5,
        y1: yAxisValue,
        y2: yAxisValue,
      },
      ...tLineDataSet,
    ];
    drawTLine(tLineNode, tLineDataSet, endingId);
  }
}

function handleKeyRelease(e) {
  // console.log("key relased key is", e.keyCode);
}
function drawHLine(hLineNode, hLineDataSet) {
  hLineNode = hLineNode
    .append("g")
    .attr("data-groupIndex", hLineDataSet.length - 1)
    .data(hLineDataSet);
  hLineNode
    .append("line")
    .attr("stroke", "white")
    .attr("stroke-width", "2")
    .attr("x1", (d) => d.x1)
    .attr("x2", (d) => d.x2)
    .attr("y1", (d) => yNewScale(d.y))
    .attr("y2", (d) => yNewScale(d.y))
    .on("contextmenu", deleteNodeOnRightButtonClick);

  hLineNode
    .append("circle")
    .style("fill", "white")
    .attr("cx", (d) => {
      let xCenter = (d.x1 + d.x2) / 2;
      return xCenter;
    })
    .attr("cy", (d) => yNewScale(d.y))
    .attr("r", "6")
    .on("contextmenu", deleteNodeOnRightButtonClick)
    .call(hLineDrag);
}

function drawTLine(tLineNode, tLineDataSet) {
  tLineNode = tLineNode
    .append("g")
    .attr("data-groupIndex", tLineDataSet.length - 1)
    .data(tLineDataSet);
  tLineNode
    .append("line")
    .attr("stroke", "white")
    .attr("stroke-width", "2")
    .attr("x1", (d) => xNewScale(d.x1))
    .attr("x2", (d) => xNewScale(d.x2))
    .attr("y1", (d) => yNewScale(d.y1))
    .attr("y2", (d) => yNewScale(d.y2))
    .on("contextmenu", deleteNodeOnRightButtonClick);
  tLineNode
    .append("circle")
    .attr("id", "c1")
    .attr("data-currentElementPosition", "0")
    .style("fill", "white")
    .attr("cx", (d) => xNewScale(d.x1))
    .attr("cy", (d) => yNewScale(d.y1))
    .attr("r", "5")
    .on("contextmenu", deleteNodeOnRightButtonClick)
    .call(tLineDrag);
  tLineNode
    .append("circle")
    .attr("id", "c2")
    .attr("data-currentElementPosition", "1")
    .style("fill", "white")
    .attr("cx", (d) => xNewScale(d.x2))
    .attr("cy", (d) => yNewScale(d.y2))
    .attr("r", "5")
    .on("contextmenu", deleteNodeOnRightButtonClick)
    .call(tLineDrag);
}

function redrawHLine(hLineNode, yNewScale) {
  hLineNode
    .selectAll("line")
    .attr("x1", (d) => d.x1)
    .attr("x2", (d) => d.x2)
    .attr("y1", (d) => yNewScale(d.y))
    .attr("y2", (d) => yNewScale(d.y));
  hLineNode
    .selectAll("circle")
    .attr("cx", (d) => {
      let xCenter = (d.x1 + d.x2) / 2;
      return xCenter;
    })
    .attr("cy", (d) => yNewScale(d.y));
}

function redrawTLine(tLineNode, xNewScale, yNewScale) {
  tLineNode
    .selectAll("line")
    .attr("x1", (d) => xNewScale(d.x1))
    .attr("y1", (d) => yNewScale(d.y1))
    .attr("x2", (d) => xNewScale(d.x2))
    .attr("y2", (d) => yNewScale(d.y2));
  tLineNode
    .selectAll("circle#c1")
    .attr("cx", (d) => xNewScale(d.x1))
    .attr("cy", (d) => yNewScale(d.y1));

  tLineNode
    .selectAll("circle#c2")
    .attr("cx", (d) => xNewScale(d.x2))
    .attr("cy", (d) => yNewScale(d.y2));
}
function redrawCandleBody(candleGroup, dateArray, xNewScale, yNewScale) {
  candleGroup.selectAll("g polygon").attr("points", (d) => {
    const { open, close, date } = d;
    let xDateIndex = dateArray.indexOf(date);
    let xNewTickSize = xNewScale(1) - xNewScale(0);
    let newXBand = xNewTickSize * 0.4;
    let polygonX1 = xNewScale(xDateIndex) - newXBand;
    let polygonX2 = xNewScale(xDateIndex) + newXBand;
    let polygonY1 = yNewScale(close);
    const openPrice = close === open ? open + 0.04 : open;
    let polygonY2 = yNewScale(openPrice);
    let candleBodyPoint =
      polygonX1 +
      "," +
      polygonY1 +
      "," +
      polygonX2 +
      "," +
      polygonY1 +
      "," +
      polygonX2 +
      "," +
      polygonY2 +
      "," +
      polygonX1 +
      "," +
      polygonY2;

    return candleBodyPoint;
  });
}
function redrawCandleWick(candleGroup, dateArray, xBand, xNewScale, yNewScale) {
  candleGroup
    .selectAll("g line")
    .attr("x1", (d) => {
      let xDateIndex = dateArray.indexOf(d.date);
      return xNewScale(xDateIndex);
    })
    .attr("y1", (d) => yNewScale(d.high))
    .attr("x2", (d) => {
      let xDateIndex = dateArray.indexOf(d.date);
      return xNewScale(xDateIndex);
    })
    .attr("y2", (d) => yNewScale(d.low))
    .attr("stroke-width", Math.max(xBand * 0.01, 1));
}
export {
  removeSvg,
  svgMouseMove,
  getDateArray,
  getXScale,
  getYScale,
  getXAxis,
  getYAxis,
  getXAxisNode,
  getYAxisNode,
  attachZoomToRec,
  drawCandleAndWick,
  getZoom,
  initialZoom,
  handleZoom,
  getNewScales,
  getApiDateFormat,
};
