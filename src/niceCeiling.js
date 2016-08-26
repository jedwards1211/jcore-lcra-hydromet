/**
 * @return a value >= x and < x * 10 that divides evenly into a power of 10.
 */
export default function niceCeiling(x) {
  var floor = Math.pow(10, Math.floor(Math.log10(x)))
  if (floor >= x) {
    return floor
  }
  if (floor * 2 >= x) {
    return floor * 2
  }
  if (floor * 2.5 >= x) {
    return floor * 2.5
  }
  if (floor * 4 >= x) {
    return floor * 4
  }
  if (floor * 5 >= x) {
    return floor * 5
  }
  return floor * 10
}
