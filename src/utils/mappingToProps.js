import {
  incrementX1Only,
  incrementX2Only,
} from "../views/common/stateManagers/actions/xRangeActions";

const mapStateToProps = (state) => {
  return {
    storeState: state,
  };
};

const mapDispatchToProps = {
  incrementX1Only,
  incrementX2Only,
};

export { mapStateToProps, mapDispatchToProps };
