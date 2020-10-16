export default function dynamicDataWebWorker() {
  onmessage = function (e) {
    let dynamicCandleCounter = 0;
    let { dynamicCandleSpeedInMilSec, dynamicData, index } = e.data;
    setInterval(() => {
      if (dynamicCandleCounter > 2) dynamicCandleCounter = 0;
      postMessage({
        dynamicCandleCounter,
        dynamicCandleData: dynamicData[dynamicCandleCounter],
        index,
      });
      dynamicCandleCounter += 1;
    }, dynamicCandleSpeedInMilSec);
  };
}
