interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function RadioGroup({ name, label, options, value, onChange, className = "" }: RadioGroupProps) {
  return (
    <fieldset className={className}>
      {label && <legend className="mb-2 block text-label-lg text-text-secondary">{label}</legend>}
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-body-md text-text">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange?.(opt.value)}
              className="h-4 w-4 border-gray-300 text-primary accent-primary focus:ring-primary"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
