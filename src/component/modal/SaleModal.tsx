/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, Row, Spin } from "antd";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useAddSaleMutation } from "../../redux/features/sale/saleApi";
import GForm from "../form/Form";
import FormInput from "../form/FormInput";

const SaleModal = ({ isSaleeModalOpen, handleSaleCancel, giftData }: any) => {
    const [addSale, { isLoading }] = useAddSaleMutation()
    const [isCoupon, setIsCoupon] = useState(false)
    const [error, seterror] = useState('')
    // const { reset } = useFormContext();
    if (isLoading) {
        return <Spin />
    }
    const onSubmit = async (data: FieldValues) => {
        console.log(data);

        const toastId = toast.loading("sale gift procces on...");
        const saleInfo = {
            data: {
                productQuantity: Number(data.productQuantity),
                buyerName: data.buyerName,
                saleDate: data.saleDate,
                couponCode: data.couponCode
            },
            id: giftData._id
        }
        if (giftData.quantity < saleInfo.data.productQuantity) {

            seterror('quantitity is bigger than product quantity')
            return
        }
        try {
            await addSale(saleInfo).unwrap();

            toast.success("gift sale successFully", { id: toastId, duration: 2000 });
            handleSaleCancel()
            setIsCoupon(false)
        } catch (error: any) {
            console.log(error);
            setIsCoupon(false)
            toast.error(error?.data?.message || 'something went wrong', { id: toastId, duration: 2000 });

        }
    }
    return (
        <Modal title="Gift Sale" open={isSaleeModalOpen} onCancel={handleSaleCancel} centered={true} width={600} footer={null} >
            <Row justify={'center'} align={'middle'}  >
                <GForm onSubmit={onSubmit} >
                    <FormInput type="number" label="Product Quantity" name="productQuantity" />
                    <FormInput type="text" label="Buyer Name" name="buyerName" />
                    <FormInput type="date" label="Sale Date" name="saleDate" />
                    {/* <DateINput label="Sale Date" name="saleDate" /> */}
                    <Button onClick={() => setIsCoupon(true)} style={{ display: 'block', margin: '1rem 0' }}>Add Coupon</Button>
                    {
                        isCoupon && <FormInput type="text" label="Coupon Code" name="couponCode" />
                    }

                    <Button htmlType="submit" style={{ marginTop: "10px" }}>Submit</Button>

                </GForm>
            </Row>
            <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        </Modal>
    );
};

export default SaleModal;