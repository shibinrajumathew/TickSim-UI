import React from "react";
import constants from "../../../utils/constants";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "../cssFrameworkComponents/CoreComponents";
const { TIME_SCALE } = constants;

const DropDownMenuComponent = (props) => {
  const { currentTimeScaleKey, setTimeScaleKey } = props;
  const currentTimeScale = TIME_SCALE[currentTimeScaleKey];
  const timeScaleArray = Object.keys(TIME_SCALE);
  return (
    <React.Fragment>
      <ButtonDropdown className="rounded-0 col-12  border-0 btn btn-primary">
        <DropdownToggle color="primary">
          TimeScale: {currentTimeScale}
        </DropdownToggle>
        <DropdownMenu>
          {timeScaleArray.map((timeScaleKey, index) => {
            let divider;
            if (index === 4 || index === 7) {
              divider = (
                <DropdownItem
                  key={`dropDownTimeScaleDivider${timeScaleKey}`}
                  divider
                />
              );
            }
            return (
              <React.Fragment key={timeScaleKey}>
                <DropdownItem
                  key={`dropDownTimeScale${timeScaleKey}`}
                  onClick={() => {
                    setTimeScaleKey(timeScaleKey);
                  }}
                >
                  {TIME_SCALE[timeScaleKey]}
                </DropdownItem>
                {divider}
              </React.Fragment>
            );
          })}
        </DropdownMenu>
      </ButtonDropdown>
    </React.Fragment>
  );
};

export default DropDownMenuComponent;
