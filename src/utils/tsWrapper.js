const { connect } = require("react-redux");
const { withRouter } = require("react-router-dom");
const { mapStateToProps, mapDispatchToProps } = require("./mappingToProps");

const mapComponentToStore = (component) =>
  connect(mapStateToProps, mapDispatchToProps)(component);

const tsWrapper = (container) => {
  return withRouter(mapComponentToStore(container));
};

const tsChildWrapper = (container) => {
  return mapComponentToStore(container);
};

export { tsWrapper, tsChildWrapper };
