import React, { useContext } from "react";
import { Card, Space, Typography } from "antd";
import { useresult } from "./Home";
import { Spinner } from "react-bootstrap";

const Result: React.FC = () => {
    const result = useContext(useresult);
    const { Text } = Typography;
    if(result==='')
    {
        return(<>
        <Spinner animation="grow"></Spinner>
        </>)
    }
    else{
    return (
        <>
        <Card>
            <Space direction="vertical" size={10}>
                <Text style={{ color:'black', fontSize: 20 }}>
                    Predicted AQI : {result.split(":")[0]}
                </Text>
                <Text style={{color:'black', fontSize: 20 }}>
                    Related health issues: {result.split(":")[1]}
                </Text>
                <Text style={{ color:'black', fontSize: 20 }}>
                    Remedies : {result.split(":")[2]}
                </Text>
            </Space>
        </Card>
        </>
    )
    }
}

export default Result;
