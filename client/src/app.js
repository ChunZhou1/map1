import React from "react";

import { MapContainer } from "./components/component_map";

//for redux

var sectionStyle = {
  // makesure here is String确保这里是一个字符串，以下是es6写法
  /* backgroundImage: `url(${bg1})`,*/
  backgroundSize: "cover",
  backgroundAttachment: "fixed",

  backgroundRepeat: "no-repeat",

  position: "absolute",
  width: "100%",
  height: "100%",
  left: "0",
  top: "0",
  bottom: "0",
  overflow: "auto",
};

function App() {
  return (
    <div style={sectionStyle}>
      <MapContainer />
    </div>
  );
}

export default App;
