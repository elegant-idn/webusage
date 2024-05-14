import axios from "axios";

export const fetchData = async (queryParams, setData, setPieDataArray) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/data${queryParams}`
    );
    setData(response.data);
    setPieDataArray(processData(response.data));
  } catch (error) {
    console.error(error);
  }
};

const processData = (data) => {
  // Same reduction logic to process data
  return data.reduce((acc, curr) => {
    const foundUser = acc.find((item) => item[0]?.username === curr.username);
    if (foundUser) {
      const foundUrl = foundUser.find((item) => item.url === curr.url);
      if (foundUrl) {
        foundUrl.duration += curr.duration;
      } else {
        foundUser.push(curr);
      }
    } else {
      acc.push([curr]);
    }
    return acc;
  }, []);
};
