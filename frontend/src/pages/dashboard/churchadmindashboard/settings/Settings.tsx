import { useState } from "react";
import { useSelector } from "react-redux";
import ChurchProfile from "../churchprofile/ChurchProfile";
import AdminProfile from "../adminprofile/AdminProfile";
import "./Settings.css";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("church");
  const user = useSelector((state: any) => state.user.user);
  const churchId = useSelector((state: any) => state.user.user?.churchId);

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-subtitle">Manage your church and profile settings</p>
      </div>

      <div className="settings-tabs">
        <button 
          className={`settings-tab ${activeTab === "church" ? "settings-tab-active" : ""}`}
          onClick={() => setActiveTab("church")}
        >
          Church Profile
        </button>
        <button 
          className={`settings-tab ${activeTab === "admin" ? "settings-tab-active" : ""}`}
          onClick={() => setActiveTab("admin")}
        >
          Admin Profile
        </button>
      </div>

      <div className="settings-content">
        {activeTab === "church" && <ChurchProfile churchId={churchId} />}
        {activeTab === "admin" && <AdminProfile user={user} />}
      </div>
    </div>
  );
}