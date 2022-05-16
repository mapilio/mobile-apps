import * as Location from "expo-location";
import * as ScreenOrientation from "expo-screen-orientation";

const _getMode = (a, b) => ((a % b) + b) % b;

const getOrientation = (orientation) => {
    switch (orientation) {
        case 1:
            return "PORTRAIT_UP";
        case 2:
            return "PORTRAIT_DOWN";
        case 3:
            return "LANDSCAPE_LEFT";
        case 4:
            return "LANDSCAPE_RIGHT";
        default:
            return false;
    }
}

export const getHeading = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();
    const heading = await Location.getHeadingAsync()

    if (getOrientation(orientation) === "LANDSCAPE_RIGHT") {
        heading.trueHeading = _getMode(heading.trueHeading + 90, 360);
        heading.magHeading = _getMode(heading.magHeading + 90, 360);
    } else {
        heading.trueHeading = _getMode(heading.trueHeading - 90, 360);
        heading.magHeading = _getMode(heading.magHeading - 90, 360);
    }

    return heading.trueHeading === -1 ? heading.magHeading : heading.trueHeading
}
