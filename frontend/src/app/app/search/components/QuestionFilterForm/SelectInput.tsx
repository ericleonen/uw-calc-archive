import Select, { type SingleValue } from "react-select"

type SelectInputProps = {
  label: string
  placeholder: string
  options: string[]
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

type Option = { label: string; value: string }

const UW_PURPLE_90 = "#4B2E83E6"
const GRAY_500_90 = "rgba(107, 114, 128, 0.90)"
const GRAY_300_90 = "rgba(209, 213, 219, 0.90)"
const GRAY_400_90 = "rgba(156, 163, 175, 0.90)"
const GRAY_100_90 = "rgba(243, 244, 246, 0.90)"
const PURPLE_100_90 = "rgba(237, 233, 254, 0.90)"

export default function SelectInput({
  label,
  placeholder,
  options,
  value,
  setValue,
}: SelectInputProps) {
  const optionObjects: Option[] = options.map((o) => ({ label: o, value: o }))
  const selected: Option | null =
    optionObjects.find((o) => o.value === value) ?? null

  return (
    <div className="w-full">
      <label
        htmlFor={label}
        className="text-xs font-bold tracking-wide uppercase text-uw/90"
      >
        {label}
      </label>

      <Select
        inputId={label}
        options={optionObjects}
        value={selected}
        onChange={(opt: SingleValue<Option>) => setValue(opt?.value ?? "")}
        placeholder={placeholder}
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
            color: state.isSelected
              ? `${UW_PURPLE_90}`
              : GRAY_500_90,
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
        }}
      />
    </div>
  )
}
