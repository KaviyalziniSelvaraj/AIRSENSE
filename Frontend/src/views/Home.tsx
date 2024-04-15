import React, { useState, createContext, useContext } from "react";
import {
  Button,
  ConfigProvider,
  Flex,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { useForm } from "react-hook-form";
import insertdata from "../Controllers/Predict";
import Result from "./Result";
import { Spinner } from "react-bootstrap";
import { usetheme } from "../Components/DefaultLayout";
import CrudOps from "../crud";
import { CSVLink } from "react-csv";
import { AnyObject } from "antd/es/_util/type";

export const useresult = createContext(""); // Creating the context

export interface Datamodel {
  SO2: number;
  NO2: number;
  O3: number;
  PM2_5: number;
}

const Home: React.FC = () => {
  const theme = useContext(usetheme);
  console.log(theme);

  const [result, setresult] = useState("");
  const [loading, setloading] = useState(false);
  const [excelsrc, setexcelsrc] = useState<AnyObject[]>([]); // Initialize loading state to false
  const { Text } = Typography;

  const handleSubmit = async (value: Datamodel) => {
    try {
      setloading(true); // Set loading to true before making the request
      console.log("Loading set to true");
      var res = await insertdata(value);
      console.log("Prediction request succeeded:", res);
      await CrudOps.Create({
        NO2: value.NO2,
        O3: value.O3,
        PM2_5: value.PM2_5,
        SO2: value.SO2,
        Aqi: res.split(":")[0],
        issues: res.split(":")[1],
        remedies: res.split(":")[2],
      }).then(() => {
        setresult(res);
      });
    } catch (error) {
      console.error("Prediction request failed:", error);
    } finally {
      setloading(false); // Set loading to false after receiving the result or in case of error
      console.log("Loading set to false");
    }
  };

  const { handleSubmit: handleFormSubmit, register } = useForm<Datamodel>();

  return (
    <>
      <useresult.Provider value={result}>
        <Flex
          justify="center"
          style={{ paddingLeft: 50, paddingTop: 100, paddingRight: 25 }}
        >
          <form
            onSubmit={handleFormSubmit(async (value) => {
              await handleSubmit(value);
            })}
          >
            <Flex vertical gap={20}>
              <Text strong style={{ color: theme, fontSize: 20 }}>
                Predict AQI
              </Text>
              <Space direction="horizontal">
                <Text style={{ color: theme }}>SO2 concentration: </Text>
                <input
                  id={"SO2"}
                  placeholder="Ex:30.456"
                  formNoValidate
                  {...register("SO2")}
                ></input>
              </Space>
              <Space direction="horizontal">
                <Text style={{ color: theme }}>NO2 concentration: </Text>
                <input
                  id="NO2"
                  placeholder="Ex:30.456"
                  formNoValidate
                  {...register("NO2")}
                ></input>
              </Space>
              <Space direction="horizontal">
                <Text style={{ color: theme }}>O3 concentration: </Text>
                <input
                  id="O3"
                  placeholder="Ex:30.456"
                  formNoValidate
                  {...register("O3")}
                ></input>
              </Space>
              <Space direction="horizontal">
                <Text style={{ color: theme }}>PM2.5 concentration: </Text>
                <input
                  id="PM2_5"
                  placeholder="Ex:30.456"
                  formNoValidate
                  {...register("PM2_5")}
                ></input>
              </Space>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      colorPrimaryBg: "#964F4CFF",
                    },
                  },
                }}
              />
              <Space size={30}>
                <Button
                  htmlType="submit"
                  style={{ backgroundColor: "#4EDCC3" }}
                >
                  Predict
                </Button>
               
                {excelsrc.length > 0 ? (
                  <CSVLink
                    data={Object.values(excelsrc)}
                    filename={"AirDataReport"}
                  >
                    <Typography.Text>Download Excel</Typography.Text>
                  </CSVLink>
                ) :  <Button
                onClick={async () => {
                  CrudOps.Read().then((list) => {
                    setexcelsrc(list);
                  });
                }}
                style={{ backgroundColor: "#4EDCC3" }}
              >
                Generate Excel
              </Button>}
              </Space>
              {
                <Spin spinning={loading} style={{ fontSize: 30 }}>
                  <Result />
                </Spin>
              }
            </Flex>
          </form>
        </Flex>
      </useresult.Provider>
    </>
  );
};

export default Home;
