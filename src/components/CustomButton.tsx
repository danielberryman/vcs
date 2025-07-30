const CustomButton = ({ 
  text,
  onClick,
  sm = false,
  px = "px-4",
  py = "py-2",
  bgColor = "bg-gray-100",
  textColor = "",
  bghColor = "bg-gray-200",
  texthColor = "",
  rounded = true,
  minWidth = "min-w-35",
  className = ""
}: { 
  text: string;
  onClick: any;
  sm?: boolean;
  px?: string;
  py?: string;
  bgColor?: string;
  textColor?: string;
  bghColor?: string;
  texthColor?: string;
  rounded?: boolean;
  minWidth?: string;
  className?: string;
}) => {
  return (
    <button onClick={onClick} className={`
      ${px} ${py}
      ${bgColor} ${textColor} hover:${bghColor} ${texthColor && `hover:${texthColor}`}
      ${rounded && "rounded"}
      cursor-pointer
      ${sm ? "text-sm" : ""}
      ${minWidth}
      ${className}
    `}>{text}</button>
  );
};

export default CustomButton;
