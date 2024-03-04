/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Modal, Row } from "antd";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useAddGiftMutation } from "../../redux/features/gift/giftApi";
import GForm from "../form/Form";
import FormInput from "../form/FormInput";

const DuplicateModal = ({ isDuplicateModalOpen, handleDuplicateCancel, defaultValues }: any) => {
    const [addGift] = useAddGiftMutation()
    const onsubmit = async (data: FieldValues) => {
        const toastId = toast.loading("duplicate gift procces on...");
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

            toast.success("gift duplicate successFully", { id: toastId, duration: 2000 });
            handleDuplicateCancel()

        } catch (error: any) {
            console.log(error);
            toast.error(error?.data?.message || 'something went wrong', { id: toastId, duration: 2000 });

        }
    }
    return (
        <Modal title="Duplicate Gift Or Modify" open={isDuplicateModalOpen} onCancel={handleDuplicateCancel} centered={true} width={600} footer={null} >
            <Row justify={'center'} align={'middle'}  >
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
        </Modal>
    );
};

export default DuplicateModal;