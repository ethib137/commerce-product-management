import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

export default function main({
  configuration,
  contextPath,
  portletElementId,
  portletNamespace,
}) {
  ReactDOM.render(
    <App
      configuration={configuration}
      contextPath={contextPath}
      portletElementId={portletElementId}
      portletNamespace={portletNamespace}
    />,
    document.getElementById(portletElementId)
  );
}
