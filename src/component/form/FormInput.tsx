import { Input, Select } from "antd";
import { Controller } from "react-hook-form";

type TInputProps = {
    type: string;
    name: string;
    label?: string;
    options?: string[];
    defaultValue?: string // Add an options prop for Select input
};

const FormInput = ({ name, type, label, options, defaultValue }: TInputProps) => {
    return (
        <div>
            <label htmlFor={name} style={{ margin: "10px 0", display: 'block' }}>
                {label}
            </label>
            <Controller
                name={name}
                render={({ field }) =>
                    type === "select" ? (
                        <Select defaultValue={defaultValue} {...field} id={name} style={{ width: '15rem' }}>
                            {options &&
                                options.map((opt, index) => (
                                    <Select.Option key={index} value={opt}>
                                        {opt}
                                    </Select.Option>
                                ))}
                        </Select>
                    ) : (
                        <Input {...field} type={type} min={0} id={name} style={{ width: '15rem' }} />
                    )
                }
            />
        </div>
    );
};

export default FormInput;
