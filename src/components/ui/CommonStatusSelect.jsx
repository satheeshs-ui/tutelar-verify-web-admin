import { Select } from "antd";

const { Option } = Select;

const CommonStatusSelect = ({ value, options, onChange, className = "" }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      className={`text-[12px] border border-[#CDD0D1]! rounded-[20px]! capitalize ${className}`}
    >
      {options.map((item) => (
        <Option key={item.value} value={item.value}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
            {item.label}
          </div>
        </Option>
      ))}
    </Select>
  );
};

export default CommonStatusSelect;
