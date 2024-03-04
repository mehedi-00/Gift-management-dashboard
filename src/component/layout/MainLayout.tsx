import { Button, Layout, Menu, Row } from "antd";
import { NavLink, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { TUser, logout, useCurrentToken } from "../../redux/features/auth/authSlice";
import { decodeJwtToken } from "../../utils/verifyJwtToken";
const { Header, Content, Sider } = Layout;
const items = [
    {
        key: '1',
        label: <NavLink to={'/'}>All Gift</NavLink>,
        allowedRoles: ['manager', 'seller']
    },
    {
        key: '2',
        label: <NavLink to={'/add-gift'}>Add Gift</NavLink>,
        allowedRoles: ['manager']
    },
    {
        key: '3',
        label: <NavLink to={'/sale-history'}>Sale History</NavLink>,
        allowedRoles: ['seller', 'manager']

    },
    {
        key: '4',
        label: <NavLink to={'/coupons'}>Coupon</NavLink>,
        allowedRoles: ['seller', 'manager']

    }
]
const MainLayout = () => {

    const dispath = useAppDispatch()
    const token = useAppSelector(useCurrentToken);

    let user;

    if (token) {
        user = decodeJwtToken(token) as TUser;
    }

    const userRole = user?.role || undefined
    return (
        <Layout style={{ height: '100%' }}>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
                style={{ height: '100vh', position: 'sticky', top: '0', left: '0' }}
            >
                <div
                    style={{
                        color: "white",

                        height: "4rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <h1>Gift client</h1>
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}
                >
                    {items
                        .filter(
                            (item) => userRole && item.allowedRoles.includes(userRole)
                        )
                        .map((item) => (
                            <Menu.Item key={item.key}>{item.label}</Menu.Item>
                        ))}
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: "15px 10px" }}>
                    <Row justify={'end'} align={'middle'} >
                        <Button style={{ background: 'red', color: "white", borderColor: 'transparent' }} onClick={() => dispath(logout())}>Logout</Button>
                    </Row>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,

                        }}
                    >
                        <Outlet />
                    </div>
                </Content>

            </Layout>
        </Layout>
    );
};

export default MainLayout;