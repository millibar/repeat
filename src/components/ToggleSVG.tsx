import React from "react";

type ToggleSVGProps = {
  SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  checked: boolean;
  onChange: (checked: boolean) => void;
  text?: string;
  className?: string;
  disabled?: boolean;
};

export const ToggleSVG: React.FC<ToggleSVGProps> = ({
  SVG,
  checked,
  onChange,
  text,
  className,
  disabled,
}) => {
  return (
    <label className={`toggle ${className || ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <SVG />
      {text && <span>{text}</span>}
    </label>
  );
};
