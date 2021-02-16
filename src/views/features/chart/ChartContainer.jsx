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
  removeSvg,
} from "../../../utils/chartVisualizationUtil";
import constants from "../../../utils/constants";
import ClipPathComponent from "../../common/svgCoreComponents/ClipPathComponent";
import LineComponent from "../../common/svgCoreComponents/LineComponent";
import Rectangle from "../../common/svgCoreComponents/Rectangle";
import SVGComponent from "../../common/svgCoreComponents/SVGComponent";
import SVGGroupComponent from "../../common/svgCoreComponents/SVGGroupComponent";
let svgDimension = {};
const {
  EVENTS: { CONTEXT_MENU, NON_PASSIVE_EVENTS },
} = constants;

class ChartContainer extends Component {
  constructor(props) {
    super();
    svgDimension = props.svgDimension;
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
    this.handleContextMenu = this.handleContextMenu.bind(this);
  }
  componentDidMount() {
    const svgNode = this.svgNode.current;
    svgNode.addEventListener(
      CONTEXT_MENU,
      this.handleContextMenu,
      NON_PASSIVE_EVENTS
    );
  }
  componentWillUnmount() {
    const svgNode = this.svgNode.current;
    svgNode.removeEventListener(CONTEXT_MENU, this.handleContextMenu);
  }
  handleContextMenu = (e) => {
    e.preventDefault();
  };

  render() {
    const {
      candleData,
      position,
      scales,
      type,
      zoomHandler,
      nCandle,
    } = this.props;
    removeSvg(type);
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
    // const svgId = endingId ? "#svgMainNode" + endingId : "";

    svgMouseMove(endingId, position, xAxisLeftEnd, xAxisRightEnd);

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
    );

    let lastNCandlesCount =
      totalCandleCount - nCandle < 0
        ? totalCandleCount
        : nCandle || totalCandleCount;
    //On load zoom
    const { isInitialData } = this.props;
    if (isInitialData) {
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
        zoom,
        scales
      );
    } else {
      const { transform } = this.props.scales[endingId];

      handleZoom(
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
      );
    }

    //Attaching zoom to rectangle defined as boundary
    attachZoomToRec(this.rectBoundary.current, zoom);
    const { width: svgWidth, height: svgHeight } = svgDimension;
    return (
      <div id={`block${endingId}`} className="block" tabIndex="0">
        <SVGComponent
          ref={this.svgNode}
          width={svgWidth}
          height={svgHeight}
          className="svgMain"
          id={`svgMainNode${endingId}`}
        >
          <SVGGroupComponent
            ref={this.parentGroup}
            id={`parentGroup${endingId}`}
          >
            <ClipPathComponent
              id={`innerClipRect${endingId}`}
              x={0}
              y={0}
              width={xAxisRightEnd}
              height={yAxisBottomEnd}
            />
            <SVGGroupComponent
              id={`crossWire${endingId}`}
              clipPath={`url(#innerClipRect${endingId})`}
            >
              <LineComponent
                id={`crossWireXAxis${endingId}`}
                x1={0}
                x2={svgDimension.width}
                y1={0}
                y2={0}
                strokeWidth={2}
                stroke={"white"}
                strokeDasharray={2}
              />
              <LineComponent
                id={`crossWireYAxis${endingId}`}
                x1={0}
                x2={0}
                y1={0}
                y2={svgDimension.height}
                strokeWidth={2}
                stroke={"white"}
                strokeDasharray={2}
              />
            </SVGGroupComponent>
            <SVGGroupComponent
              id={`candleWickGroup${endingId}`}
              clipPath={`url(#innerClipRect${endingId})`}
            />
            <Rectangle
              ref={this.rectBoundary}
              id={`rectBoundary${endingId}`}
              className="outerLayer"
              x="0"
              y="0"
              width={xAxisRightEnd}
              height={yAxisBottomEnd}
            />
            <SVGGroupComponent
              id={`drawings${endingId}`}
              clipPath={`url(#innerClipRect${endingId})`}
            >
              <SVGGroupComponent id={`hLines${endingId}`} />
              <SVGGroupComponent id={`tLines${endingId}`} />
            </SVGGroupComponent>
          </SVGGroupComponent>
        </SVGComponent>
      </div>
    );
  }
}

export default ChartContainer;
