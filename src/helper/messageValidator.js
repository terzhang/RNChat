export function arraysAreEqual(array1, array2) {
  // if the other array is a falsy value, return
  if (!array1 || !array2) return false;

  // compare lengths - can save a lot of time
  if (array1.length != array2.length) return false;

  for (var i = 0, l = array1.length; i < l; i++) {
    // Check for nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!array1[i].arrayIsEqual(array2[i])) return false;
    } else if (typeof array1[i] == 'object' || typeof array1[i] == 'object') {
      return false; // don't compare if it's nested object
    } else if (array1[i] != array2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}

const ObjValidate = (obj, props) => {
  if (typeof props != Array || typeof obj != Object) {
    return false;
  }
  /* props.every(prop => obj.hasOwnProperty(prop)); */
  const keys = obj.keys.sort(); // array of keys
  if (keys.length() != props.length()) {
    return false;
  } else {
    return arraysAreEqual(keys, props);
  }
};

export default ObjValidate;
