import Select, { type MultiValue } from "react-select"

type SearchMultiSelectProps = {
  label: string
  placeholder: string
  options: string[]
  values: string[]
  setValues: React.Dispatch<React.SetStateAction<string[]>>
}

type Option = { label: string; value: string }

const UW_PURPLE_90 = "#4B2E83E6"
const GRAY_500_90 = "rgba(107, 114, 128, 0.90)"
const GRAY_300_90 = "rgba(209, 213, 219, 0.90)"
const GRAY_400_90 = "rgba(156, 163, 175, 0.90)"
const GRAY_100_90 = "rgba(243, 244, 246, 0.90)"
const PURPLE_100_90 = "rgba(237, 233, 254, 0.90)"

export default function SearchMultiSelect({
  label,
  placeholder,
  options,
  values,
  setValues,
}: SearchMultiSelectProps) {
  const optionObjects: Option[] = options.map((o) => ({ label: o, value: o }))
  const selected: Option[] = optionObjects.filter((o) => values.includes(o.value))

  return (
    <div className="w-full">
      <label
        htmlFor={label}
        className="text-xs font-bold tracking-wide uppercase text-uw/90"
      >
        {label}
      </label>

      <Select<Option, true>
        inputId={label}
        isMulti
        options={optionObjects}
        value={selected}
        onChange={(opts: MultiValue<Option>) => setValues(opts.map((o) => o.value))}
        placeholder={placeholder}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        styles={{
          control: (base, state) => ({
            ...base,
            borderWidth: 2,
            borderColor: state.isFocused ? GRAY_400_90 : GRAY_300_90,
            boxShadow: "none",
            ":hover": { borderColor: GRAY_400_90 },
            fontWeight: 600,
            color: GRAY_500_90,
          }),
          placeholder: (base) => ({
            ...base,
            color: GRAY_500_90,
            fontWeight: 600,
          }),
          singleValue: (base) => ({
            ...base,
            color: GRAY_500_90,
            fontWeight: 600,
          }),
          menu: (base) => ({
            ...base,
            borderWidth: 1,
            borderColor: GRAY_300_90,
            overflow: "hidden",
            fontWeight: 600,
            color: GRAY_500_90,
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? PURPLE_100_90
              : state.isFocused
              ? GRAY_100_90
              : "white",
            color: state.isSelected ? UW_PURPLE_90 : GRAY_500_90,
            cursor: "pointer",
          }),
          input: (base) => ({
            ...base,
            color: GRAY_500_90,
            fontWeight: 600,
          }),
          valueContainer: (base) => ({
            ...base,
            paddingLeft: 8,
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: PURPLE_100_90,
            borderRadius: 6,
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: UW_PURPLE_90,
            fontWeight: 600,
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: UW_PURPLE_90,
            ":hover": {
              backgroundColor: GRAY_100_90,
              color: UW_PURPLE_90,
            },
          }),
        }}
      />
    </div>
  )
}