import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/auth", { replace: true }); }, [navigate]);
  return null;
};

export default Home;
