/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Row } from "antd";
import { FieldValues } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GForm from "../component/form/Form";
import FormInput from "../component/form/FormInput";
import { useRegisterMutation } from "../redux/features/auth/authApi";

const Register = () => {

    const [register] = useRegisterMutation()
    // console.log({ data }, { error });
    const navigate = useNavigate()
    const onSubmit = async (data: FieldValues) => {
        const toastId = toast.loading("Register in...");

        try {
            await register(data).unwrap();

            toast.success("Register successFully", { id: toastId, duration: 2000 });
            navigate('/login')
        } catch (error: any) {
            toast.error(error?.data?.errorMessage || "something went wrong", { id: toastId, duration: 2000 });
        }
    }
    return (
        <div >
            <Row justify={"center"} align={'middle'} style={{ height: "100vh" }}>
                <GForm onSubmit={onSubmit}>
                    <FormInput type="text" name="userName" label="User Name" />
                    <FormInput type="email" name="email" label="User Email" />
                    <FormInput type="password" name="password" label="User Password" />
                    <FormInput type="select" name="role" label="User Role" options={['manager', 'seller']} />
                    <Button htmlType="submit" style={{ marginTop: "10px" }}>Register</Button>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <p>Allready have account please  </p> <Link to={'/login'}>Login</Link>
                    </div>
                </GForm>
            </Row>

        </div>
    );
};

export default Register;