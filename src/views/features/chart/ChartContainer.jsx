import React, { Component } from "react";
import "../../../styles/chartStyle.css";
import {
  attachZoomToRec,
  drawCandleAndWick,
  getDateArray,
  getXAxis,
  getXAxisNode,
  getXScale,
  getYAxis,
  getYAxisNode,
  getYScale,
  getZoom,
  handleZoom,
  initialZoom,
  svgMouseMove,
} from "../../../utils/chartVisualizationUtil";
let svgDimension = {};
let candleData;

class ChartContainer extends Component {
  constructor(props) {
    super();
    svgDimension = props.svgDimension;
    candleData = props.candleData;
    this.state = {
      zoomLeftEnd: [svgDimension.x, svgDimension.y],
      zoomRightEnd: [
        svgDimension.width - svgDimension.x,
        svgDimension.height - svgDimension.y,
      ],
      dragLeftEnd: [-svgDimension.width * 0.2, -svgDimension.height * 0.2],
      dragRightEnd: [svgDimension.width * 1.5, svgDimension.height * 1.5],

      xAxisLeftEnd: svgDimension.x,
      xAxisRightEnd: svgDimension.width - 50,
      yAxisTopEnd: svgDimension.y,
      yAxisBottomEnd: svgDimension.height - 20,
      endingId: props.type,
    };

    this.svgNode = React.createRef();
    this.rectBoundary = React.createRef();
    this.parentGroup = React.createRef();
  }
  componentDidMount() {
    let totalCandleCount = candleData.length;
    const {
      zoomLeftEnd,
      zoomRightEnd,
      dragLeftEnd,
      dragRightEnd,
      xAxisLeftEnd,
      xAxisRightEnd,
      yAxisTopEnd,
      yAxisBottomEnd,
      endingId,
    } = this.state;
    const { position } = this.props;

    let svgMouse = svgMouseMove(
      endingId ? "#svgMainNode" + endingId : "",
      position,
      xAxisLeftEnd,
      xAxisRightEnd
    );

    // Scale
    let xScale = getXScale(totalCandleCount, xAxisLeftEnd, xAxisRightEnd);
    let yScale = getYScale(candleData, yAxisTopEnd, yAxisBottomEnd);
    let dateArray = getDateArray(totalCandleCount, candleData);

    // Axis
    let xAxis = getXAxis(xScale, yAxisBottomEnd, dateArray);
    let yAxis = getYAxis(yScale, xAxisRightEnd);
    let xTicksSize = xScale(1) - xScale(0);
    let xBand = xTicksSize * 0.4;

    //Axis node
    let gXAxis = getXAxisNode(this.parentGroup.current);
    let gYAxis = getYAxisNode(this.parentGroup.current);
    drawCandleAndWick(
      "#parentGroup",
      candleData,
      xScale,
      xBand,
      yScale,
      dateArray,
      endingId
    );
    //zoom predefined data
    let zoom = getZoom(
      zoomLeftEnd,
      zoomRightEnd,
      dragLeftEnd,
      dragRightEnd,
      handleZoom,
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
    );

    let lastNCandlesCount = 75;
    //On load zoom
    initialZoom(
      lastNCandlesCount,
      totalCandleCount,
      xScale,
      svgDimension,
      xAxis,
      gXAxis,
      yAxis,
      gYAxis,
      this.rectBoundary.current,
      zoom
    );
    //Attaching zoom to rectangle defined as boundary
    attachZoomToRec(this.rectBoundary.current, zoom);
  }

  render() {
    const { width: svgWidth, height: svgHeight } = svgDimension;
    const { xAxisRightEnd, yAxisBottomEnd, endingId } = this.state;
    return (
      <div id={`block${endingId}`} className="block" tabindex="0">
        <svg
          ref={this.svgNode}
          width={svgWidth}
          height={svgHeight}
          className="svgMain"
          id={`svgMainNode${endingId}`}
        >
          <g ref={this.parentGroup} id={`parentGroup${endingId}`}>
            <rect
              ref={this.rectBoundary}
              id={`rectBoundary${endingId}`}
              className="outerLayer"
              x="0"
              y="0"
              width={xAxisRightEnd}
              height={yAxisBottomEnd}
            />
            <defs>
              <clipPath id={`innerClipRect${endingId}`}>
                <rect
                  x={0}
                  y={0}
                  width={xAxisRightEnd}
                  height={yAxisBottomEnd}
                />
              </clipPath>
            </defs>
            <g
              id={`candleWickGroup${endingId}`}
              clipPath={`url(#innerClipRect${endingId})`}
            ></g>
            <g
              id={`drawings${endingId}`}
              clipPath={`url(#innerClipRect${endingId})`}
            >
              <g id={`hLines${endingId}`}></g>
              <g id={`tLines${endingId}`}></g>
            </g>
          </g>
        </svg>
      </div>
    );
  }
}

export default ChartContainer;
