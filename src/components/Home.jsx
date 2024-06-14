import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToast } from "../store/toastSlice";
import "./Home.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HistoryList from "./HistoryList";
import { getUser, getSearchHistories, getGeoInfo, saveSearchHistory, deleteSearchHistories } from "../services/api";

const Home = ({ token, setToken }) => {
  const [ip, setIp] = useState("");
  const [geoInfo, setGeoInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserData();
    fetchSearchHistory();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getUser();
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const response = await getSearchHistories();
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

  const fetchGeoInfo = async (ipAddress) => {
    try {
      const response = await getGeoInfo(ipAddress);
      setGeoInfo(response.data);
      await saveSearchHistoryData(response.data);
    } catch (error) {
      console.error("Error fetching geo info:", error);
      dispatch(
        addToast({
          type: "error",
          message: "Error fetching geolocation information. Please try again.",
        })
      );
    }
  };

  const saveSearchHistoryData = async (geoData) => {
    try {
      const response = await saveSearchHistory(geoData);
      setHistory([...history, response.data]);
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  };

  const deleteSelectedSearchHistories = async (ids) => {
    try {
      await deleteSearchHistories(ids);
      setHistory((prev) => prev.filter((item) => !ids.includes(item.id)));
    } catch (error) {
      console.error("Error deleting search history:", error);
      dispatch(
        addToast({
          type: "error",
          message: "Error deleting search history. Please try again.",
        })
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateIP(ip)) {
      fetchGeoInfo(ip);
    } else {
      dispatch(addToast({ type: "error", message: "Invalid IP address." }));
    }
  };

  const validateIP = (ip) => {
    const ipRegex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleHistoryClick = (item) => {
    setGeoInfo(item);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  useEffect(() => {
    if (geoInfo && geoInfo.loc) {
      const [lat, lon] = geoInfo.loc.split(",");

      if (mapRef.current) {
        mapRef.current.remove();
      }

      mapRef.current = L.map("map").setView([lat, lon], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      L.marker([lat, lon])
        .addTo(mapRef.current)
        .bindPopup(`${geoInfo.city}, ${geoInfo.region}, ${geoInfo.country}`)
        .openPopup();
    }
  }, [geoInfo]);

  return (
    <div className="home-container">
      {user && (
        <div className="user-info">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>IP Address: </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            required
          />
        </div>
        <button type="submit">Get Geo Info</button>
      </form>
      {geoInfo && (
        <div className="geoinfo">
          <h3>Geolocation Information</h3>
          <p>IP: {geoInfo.ip}</p>
          <p>
            Location: {geoInfo.city}, {geoInfo.region}, {geoInfo.country}
          </p>
          <p>Coordinates: {geoInfo.loc}</p>
          <div id="map" style={{ height: "300px", width: "100%" }}></div>
        </div>
      )}
      <div className="history-list">
        <HistoryList
          history={history}
          onClick={handleHistoryClick}
          onDelete={deleteSelectedSearchHistories}
        />
      </div>
    </div>
  );
};

export default Home;
