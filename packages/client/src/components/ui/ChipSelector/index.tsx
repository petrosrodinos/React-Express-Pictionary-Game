import { FC, useState, useEffect } from "react";
import Typography from "../Typography";
import "./style.scss";

interface ChipSelectorProps {
  chips: string[];
  name: string;
  value?: string;
  defaultValue?: boolean;
  onChange: (data: { name: string; value: string }) => void;
  style?: React.CSSProperties;
}

const ChipSelector: FC<ChipSelectorProps> = ({
  chips,
  value,
  defaultValue,
  name,
  onChange,
  style,
}) => {
  const [selectedChip, setSelectedChip] = useState<string>("");

  useEffect(() => {
    if (value) {
      setSelectedChip(value);
    }
    if (defaultValue) {
      setSelectedChip(chips[0]);
    }
  }, [value]);

  const handleChange = (value: string) => {
    setSelectedChip(value);
    onChange({
      name,
      value,
    });
  };
  return (
    <div style={style} className="chip-selector-container">
      {chips.map((chip, index) => (
        <div
          key={index}
          className={`chip-item ${selectedChip == chip ? "selected-chip" : ""}`}
          onClick={() => handleChange(chip)}
        >
          <Typography>{chip}</Typography>
        </div>
      ))}
    </div>
  );
};

export default ChipSelector;
