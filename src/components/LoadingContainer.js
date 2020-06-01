import ClayLoadingIndicator from "@clayui/loading-indicator";
import React from "react";

const overlayStyles = {
  backgroundColor: "rgba(0,0,0,0.5)",
  borderRadius: "0.25rem",
  bottom: 0,
  display: "flex",
  justifyContent: "center",
  left: 0,
  paddingTop: "20px",
  position: "absolute",
  right: 0,
  top: 0,
  zIndex: 1,
};

const containerStyles = {
  position: "relative",
};

function LoadingContainer(props) {
  if (props.loading) {
    return (
      <div style={containerStyles}>
        <div style={overlayStyles}>
          <ClayLoadingIndicator light />
        </div>

        {props.children}
      </div>
    );
  } else {
    return <>{props.children}</>;
  }
}

export default LoadingContainer;
