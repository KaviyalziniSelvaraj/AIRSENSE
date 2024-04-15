import axios, { AxiosResponse } from 'axios'
import { message } from 'antd';
import { Datamodel } from '../views/Home';

const insertdata = async (value: Datamodel) => {
  console.log("entered axios");
  try {
    const response = await axios.post('http://10.1.70.237:3000/', {
      'SO2': value.SO2,
      'NO2': value.NO2,
      'O3': value.O3,
      'PM2_5': value.PM2_5
    });
    message.success("data fetched successfully!");
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    message.error('Error occurred while logging in');
  }
};

export default insertdata;
