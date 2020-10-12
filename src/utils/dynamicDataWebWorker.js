export default function dynamicDataWebWorker() {
  onmessage = function (e) {
    console.log("event inside dynamic webworker", e);
    let dynamicCandleCounter = 0;
    let { dynamicCandleSpeedInMilSec, candleData, index } = e.data;

    let { high, low, open, close, date } = candleData;
    setInterval(() => {
      let dynamicCandleData = {};
      dynamicCandleCounter += 1;
      if (dynamicCandleCounter > 3) dynamicCandleCounter = 1;
      switch (dynamicCandleCounter) {
        case 1:
          dynamicCandleData = {
            date,
            open,
            close: low,
            high: open,
            low,
          };
          //For the indicator - MV
          // let MALastNCandles = data.slice(0).slice(-(maNCandle - 1));
          //data value assigned only after dynamic operation so we need to assign original dbData of candle
          // MALastNCandles = [...MALastNCandles, dbData[i]];
          //MV indicator
          // let { high, low, open, close, date } = candleData;
          //sliced after assign not reduce complexity
          // nCandlesTotalArray = nCandlesTotalArray.slice(0).slice(-nCandle);

          break;
        case 2:
          dynamicCandleData = {
            date,
            open,
            close: high,
            high,
            low,
          };
          break;
        case 3:
          dynamicCandleData = {
            date,
            open,
            close,
            high,
            low,
          };
          break;
        default:
          break;
      }

      postMessage({ dynamicCandleCounter, dynamicCandleData, index });
    }, dynamicCandleSpeedInMilSec);
  };
}
