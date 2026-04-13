import { useEffect, useState } from "react";
import authSvc from "../services/Auth.service";

const BusDetail = () => {
  const [buses, setBuses] = useState([]);
  const fetchBuses = async () => {
    try {
      const response = await authSvc.getRequest("/bus");
      console.log("Full response:", response);

      setBuses(response.data || []);
      console.log("Bus data:", response.data);
    } catch (err) {
      console.error(err);
    } 
  };
  useEffect(() => {
    fetchBuses();
  }, []);

  let totalBuses = buses.length;
  return totalBuses;
};


export default BusDetail;