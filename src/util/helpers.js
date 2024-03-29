import colorConvert from 'color-convert'
import standarizeColor from './standarizeColor.js'

export function orientationToAngle({ type, value }) {
  if (type == 'directional') {
    return {
      'top': 0,
      'right': 90,
      'bottom': 180,
      'left': 270
    }[value];
  }
  else {
    return Number(value);
  }
}

export function ensureColor(value, type) {
  const str = value instanceof Array ? `rgba(${ [ ...value, 1 ].slice(0, 4).join(', ') })` : type === 'hex' ? `#${ value }` : value;
  console.log('!', str, standarizeColor(str));
  try {
    const standarizedColor = standarizeColor(str);
    // if (standarizedColor.match(/rgba?\(.*\)/)) {
    //   return standarizedColor;
    // }
    if (standarizedColor.match(/#(.*)/)) {
      const [ , color ] = standarizedColor.match(/#(.*)/);
      return `rgba(${ [ ...colorConvert.hex.rgb.raw(color), 1].join(', ') })`;
    }
    else {
      return standarizedColor;
    }
  }
  catch {
    return value;
  }
}