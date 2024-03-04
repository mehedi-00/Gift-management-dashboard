import { DatePicker, Form, } from "antd";
import { Controller } from "react-hook-form";

type TInputProps = {
    name: string;
    label?: string;

};

const DatePickerInput = ({ name, label, }: TInputProps) => {
    return (
        <div>
            <label htmlFor={name} style={{ margin: "10px 0", display: 'block' }}>
                {label}
            </label>
            <Controller
                name={name}
                render={({ field }) => (
                    <Form.Item >
                        <DatePicker {...field} size="large" showTime showSecond={false} style={{ width: '20rem' }} />
                    </Form.Item>
                )}
            />
        </div>
    );
};

export default DatePickerInput;
