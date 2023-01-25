export const tooltipContents = {
  tabBar: {
    map: {
      title: "map",
      description: "map_desc",
      buttonTitle: "next",
    },
    market: {
      title: "marketplace",
      description: "marketplace_desc",
      buttonTitle: "next",
    },
    upload: {
      title: "upload",
      description: "upload_desc",
      buttonTitle: "next",
    },
    leader: {
      title: "leaderboard",
      description: "leaderboard_desc",
      buttonTitle: "next",
    },
    capture: {
      title: "capture",
      description: "capture_desc",
      buttonTitle: "done",
    },
  },
  camera: {
    tasks: {
      title: "tasks",
      description: "tasks_desc",
      buttonTitle: "next",
    },
    angle: {
      title: "angle",
      description: "angle_desc",
      buttonTitle: "next",
    },
    startCapture: {
      title: "startCapture",
      description: "start_capture_desc",
      buttonTitle: "done",
    },
  },
  marketplace: {
    missionArea: {
      title: "mission_area",
      description: "mission_area_desc",
      buttonTitle: "next",
    },
    list: {
      title: "list",
      description: "list_desc",
      buttonTitle: "next",
    },
    apply: {
      title: "apply",
      description: "apply_desc",
      buttonTitle: "done",
    },
  },
};

// missionArea will be added to the list of steps for the marketplace
export const tooltipSteps = {
  tabBar: ["map", "market", "upload", "leader", "capture"],
  marketplace: ["list", "apply"],
  camera: ["tasks", "angle", "startCapture"],
};
