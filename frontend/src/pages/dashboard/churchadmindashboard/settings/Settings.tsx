import { useState } from "react";
import { useSelector } from "react-redux";
import { FiUser, FiSettings } from "react-icons/fi";
import { FaChurch } from "react-icons/fa";
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
        <div className="settings-header-content">
          <div className="settings-header-text">
            <span className="settings-badge">Settings</span>
            <h2 className="settings-title">Manage Your Profile & Church</h2>
            <p className="settings-subtitle">
              Update your personal information and church details
            </p>
          </div>
          <div className="settings-header-icon">
            <FiSettings className="settings-icon" />
          </div>
        </div>
      </div>

      <div className="settings-tabs-wrapper">
        <div className="settings-tabs">
          <button 
            className={`settings-tab ${activeTab === "church" ? "settings-tab-active" : ""}`}
            onClick={() => setActiveTab("church")}
          >
            <FaChurch size={18} className="settings-tab-icon" />
            <span>Church Profile</span>
          </button>
          <button 
            className={`settings-tab ${activeTab === "admin" ? "settings-tab-active" : ""}`}
            onClick={() => setActiveTab("admin")}
          >
            <FiUser size={18} className="settings-tab-icon" />
            <span>Admin Profile</span>
          </button>
        </div>
        <div className="settings-tab-indicator">
          <div 
            className={`settings-tab-indicator-bar ${activeTab === "church" ? "indicator-left" : "indicator-right"}`}
          />
        </div>
      </div>

      <div className="settings-content-wrapper">
        <div className="settings-content">
          {activeTab === "church" && <ChurchProfile churchId={churchId} />}
          {activeTab === "admin" && <AdminProfile user={user} />}
        </div>
      </div>
    </div>
  );
}