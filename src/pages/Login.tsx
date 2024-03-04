/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Row } from "antd";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GForm from "../component/form/Form";
import FormInput from "../component/form/FormInput";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { setUser } from "../redux/features/auth/authSlice";
import { useAppDispatch } from "../redux/hook";
import { decodeJwtToken } from "../utils/verifyJwtToken";

const Login = () => {
    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const dispath = useAppDispatch()
    const { reset } = useForm()
    const onSubmit = async (data: FieldValues) => {
        const toastId = toast.loading("Register in...");
        try {
            const res = await login(data).unwrap();
            // console.log({ res });
            toast.success("login successFully", { id: toastId, duration: 2000 });
            const user = decodeJwtToken(res.data)
            dispath(setUser({ user, token: res.data }));
            reset()
            navigate('/')
        } catch (error: any) {
            console.log(error);
            toast.error(error?.data?.message || 'something went wrong', { id: toastId, duration: 2000 });
            reset()
        }
    }
    return (
        <Row justify={"center"} align={'middle'} style={{ height: "100vh" }}>
            <GForm onSubmit={onSubmit}>
                <FormInput type="email" name="email" label="User Email" />
                <FormInput type="password" name="password" label="User Password" />
                <Button htmlType="submit" style={{ marginTop: "10px" }}>Login</Button>
                {/* <p style={{ width: '100%', textAlign: 'center', color: 'red' }}>{ error?.data?.errorMessage}</p> */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <p>Allready have account please  </p> <Link to={'/register'}>Register</Link>
                </div>
            </GForm>
        </Row>
    );
};

export default Login;