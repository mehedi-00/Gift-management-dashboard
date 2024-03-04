/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Flex, Input, Modal, Row, Select, Space, Spin, Table } from "antd";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import GForm from "../component/form/Form";
import FormInput from "../component/form/FormInput";
import DuplicateModal from "../component/modal/DuplicateModal";
import SaleModal from "../component/modal/SaleModal";
import Title from "../component/shared/Title";
import { useAllGiftQuery, useDeleteGiftMutation, useManyDeleteGiftMutation, useUpdateGiftMutation } from "../redux/features/gift/giftApi";
import { decodeJwtToken } from "../utils/verifyJwtToken";
import { useAppSelector } from "../redux/hook";
import { TUser, useCurrentToken } from "../redux/features/auth/authSlice";
// import Search from "antd/es/input/Search";

const AllGift = () => {
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState<boolean>(false);
    const [isSaleeModalOpen, setIsSaleModalOpen] = useState<boolean>(false);
    const [giftRecord, setGiftRecord] = useState<any>({})
    const [updateGift] = useUpdateGiftMutation();
    const [deleteGift] = useDeleteGiftMutation()
    const [manyDeleteGift] = useManyDeleteGiftMutation()
    // console.log({ searchTerm });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedOccasion, setSelectedOccasion] = useState<string | undefined>(undefined);
    const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [selectedTheme, setSelectedTheme] = useState<string | undefined>(undefined);
    const [selectedPrice, setSelectedPrice] = useState<string | undefined>(undefined);
    const { data: gifts, isLoading } = useAllGiftQuery({ searchTerm, occasion: selectedOccasion, brand: selectedBrand, category: selectedCategory, theme: selectedTheme, sort: selectedPrice })
    const token = useAppSelector(useCurrentToken);
    let user;

    if (token) {
        user = decodeJwtToken(token) as TUser;
    }

    const userRole = user?.role || undefined
    // console.log(gifts);
    if (isLoading) {
        return <Spin size="large" fullscreen />
    }

    const handleCheckboxChange = (selectedRowKeys: React.Key[]) => {

        // const updatedSelectedRows = selectedRows.filter(row => !selectedRowKeys.includes(row._id));

        // if (updatedSelectedRows.length === selectedRows.length) {
        //     const selectedRowData = gifts?.data.find(row => row._id === selectedRowKeys[0]);
        //     updatedSelectedRows.push(selectedRowData);
        // }

        // setSelectedRows(updatedSelectedRows);
        const updatedSelectedIds = selectedRows.includes(selectedRowKeys[0])
            ? selectedRows.filter(id => id !== selectedRowKeys[0])
            : [...selectedRows, selectedRowKeys[0]];

        setSelectedRows(updatedSelectedIds);
    };
    // console.log({ selectedRows });

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleDuplicateCancel = () => {
        setIsDuplicateModalOpen(false);
    };
    const handleSaleCancel = () => {
        setIsSaleModalOpen(false);
    };


    const columns = [
        userRole === 'manager' ? {
            title: 'Select',
            dataIndex: 'select',
            key: 'select',
            render: (_text: any, record: any) => (
                <Checkbox checked={selectedRows.includes(record._id)} onChange={() => handleCheckboxChange([record._id])} />
            ),
        } : {},
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Occasion',
            dataIndex: 'occasion',
            key: 'occasion',
        },
        {
            title: 'Recipient',
            dataIndex: 'recipient',
            key: 'recipient',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Theme',
            dataIndex: 'theme',
            key: 'theme',
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },

        {
            title: 'Actions',
            key: 'actions',
            render: (_text: any, record: any) => (
                <Space size="middle">
                    {
                        userRole === 'manager' && <Button type="primary" onClick={() => handleEdit(record)}>
                            Edit
                        </Button>
                    }

                    {userRole === 'manager' && <Button style={{ background: 'red', color: 'white', borderColor: 'red' }} onClick={() => handleDelete(record)}>
                        Delete
                    </Button>}
                    {
                        userRole === 'seller' && <Button type="primary" onClick={() => handleSale(record)}>
                            Sale
                        </Button>
                    }
                    {userRole === 'manager' && <Button type="primary" onClick={() => handleDuplicate(record)}>
                        Duplicate
                    </Button>}
                </Space>
            ),
        },
    ];
    const handleEdit = (record: any) => {
        // Implement your edit logic here
        // console.log('Edit', record);
        setGiftRecord(record);
        setIsModalOpen(true);
    };
    const handleDuplicate = (record: any) => {
        // Implement your edit logic here
        // console.log('Edit', record);
        setGiftRecord(record);
        setIsDuplicateModalOpen(true);
    };
    const handleSale = (record: any) => {
        setGiftRecord(record);
        setIsSaleModalOpen(true);
    }


    /* 
     multiple silect and delete handler
    */
    const handleDeleteSelected = async () => {
        // Implement the logic to delete selected rows
        if (selectedRows.length === 0) {
            // Show a message or handle the case where no rows are selected
            return;
        }

        const toastId = toast.loading("Deleting selected gifts in...");
        try {
            // Delete selected rows here using deleteGift mutation
            // You might need to map through selectedRows and call deleteGift for each row
            // Example: await Promise.all(selectedRows.map((row) => deleteGift(row._id).unwrap()));
            await manyDeleteGift(selectedRows)

            setSelectedRows([])
            toast.success("Selected gifts deleted successfully", { id: toastId, duration: 2000 });

        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong', { id: toastId, duration: 2000 });
        }
    };
    const handleDelete = async (record: any) => {
        // Implement your delete logic here

        const toastId = toast.loading("Gift Delete prosses in...");
        try {
            await deleteGift(record._id).unwrap();
            toast.success("gift delete successFully", { id: toastId, duration: 2000 });
        } catch (error: any) {
            toast.error(error?.data?.message || 'something went wrong', { id: toastId, duration: 2000 });
        }
    };

    const onSubmit = async (data: FieldValues) => {
        const submitInfo = {
            data: {
                name: data?.name,
                price: Number(data?.price),
                quantity: Number(data?.quantity),
                occasion: data?.occasion,
                brand: data?.brand,
                theme: data?.theme,
                category: data?.category,
                recipient: data?.recipient
            },
            id: giftRecord?._id,
        }
        const toastId = toast.loading("Register in...");
        try {
            await updateGift(submitInfo).unwrap();

            toast.success("gift updated successFully", { id: toastId, duration: 2000 });
            setGiftRecord({})
            setIsModalOpen(false);
        } catch (error: any) {

            toast.error(error?.data?.message || 'something went wrong', { id: toastId, duration: 2000 });

        }
    }

    // console.log({ giftRecord });
    const defaultValues = {
        name: giftRecord?.name,
        price: giftRecord?.price,
        quantity: giftRecord?.quantity,
        occasion: giftRecord?.occasion,
        brand: giftRecord?.brand,
        theme: giftRecord?.theme,
        category: giftRecord?.category,
        recipient: giftRecord?.recipient
    };
    const handleSearch = (value: string) => {
        // Step 4: Update the search term and refetch data
        setSearchTerm(value);
    };
    const handleOccasionChange = (value: string) => {
        // Step 4: Update the selected occasion and refetch data
        setSelectedOccasion(value);
    };
    const handleBrandChange = (value: string) => {
        // Step 4: Update the selected occasion and refetch data
        setSelectedBrand(value);
    };
    const handleThemeChange = (value: string) => {
        // Step 4: Update the selected occasion and refetch data
        setSelectedTheme(value);
    };
    const handleCategoryChange = (value: string) => {
        // Step 4: Update the selected occasion and refetch data
        setSelectedCategory(value);
    };
    const handlePriceChange = (value: string) => {
        // Step 4: Update the selected occasion and refetch data
        setSelectedPrice(value);
    };
    return (

        <div>
            <Title title="Welcome to the AllGift page" />

            <Row className="add-gift-form-flex" align={'middle'} style={{ marginTop: '25px' }}>
                <Input.Search
                    placeholder="input search text"
                    style={{ width: '250px', marginBottom: '10px' }}
                    enterButton="Search"
                    size="large"
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <Select
                    placeholder="Filter by Occasion"
                    style={{ width: '150px', marginLeft: '10px', marginBottom: '10px' }}
                    onChange={handleOccasionChange}
                    value={selectedOccasion}
                >
                    <Select.Option value="holidays">Holidays</Select.Option>
                    <Select.Option value="birthdays">Birthdays</Select.Option>
                    <Select.Option value="anniversaries">Anniversaries</Select.Option>
                </Select>
                <Select
                    placeholder="Filter by Brand"
                    style={{ width: '150px', marginLeft: '10px', marginBottom: '10px' }}
                    onChange={handleBrandChange}
                    value={selectedBrand}
                >
                    <Select.Option value="Nike">Nike</Select.Option>
                    <Select.Option value="Amazon">Amazon</Select.Option>
                    <Select.Option value="Apple">Apple</Select.Option>
                </Select>
                <Select
                    placeholder="Filter by Theme"
                    style={{ width: '150px', marginLeft: '10px', marginBottom: '10px' }}
                    onChange={handleThemeChange}
                    value={selectedTheme}
                >
                    <Select.Option value="modern">modern</Select.Option>
                    <Select.Option value="romantic">romantic</Select.Option>
                    <Select.Option value="vintage">vintage</Select.Option>
                </Select>
                <Select
                    placeholder="Filter by Category"
                    style={{ width: '150px', marginLeft: '10px', marginBottom: '10px' }}
                    onChange={handleCategoryChange}
                    value={selectedCategory}
                >
                    <Select.Option value="home decor">home decor</Select.Option>
                    <Select.Option value="accessories">accessories</Select.Option>
                    <Select.Option value="gadgets">gadgets</Select.Option>
                </Select>
                <Select
                    placeholder="Filter by price"
                    style={{ width: '150px', marginLeft: '10px', marginBottom: '10px' }}
                    onChange={handlePriceChange}
                    value={selectedPrice}
                >
                    <Select.Option value="-price">High to low</Select.Option>
                    <Select.Option value="price">Low to high</Select.Option>
                </Select>
            </Row>
            <div className="responsive-table-container" style={{ marginTop: '40px' }}>
                <Table dataSource={gifts?.data} columns={columns} pagination={{ pageSize: 8 }} />
            </div>
            {userRole === 'manager' && <Button

                onClick={handleDeleteSelected}
                style={{ marginTop: '10px' }}
                disabled={selectedRows.length === 0}
            >
                Delete Selected
            </Button>}
            <Modal title="Edit Gift" open={isModalOpen} onCancel={handleCancel} centered={true} width={600} footer={null} >
                <Row justify={'center'} align={'middle'}  >
                    <GForm onSubmit={onSubmit} defaultValues={defaultValues}>
                        <Flex className="add-gift-form-flex" gap={5}>

                            <FormInput type="text" label="Gift Name" name="name" />
                            <FormInput type="text" label="Gift Price" name="price" />
                        </Flex>
                        <Flex className="add-gift-form-flex" gap={5}>

                            <FormInput type="number" defaultValue={giftRecord?.quantity} label="Gift Quantity" name="quantity" />
                            <FormInput type="select" label="Occasion" name="occasion" options={['holidays', "birthdays", "anniversaries"]} defaultValue={giftRecord?.occasion} />
                        </Flex>
                        <Flex className="add-gift-form-flex" gap={5}>
                            <FormInput type="select" defaultValue={giftRecord?.brand} label="Gift brand" name="brand" options={['Nike', "Apple", "Amazon"]} />
                            <FormInput type="select" defaultValue={giftRecord?.theme} label="Theme" name="theme" options={['modern', "romantic", "vintage"]} />
                        </Flex>
                        <Flex className="add-gift-form-flex" gap={5}>
                            <FormInput type="select" defaultValue={giftRecord?.category} label="Category" name="category" options={['home decor', "accessories", "gadgets"]} />
                            <FormInput type="text" defaultValue={giftRecord?.recipient} label="Recipient" name="recipient" />
                        </Flex>

                        <Button htmlType="submit" style={{ marginTop: "10px" }}>Submit</Button>

                    </GForm>
                </Row>
            </Modal>
            {isDuplicateModalOpen && <DuplicateModal
                isDuplicateModalOpen={isDuplicateModalOpen}
                handleDuplicateCancel={handleDuplicateCancel}
                defaultValues={defaultValues} />}


            <SaleModal isSaleeModalOpen={isSaleeModalOpen} handleSaleCancel={handleSaleCancel} giftData={giftRecord} />
        </div >
    );
};

export default AllGift;