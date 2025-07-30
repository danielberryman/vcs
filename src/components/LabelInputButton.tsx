const LabelInputButton = ({ 
  text,
  onChange,
  px = "px-4",
  py = "py-2",
  bgColor = "bg-gray-100",
  textColor,
  bghColor = "bg-gray-200",
  texthColor,
  rounded = true,
}: { 
  text: string;
  onChange: any;
  px?: string;
  py?: string;
  bgColor?: string;
  textColor?: string;
  bghColor?: string;
  texthColor?: string;
  rounded?: boolean;
}) => {
  return (
    <label className={`
      inline-block
      ${px} ${py}
      ${bgColor} ${textColor} hover:${bghColor} hover:${texthColor}
      ${rounded && "rounded"}
      cursor-pointer
    `}>
      {text}
      <input
        type="file"
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
};

export default LabelInputButton;
