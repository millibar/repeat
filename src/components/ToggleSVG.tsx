import React from "react";

type ToggleSVGProps = {
  SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  checked: boolean;
  onChange: (checked: boolean) => void;
  text?: string;
  className?: string;
};

export const ToggleSVG: React.FC<ToggleSVGProps> = ({
  SVG,
  checked,
  onChange,
  text,
  className,
}) => {
  return (
    <label className={`toggle ${className || ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <SVG />
      {text && <span>{text}</span>}
    </label>
  );
};
