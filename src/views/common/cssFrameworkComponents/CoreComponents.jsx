/*
 * Created on: Wed Oct 07 2020 9:56:33 PM
 * Author: Shibin Raju Mathew
 * Email: shibinrajumathew@yahoo.com
 * Website: vveeo.com
 *
 * This project is licensed proprietary, not free software, or open source.
 * Strictly prohibited Unauthorized copying or modifications.
 * This project owned and maintained by Shibin Raju Mathew.
 *
 * All rights reserved.
 * Copyright (c) 2020 VVEEO
 */

import React, { PureComponent } from "react";
import {
  Table as RSTable,
  Col as RSCol,
  Row as RSRow,
  Container as RSContainer,
  Form as RSForm,
  Input as RSInput,
  FormGroup as RSFormGroup,
  Label as RSLabel,
  UncontrolledCollapse as RSUncontrolledCollapse,
  Button as RSButton,
  ButtonGroup as RSButtonGroup,
  Nav as RSNav,
  NavItem as RSNavItem,
  NavLink as RSNavLink,
  TabContent as RSTabContent,
  TabPane as RSTabPane,
  Alert as RSAlert,
  UncontrolledButtonDropdown as RSUncontrolledButtonDropdown,
  DropdownMenu as RSDropdownMenu,
  DropdownItem as RSDropdownItem,
  DropdownToggle as RSDropdownToggle,
} from "reactstrap";

class Table extends PureComponent {
  render() {
    return <RSTable {...this.props} />;
  }
}
//layouts
class Container extends PureComponent {
  render() {
    return <RSContainer {...this.props} />;
  }
}
class Row extends PureComponent {
  render() {
    return <RSRow {...this.props} />;
  }
}
class Col extends PureComponent {
  render() {
    return <RSCol {...this.props} />;
  }
}

//form
class Form extends PureComponent {
  render() {
    return <RSForm {...this.props} />;
  }
}
class Input extends PureComponent {
  render() {
    return <RSInput {...this.props} />;
  }
}
class FormGroup extends PureComponent {
  render() {
    return <RSFormGroup {...this.props} />;
  }
}
class Label extends PureComponent {
  render() {
    return <RSLabel {...this.props} />;
  }
}
class Button extends PureComponent {
  render() {
    return <RSButton {...this.props} />;
  }
}
class ButtonGroup extends PureComponent {
  render() {
    return <RSButtonGroup {...this.props} />;
  }
}
class Collapse extends PureComponent {
  render() {
    return <RSUncontrolledCollapse {...this.props} />;
  }
}
class Nav extends PureComponent {
  render() {
    return <RSNav {...this.props} />;
  }
}
class NavItem extends PureComponent {
  render() {
    return <RSNavItem {...this.props} />;
  }
}
class NavLink extends PureComponent {
  render() {
    return <RSNavLink {...this.props} />;
  }
}
class TabContent extends PureComponent {
  render() {
    return <RSTabContent {...this.props} />;
  }
}
class TabPane extends PureComponent {
  render() {
    return <RSTabPane {...this.props} />;
  }
}
class Alert extends PureComponent {
  render() {
    return <RSAlert {...this.props} />;
  }
}
class ButtonDropdown extends PureComponent {
  render() {
    return <RSUncontrolledButtonDropdown {...this.props} />;
  }
}
class DropdownMenu extends PureComponent {
  render() {
    return <RSDropdownMenu {...this.props} />;
  }
}
class DropdownItem extends PureComponent {
  render() {
    return <RSDropdownItem {...this.props} />;
  }
}
class DropdownToggle extends PureComponent {
  render() {
    return <RSDropdownToggle {...this.props} />;
  }
}

export {
  Table,
  Row,
  Col,
  Container,
  Form,
  Input,
  FormGroup,
  Label,
  Button,
  ButtonGroup,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
};
