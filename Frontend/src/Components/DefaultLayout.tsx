import { Col, Flex, Layout, Menu, Row, Space, Typography } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { MenuOutlined } from '@ant-design/icons';
import { createContext, useState } from "react";
import { useNavigate } from "react-router";
interface Custominterface{
    children:React.ReactNode
}
export const usetheme = createContext(''); 
const DefaultLayout:React.FC<Custominterface>=({children})=>
{
    const nav=useNavigate();
    const [theme,settheme]=useState(true);
    const [themecolor,setthemecolor]=useState('radial-gradient(circle, #dfd0ff, #e4d9ff, #eae2ff, #f0eaff, #f6f3ff, #f6f3ff, #f6f3ff, #f6f3ff, #f0eaff, #eae2ff, #e4d9ff, #dfd0ff)');
    const [textcolor,settextcolor]=useState('#000000');

    const {Text}=Typography;
    return(
        <usetheme.Provider value={textcolor}>
        <Layout >
            <Space direction="vertical" size={20}>
            <Header>
            <Row justify={'space-between'}>
                        <Text style={{color:'white', padding:20}}>AIRSENSE</Text>
                        <Row justify={'end'}>
                            <Col xs={1} sm={2} xl={18} lg={12} xxl={12} >
                            <Menu  mode='horizontal' theme='dark' overflowedIndicator={<MenuOutlined/>}>
                            <Menu.Item onClick={()=>
                            {
                                nav('/');
                            }}>AIR NOW</Menu.Item>
                            {/* <Menu.Item onClick={()=>
                            {
                                nav('/Weather');
                            }}>WEATHER</Menu.Item> */}
                            <Menu.Item onClick={()=>{
                            settheme(!theme);
                            if(theme)
                            {
                                setthemecolor('linear-gradient(to bottom, #142850, #221f3f, #24172e, #1f111f, #180a13, #190712, #190511, #1a0210, #22051c, #26082a, #240c3c, #141450)');
                                settextcolor('#ffffff');
                            }
                            else{
                                setthemecolor('radial-gradient(circle, #dfd0ff, #e4d9ff, #eae2ff, #f0eaff, #f6f3ff, #f6f3ff, #f6f3ff, #f6f3ff, #f0eaff, #eae2ff, #e4d9ff, #dfd0ff)');
                                settextcolor('#000000')
                            }
                            
                            }}>THEME</Menu.Item>
                            </Menu>
                            </Col>
                            </Row>
                        </Row>
            </Header>
            <Content style={{minHeight:'90vh',background:themecolor}}>
                {children}
            </Content>
            <Footer>
            <center>CopyRight @Airsense.com</center>
            </Footer>
            </Space>
        </Layout>
        </usetheme.Provider>

    )
}
export default DefaultLayout;