import httpClient from "../utils/httpClient";
import { getApiDateFormat } from "../utils/chartVisualizationUtil";

const getCandleData = (currentTimeScaleKey, tradingDate) => {
  console.log("inside get candle data", tradingDate);
  const endingDate = new Date(tradingDate);
  const startingDate = new Date(tradingDate);

  let oneDayTime = 24 * 60 * 60 * 1000;
  let totalDays = oneDayTime * 10;

  startingDate.setTime(startingDate.getTime() - totalDays);
  const instrumentId = "256265";
  const timeScale = currentTimeScaleKey;
  const formattedFromDate = getApiDateFormat(startingDate);
  const formattedToDate = getApiDateFormat(endingDate);
  const url =
    "getCandleData?instrumentId=" +
    instrumentId +
    "&timeScale=" +
    timeScale +
    "&fromDate=" +
    formattedFromDate +
    "&toDate=" +
    formattedToDate;
  return httpClient.get(url).then((res) => {
    const {
      data: { data },
    } = res;
    return data;
  });
};
const getNextDayCandleData = (currentTimeScaleKey, tradingDate) => {
  const startingDate = new Date(tradingDate);
  const lastTradedDate = new Date(tradingDate);

  let oneDayTime = 24 * 60 * 60 * 1000;
  let totalDays = oneDayTime * 15;

  startingDate.setTime(startingDate.getTime() - totalDays);
  const instrumentId = "256265";
  const timeScale = currentTimeScaleKey;
  const formattedFromDate = getApiDateFormat(startingDate);
  const formattedLastTradedDate = getApiDateFormat(lastTradedDate);
  const url =
    "getNextDayCandleData?instrumentId=" +
    instrumentId +
    "&timeScale=" +
    timeScale +
    "&fromDate=" +
    formattedFromDate +
    "&lastTradedDate=" +
    formattedLastTradedDate;
  return httpClient.get(url).then((res) => {
    const {
      data: { data },
    } = res;
    return data;
  });
};
export { getCandleData, getNextDayCandleData };
