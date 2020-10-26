import {
  incrementX1Only,
  incrementX2Only,
  decrementX1Only,
  decrementX2Only,
} from "../views/common/stateManagers/actions/xRangeActions";

const mapStateToProps = (state) => {
  return {
    storeState: state,
  };
};

const mapDispatchToProps = {
  incrementX1Only,
  incrementX2Only,
  decrementX1Only,
  decrementX2Only,
};

export { mapStateToProps, mapDispatchToProps };
