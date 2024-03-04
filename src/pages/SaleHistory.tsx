/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Row, Select, Spin, Table } from "antd";
import Title from "../component/shared/Title";
import { useSaleHistoryQuery } from "../redux/features/sale/saleApi";
import { useRef, useState } from "react";
import moment from "moment";
import jsPDF from "jspdf";




const SaleHistory = () => {
    const [selectedDate, setSelectedDate] = useState<string>('')
    const { data: salesHistory, isLoading } = useSaleHistoryQuery({ timeRange: selectedDate })
    // console.log({ salesHistory });
    const [loader, setLoader] = useState(false);
    // const [recordData, setRecordData] = useState<Record<string, unknown>>({})
    const tableRef = useRef(null);



    if (isLoading) {
        return <Spin size="large" fullscreen />
    }

    const onSearch = (value: string) => {
        console.log('search:', value);
    };
    const downloadPDF = (record: any) => {
        // setRecordData(record)
        setLoader(true);


        const pdf: any = new jsPDF('p', 'mm', 'a4', true);

        // Calculate center position for text
        const centerPosition = (pdf.internal.pageSize.getWidth() / 2) - (pdf.getStringUnitWidth(`${record.buyerName}_SaleHistory.pdf`) * pdf.internal.getFontSize() / 2);

        // Customize the PDF content based on the record data
        pdf.text(`Buyer Name: ${record.buyerName}`, centerPosition, 30);
        pdf.text(`Seller Name: ${record.seller?.userName}`, centerPosition, 40);
        pdf.text(`Gift Name: ${record.giftName}`, centerPosition, 50);
        pdf.text(`Amount: ${record.totalPrice}`, centerPosition, 60);
        pdf.text(`Product Quantity: ${record.productQuantity}`, centerPosition, 70);
        pdf.text(`Sale Date: ${moment(record.saleDate).format('DD-MM-YYYY')}`, centerPosition, 80);

        // Save the PDF with a specific filename
        pdf.save(`${record.buyerName}_SaleHistory.pdf`);

        setLoader(false);
    };
    const columns = [

        {
            title: 'Buyer Name',
            dataIndex: 'buyerName',
            key: 'buyerName',
        },
        {
            title: 'Seller Name',
            dataIndex: 'seller',
            key: 'sellerName',
            render: (value: Record<string, any>) => value?.userName,
        },
        {
            title: 'Gift Name',
            dataIndex: 'giftName',
            key: 'giftName',

        },
        {
            title: 'Ammount',
            dataIndex: 'totalPrice',
            key: 'totalPrice',

        },
        {
            title: 'Product Quantity',
            dataIndex: 'productQuantity',
            key: 'productQuantity',
        },
        {
            title: 'Sale Date',
            dataIndex: 'saleDate',
            key: 'date',
            render: (text: string) => {
                return moment(text).format('DD-MM-YYYY')
            }
        },
        {
            title: "Download",
            key: "download",
            render: (record: any) => (
                <Button onClick={() => downloadPDF(record)}
                    disabled={!(loader === false)}>
                    {loader ? (
                        <span>Downloading</span>
                    ) : (
                        <span>Download</span>
                    )}
                </Button>
            ),
        },

    ];

    const handleDateChange = (value: string) => {
        // Step 4: Update the selected occasion and refetch data

        setSelectedDate(value);
    };
    // console.log({ selectedDate });
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <div>
            <Title title="Welcome to the SaleHistory page" />
            <Row justify={'end'}>
                <Select
                    showSearch
                    placeholder="Filter by Date"
                    optionFilterProp="children"
                    onChange={handleDateChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={[
                        {
                            value: '1d',
                            label: '1 day',
                        },
                        {
                            value: '7d',
                            label: '7 day',
                        },
                        {
                            value: '30d',
                            label: '30 day',
                        },
                        {
                            value: '1y',
                            label: '1 year',
                        },
                    ]}
                />
            </Row>
            <div className="responsive-table-container " style={{ marginTop: '40px' }} ref={tableRef} >
                <Table dataSource={salesHistory?.data} columns={columns} pagination={{ pageSize: 8 }} />
            </div>



        </div>
    );
};

export default SaleHistory;