import React from "react";
import { Button } from "../cssFrameworkComponents/CoreComponents";

const PlayPauseButtonComponent = (props) => {
  const { playChart, handlePlayPauseButton } = props;
  return (
    <React.Fragment>
      <Button
        color={playChart ? "danger" : "primary"}
        className="rounded-0 col-12  border-0 mb-2"
        onClick={handlePlayPauseButton}
      >
        {playChart ? "Pause candle" : "Play candle"}
      </Button>
    </React.Fragment>
  );
};

export default PlayPauseButtonComponent;
