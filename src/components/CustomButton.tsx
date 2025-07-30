const CustomButton = ({ 
  text,
  onClick,
  sm = false,
  px = "px-4",
  py = "py-2",
  bgColor = "bg-gray-100",
  textColor,
  bghColor = "bg-gray-200",
  texthColor,
  rounded = true,
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
}) => {
  return (
    <button onClick={onClick} className={`
      ${px} ${py}
      ${bgColor} ${textColor ? textColor : ""} hover:${bghColor} ${texthColor ? `hover:${texthColor}` : ""}
      ${rounded && "rounded"}
      cursor-pointer
      ${sm ? "text-sm" : ""}
    `}>{text}</button>
  );
};

export default CustomButton;
