import Svg, { Circle, G, Path, Rect, Defs, ClipPath } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { Image } from 'react-native';

/**
 *
 * @param flag {string ?: "en" | "tr" | "ch" | "fr" | "de" | "it" | "pr" | "es"}
 * @param width
 * @param height
 * @returns {JSX.Element} Returns the JSX Svg component
 * @constructor
 */
const Flags = ({ flag, width = RFValue(20), height = RFValue(12) }) => {
  const iconList = [
    { code: 'en', component: require('../../images/languages/england.png') },
    { code: 'cs', component: require('../../images/languages/cs.png') },
    { code: 'da', component: require('../../images/languages/da.png') },
    { code: 'el', component: require('../../images/languages/el.png') },
    { code: 'es', component: require('../../images/languages/es.png') },
    { code: 'fi', component: require('../../images/languages/fi.png') },
    { code: 'fr', component: require('../../images/languages/france.png') },
    { code: 'pt', component: require('../../images/languages/pt.png') },
    { code: 'ro', component: require('../../images/languages/ro.png') },
    { code: 'ru', component: require('../../images/languages/ru.png') },
    { code: 'tr', component: require('../../images/languages/turkey.png') },
    //    { code: "ch", component: require("../../images/languages/china.png") },
    { code: 'de', component: require('../../images/languages/germany.png') },
    { code: 'it', component: require('../../images/languages/italy.png') },
    { code: 'ar', component: require('../../images/languages/arap.png') },
  ];

  const { component } = iconList.find(({ code }) => code === flag);

  return <Image source={component} style={{ width, height, aspectRatio: 1.5 }} />;
};

export default Flags;
