/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, Spin, Table } from "antd";
import moment from "moment";
import { useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import DatePickerInput from "../component/form/DatePickerInput";
import GForm from "../component/form/Form";
import FormInput from "../component/form/FormInput";
import { TUser, useCurrentToken } from "../redux/features/auth/authSlice";
import { useAddCouponMutation, useAllCouponQuery } from "../redux/features/coupon/couponApi";
import { useAppSelector } from "../redux/hook";
import { decodeJwtToken } from "../utils/verifyJwtToken";
import { toast } from "sonner";

const Coupons = () => {
    const [addCoupon, { isLoading }] = useAddCouponMutation()
    const { data: couponData, isFetching } = useAllCouponQuery(undefined)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = useAppSelector(useCurrentToken);
    let user;

    if (token) {
        user = decodeJwtToken(token) as TUser;
    }
    if (isLoading) {
        return <Spin />
    }
    // console.log({ couponData });
    const userRole = user?.role || undefined
    const columns = [
        {
            title: 'Code',
            key: 'code',
            dataIndex: 'code',
        },
        {
            title: 'Discount Percentage',
            key: 'discountPercentage',
            dataIndex: 'discountPercentage',
            render: (text: string) => `${text}% OFF`
        },
        {
            title: 'expirationDate',
            key: 'expirationDate',
            dataIndex: 'expirationDate',
            render: (text: string) => moment(text).format('DD-MM-YYYY HH:mm A'),
        }

    ]


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const couponData = {
            code: data.code,
            discountPercentage: Number(data.discountPercentage),
            expirationDate: data.expirationDate
        }
        const toastId = toast.loading("Submiting...");

        try {
            handleCancel()
            await addCoupon(couponData);

            toast.success("Coupon Add successFully", { id: toastId, duration: 2000 });

        } catch (error: any) {
            toast.error(error?.data?.errorMessage || "something went wrong", { id: toastId, duration: 2000 });
        }

    }
    return (
        <>
            {userRole === 'manager' && <Button style={{ marginBottom: '2rem' }} onClick={showModal}> Add Coupon </Button>}
            <Table
                loading={isFetching}
                columns={columns}
                dataSource={couponData?.data}
                pagination={false}
            />

            {userRole === 'manager' && <Modal title="Add Coupon" footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <GForm onSubmit={onSubmit}>
                    <FormInput name="code" label="Code" type="text" />
                    <FormInput name="discountPercentage" label="Discount Percentage" type="Number" />
                    <DatePickerInput name="expirationDate" label="Expiration Date" />
                    <Button htmlType="submit">Submit</Button>
                </GForm>
            </Modal>}
        </>

    );
};

export default Coupons;