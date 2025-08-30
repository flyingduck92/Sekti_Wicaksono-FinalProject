export function isEmail(value) {
  // [^\s@]+ means Accept anychars except space and @ symbol
  // First ^ must start with string
  // Last $ must end with string
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isNotEmpty(value) {
  return (typeof value === 'string' && value.trim()) !== ''
}

export function hasMinLength(value, minLength) {
  return value.length >= minLength
}

export function isEqualToOtherValue(value, otherValue) {
  return value === otherValue
}