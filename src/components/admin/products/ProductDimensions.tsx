import { Ruler, Weight } from 'lucide-react'
import {
  DIMENSION_UNIT_OPTIONS,
  WEIGHT_UNIT_OPTIONS,
  convertDimensionValue,
  convertWeightValue,
  sanitizeDecimalInput,
} from '../../../utils/productDimensions.js'

const dimensionFields = [
  {
    key: 'length',
    label: 'Length',
    placeholder: 'Enter Length',
    icon: Ruler,
    unitKey: 'dimensionUnit',
    unitOptions: DIMENSION_UNIT_OPTIONS,
    helperText: 'These dimensions are used for shipping calculations.',
  },
  {
    key: 'width',
    label: 'Width',
    placeholder: 'Enter Width',
    icon: Ruler,
    unitKey: 'dimensionUnit',
    unitOptions: DIMENSION_UNIT_OPTIONS,
  },
  {
    key: 'height',
    label: 'Height',
    placeholder: 'Enter Height',
    icon: Ruler,
    unitKey: 'dimensionUnit',
    unitOptions: DIMENSION_UNIT_OPTIONS,
  },
  {
    key: 'weight',
    label: 'Weight',
    placeholder: 'Enter Weight',
    icon: Weight,
    unitKey: 'weightUnit',
    unitOptions: WEIGHT_UNIT_OPTIONS,
    helperText: 'Weight is recommended for shipping.',
  },
]

const rowSpanClassName = 'space-y-1.5'

const getErrorText = (errors, field) => {
  const error = errors?.[field]
  if (!error) return ''
  if (typeof error === 'string') return error
  return error?.message || ''
}

const buildNextValue = (current, field, raw) => ({
  ...current,
  [field]: sanitizeDecimalInput(raw),
})

export default function ProductDimensions({ value, onChange, errors = {}, disabled = false }) {
  const current = value || {}

  const updateField = (field, raw) => {
    if (disabled) return
    onChange(buildNextValue(current, field, raw))
  }

  const updateUnit = (unitKey, nextUnit) => {
    if (disabled) return

    const next = { ...current, [unitKey]: nextUnit }
    if (unitKey === 'dimensionUnit') {
      const fromUnit = current.dimensionUnit || 'cm'
      next.length = convertDimensionValue(current.length, fromUnit, nextUnit)
      next.width = convertDimensionValue(current.width, fromUnit, nextUnit)
      next.height = convertDimensionValue(current.height, fromUnit, nextUnit)
    }

    if (unitKey === 'weightUnit') {
      const fromUnit = current.weightUnit || 'kg'
      next.weight = convertWeightValue(current.weight, fromUnit, nextUnit)
    }

    onChange(next)
  }

  return (
    <section className="glass-card1 rounded-xl border border-white/10 shadow-sm p-6 space-y-5">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
            <Ruler className="w-4 h-4 text-primary-400" />
            Product Dimensions
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            These dimensions are used for shipping calculations.
          </p>
        </div>
        <span className="badge bg-white/5 border border-white/10 text-slate-300 w-fit">
          Optional
        </span>
      </div>

      <div className="space-y-4">
        {dimensionFields.map(({ key, label, placeholder, icon: Icon, unitKey, unitOptions, helperText }) => {
          const valueKey = current[key] ?? ''
          const unitValue = current[unitKey] || (unitKey === 'weightUnit' ? 'kg' : 'cm')

          return (
            <div key={key} className="grid grid-cols-1 gap-3 md:grid-cols-[140px_minmax(0,1fr)_180px] md:items-start">
              <label className="flex items-center gap-2 text-sm font-medium text-white pt-3 md:pt-3.5">
                <Icon className="w-4 h-4 text-primary-400 shrink-0" />
                {label}
              </label>

              <div className={rowSpanClassName}>
                <input
                  type="text"
                  inputMode="decimal"
                  value={valueKey}
                  onChange={(e) => updateField(key, e.target.value)}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="input-field text-white"
                />
                {getErrorText(errors, key) ? (
                  <p className="text-xs text-rose-400">{getErrorText(errors, key)}</p>
                ) : helperText && key === 'weight' && !String(valueKey || '').trim() ? (
                  <p className="text-xs text-amber-300">{helperText}</p>
                ) : null}
              </div>

              <div className={rowSpanClassName}>
                <label className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400 md:hidden">
                  Unit
                </label>
                <select
                  value={unitValue}
                  onChange={(e) => updateUnit(unitKey, e.target.value)}
                  disabled={disabled}
                  className="input-field text-white appearance-none"
                >
                  {unitOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-dark-800">
                      {option.label}
                    </option>
                  ))}
                </select>
                {getErrorText(errors, unitKey) ? (
                  <p className="text-xs text-rose-400">{getErrorText(errors, unitKey)}</p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs sm:text-sm text-slate-300">
        Tip: values are normalized automatically when you change units, for example `cm` to `mm` or `kg` to `g`.
      </div>
    </section>
  )
}
