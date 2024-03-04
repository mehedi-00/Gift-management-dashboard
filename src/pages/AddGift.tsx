/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Row } from "antd";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GForm from "../component/form/Form";
import FormInput from "../component/form/FormInput";
import Title from "../component/shared/Title";
import { useAddGiftMutation } from "../redux/features/gift/giftApi";

const AddGift = () => {
    const [addGift] = useAddGiftMutation()
    const navigate = useNavigate()
    const onsubmit = async (data: FieldValues) => {
        const toastId = toast.loading("add gift procces on...");
        const giftData = {
            name: data?.name,
            price: Number(data?.price),
            quantity: Number(data?.quantity),
            occasion: data?.occasion,
            brand: data?.brand,
            theme: data?.theme,
            category: data?.category,
            recipient: data?.recipient
        }
        try {
            await addGift(giftData).unwrap();

            toast.success("gift add successFully", { id: toastId, duration: 2000 });
            navigate('/')
        } catch (error: any) {
            console.log(error);
            toast.error(error?.data?.message || 'something went wrong', { id: toastId, duration: 2000 });

        }
    }
    const defaultValues = {

        occasion: 'birthdays',
        brand: 'Apple',
        theme: 'modern',
        category: 'gadgets',
    }
    return (
        <div>
            <Title title="Add your best Gift" />

            <Row justify={'center'} align={'middle'} className="add-gift-form-row"  >
                <GForm onSubmit={onsubmit} defaultValues={defaultValues}>
                    <Flex className="add-gift-form-flex" gap={5}>

                        <FormInput type="text" label="Gift Name" name="name" />
                        <FormInput type="text" label="Gift Price" name="price" />
                    </Flex>
                    <Flex className="add-gift-form-flex" gap={5}>

                        <FormInput type="number" label="Gift Quantity" name="quantity" />
                        <FormInput type="select" label="Occasion" name="occasion" options={['holidays', "birthdays", "anniversaries"]} />
                    </Flex>
                    <Flex className="add-gift-form-flex" gap={5}>
                        <FormInput type="select" label="Gift brand" name="brand" options={['Nike', "Apple", "Amazon"]} />
                        <FormInput type="select" label="Theme" name="theme" options={['modern', "romantic", "vintage"]} />
                    </Flex>
                    <Flex className="add-gift-form-flex" gap={5}>
                        <FormInput type="select" label="Category" name="category" options={['home decor', "accessories", "gadgets"]} />
                        <FormInput type="text" label="Recipient" name="recipient" />
                    </Flex>

                    <Button htmlType="submit" style={{ marginTop: "10px" }}>Submit</Button>

                </GForm>
            </Row>
        </div>
    );
};

export default AddGift;