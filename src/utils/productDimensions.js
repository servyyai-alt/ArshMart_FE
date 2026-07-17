const DIMENSION_UNIT_OPTIONS = [
  { label: 'Millimetres (mm)', value: 'mm' },
  { label: 'Centimetres (cm)', value: 'cm' },
  { label: 'Metres (m)', value: 'm' },
  { label: 'Inches (in)', value: 'in' },
  { label: 'Feet (ft)', value: 'ft' },
]

const WEIGHT_UNIT_OPTIONS = [
  { label: 'Grams (g)', value: 'g' },
  { label: 'Kilograms (kg)', value: 'kg' },
]

const VALID_DIMENSION_UNITS = new Set(DIMENSION_UNIT_OPTIONS.map(option => option.value))
const VALID_WEIGHT_UNITS = new Set(WEIGHT_UNIT_OPTIONS.map(option => option.value))

const DIMENSION_TO_MM = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8,
}

const WEIGHT_TO_G = {
  g: 1,
  kg: 1000,
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
})

const toNumberOrNull = (value) => {
  if (value === '' || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export const sanitizeDecimalInput = (value) => {
  const cleaned = String(value ?? '')
    .replace(/,/g, '')
    .replace(/[^\d.]/g, '')

  if (!cleaned) return ''

  const hasDot = cleaned.includes('.')
  const [wholeRaw = '', ...fractionParts] = cleaned.split('.')
  const whole = wholeRaw.replace(/^0+(?=\d)/, '') || (wholeRaw === '' ? '0' : wholeRaw)
  const fraction = fractionParts.join('').replace(/\./g, '')

  if (hasDot) {
    return `${whole || '0'}.${fraction}`
  }

  return whole
}

export const formatEditableNumber = (value) => {
  const number = toNumberOrNull(value)
  if (number === null) return ''
  const rounded = Number(number.toFixed(2))
  return Number.isInteger(rounded) ? String(rounded) : String(rounded)
}

export const convertDimensionValue = (value, fromUnit, toUnit) => {
  const number = toNumberOrNull(value)
  if (number === null) return ''
  const from = DIMENSION_TO_MM[fromUnit] || DIMENSION_TO_MM.cm
  const to = DIMENSION_TO_MM[toUnit] || DIMENSION_TO_MM.cm
  return formatEditableNumber((number * from) / to)
}

export const convertWeightValue = (value, fromUnit, toUnit) => {
  const number = toNumberOrNull(value)
  if (number === null) return ''
  const from = WEIGHT_TO_G[fromUnit] || WEIGHT_TO_G.kg
  const to = WEIGHT_TO_G[toUnit] || WEIGHT_TO_G.kg
  return formatEditableNumber((number * from) / to)
}

export const normalizeProductDimensions = (product = {}) => {
  const source = product?.dimensions || {}
  const legacyWeight = toNumberOrNull(product?.weight)
  const length = toNumberOrNull(source.length)
  const width = toNumberOrNull(source.width ?? source.breadth)
  const height = toNumberOrNull(source.height)
  const weight = toNumberOrNull(source.weight ?? legacyWeight)

  const hasAny = [length, width, height, weight].some(value => value !== null)
  if (!hasAny) return null

  return {
    length,
    width,
    height,
    dimensionUnit: VALID_DIMENSION_UNITS.has(source.dimensionUnit) ? source.dimensionUnit : 'cm',
    weight,
    weightUnit: VALID_WEIGHT_UNITS.has(source.weightUnit)
      ? source.weightUnit
      : (source.weight != null ? 'kg' : legacyWeight != null ? 'g' : 'kg'),
  }
}

export const createEmptyProductDimensionsState = (product = null) => {
  const dimensions = normalizeProductDimensions(product || {})

  return {
    length: dimensions?.length !== null && dimensions?.length !== undefined ? String(dimensions.length) : '',
    width: dimensions?.width !== null && dimensions?.width !== undefined ? String(dimensions.width) : '',
    height: dimensions?.height !== null && dimensions?.height !== undefined ? String(dimensions.height) : '',
    dimensionUnit: dimensions?.dimensionUnit || 'cm',
    weight: dimensions?.weight !== null && dimensions?.weight !== undefined ? String(dimensions.weight) : '',
    weightUnit: dimensions?.weightUnit || 'kg',
  }
}

export const validateProductDimensions = (value = {}) => {
  const errors = {}
  const fields = ['length', 'width', 'height', 'weight']
  const pattern = /^\d+(\.\d*)?$/

  for (const field of fields) {
    const raw = String(value?.[field] ?? '').trim()
    if (!raw) continue

    if (!pattern.test(raw)) {
      errors[field] = 'Enter a valid non-negative number'
      continue
    }

    const numeric = Number(raw)
    if (numeric < 0) {
      errors[field] = 'Value cannot be negative'
      continue
    }

    if (numeric > 99999) {
      errors[field] = 'Maximum allowed value is 99999'
    }
  }

  if (value?.dimensionUnit && !VALID_DIMENSION_UNITS.has(value.dimensionUnit)) {
    errors.dimensionUnit = 'Select a valid unit'
  }

  if (value?.weightUnit && !VALID_WEIGHT_UNITS.has(value.weightUnit)) {
    errors.weightUnit = 'Select a valid unit'
  }

  return errors
}

export const buildProductDimensionsPayload = (value = {}) => {
  const length = toNumberOrNull(value.length)
  const width = toNumberOrNull(value.width)
  const height = toNumberOrNull(value.height)
  const weight = toNumberOrNull(value.weight)

  if ([length, width, height, weight].every(item => item === null)) {
    return null
  }

  return {
    length,
    width,
    height,
    dimensionUnit: VALID_DIMENSION_UNITS.has(value.dimensionUnit) ? value.dimensionUnit : 'cm',
    weight,
    weightUnit: VALID_WEIGHT_UNITS.has(value.weightUnit) ? value.weightUnit : 'kg',
  }
}

export const formatProductDimensionsSummary = (product = {}) => {
  const dimensions = normalizeProductDimensions(product)
  if (!dimensions) {
    return {
      hasDimensions: false,
      hasWeight: false,
      dimensionsText: 'Dimensions Not Available',
      weightText: 'Weight Not Available',
    }
  }

  const hasDimensions = [dimensions.length, dimensions.width, dimensions.height].every(value => value !== null && value !== undefined)
  const hasWeight = dimensions.weight !== null && dimensions.weight !== undefined

  return {
    hasDimensions,
    hasWeight,
    dimensionsText: hasDimensions
      ? `${NUMBER_FORMATTER.format(dimensions.length)} x ${NUMBER_FORMATTER.format(dimensions.width)} x ${NUMBER_FORMATTER.format(dimensions.height)} ${dimensions.dimensionUnit}`
      : 'Dimensions Not Available',
    weightText: hasWeight
      ? `${NUMBER_FORMATTER.format(dimensions.weight)} ${dimensions.weightUnit}`
      : 'Weight Not Available',
  }
}

export const calculateOrderWeight = (items = []) => {
  const totalKg = (items || []).reduce((sum, item) => {
    const dimensions = normalizeProductDimensions(item || {})
    if (!dimensions?.weight && dimensions?.weight !== 0) {
      return sum
    }

    const quantity = Number(item?.quantity || 1)
    const weightInKg = Number(convertWeightValue(dimensions.weight, dimensions.weightUnit || 'kg', 'kg')) || 0
    return sum + (weightInKg * quantity)
  }, 0)

  return totalKg > 0 ? Number(totalKg.toFixed(2)) : 0.5
}

export {
  DIMENSION_UNIT_OPTIONS,
  WEIGHT_UNIT_OPTIONS,
}
