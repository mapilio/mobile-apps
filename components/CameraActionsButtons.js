import React, { useState } from "react";
import AutoActionButton from "./AutoActionButton";
import ManuelActionButton from "./ManuelActionButton";

const CameraActionsButtons = () => {
  const [captureType, setCaptureType] = useState("auto");

  return (
    <>
      {captureType === "manuel" && <ManuelActionButton />}
      {captureType === "auto" && <AutoActionButton />}
    </>
  );
};

export default CameraActionsButtons;
