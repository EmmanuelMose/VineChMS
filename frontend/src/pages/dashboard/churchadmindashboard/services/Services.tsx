import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { fetchServices, deleteService, type Service } from "../../../../Features/services/servicesAPI";
import CreateService from "./CreateService";
import UpdateService from "./UpdateService";
import "./Services.css";

export default function Services() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices(token);
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id, token);
        await loadServices();
      } catch (error) {
        console.error("Failed to delete service:", error);
      }
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setUpdateModalOpen(true);
  };

  const handleSuccess = () => {
    loadServices();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedService(null);
  };

  const getDayName = (day: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day] || "Unknown";
  };

  const getServiceType = (type: string) => {
    const types: Record<string, string> = {
      worship: "Worship",
      bible_study: "Bible Study",
      prayer: "Prayer",
      youth: "Youth",
      children: "Children",
      fellowship: "Fellowship",
      regular: "Regular",
    };
    return types[type] || type || "Regular";
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterType === "all" ||
      (filterType === "active" && service.isActive) ||
      (filterType === "inactive" && !service.isActive);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="services-loading">
        <div className="services-loading-spinner"></div>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="services-header">
        <div>
          <h2 className="services-title">Services</h2>
          <p className="services-subtitle">Manage church services and schedules</p>
        </div>
        <div className="services-actions">
          <button onClick={() => setCreateModalOpen(true)} className="services-btn-primary">
            <FiPlus size={18} />
            Add Service
          </button>
        </div>
      </div>

      <div className="services-toolbar">
        <div className="services-search">
          <FiSearch className="services-search-icon" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="services-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="services-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="services-filters">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="services-filter-select"
          >
            <option value="all">All Services</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.map((service) => (
          <div key={service.serviceId} className="services-card">
            <div className="services-card-header">
              <div className="services-card-title-section">
                <h3 className="services-card-title">{service.name}</h3>
                <span className={`services-card-status ${service.isActive ? "status-active" : "status-inactive"}`}>
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="services-card-actions">
                <button onClick={() => handleEdit(service)} className="services-action-btn services-action-edit">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => handleDelete(service.serviceId)} className="services-action-btn services-action-delete">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="services-card-description">
              {service.description || "No description provided"}
            </p>

            <div className="services-card-details">
              <div className="services-card-detail">
                <FiCalendar className="services-card-detail-icon" />
                <span>{getDayName(service.dayOfWeek)}</span>
              </div>
              <div className="services-card-detail">
                <FiClock className="services-card-detail-icon" />
                <span>{new Date(service.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {service.serviceType && (
                <div className="services-card-detail">
                  <FiMapPin className="services-card-detail-icon" />
                  <span>{getServiceType(service.serviceType)}</span>
                </div>
              )}
            </div>

            {service.attendanceType && (
              <div className="services-card-attendance">
                <span className="services-attendance-badge">
                  {service.attendanceType === "in_person" ? "In Person" : 
                   service.attendanceType === "online" ? "Online" : 
                   "Both"}
                </span>
              </div>
            )}
          </div>
        ))}
        {filteredServices.length === 0 && (
          <div className="services-empty">
            <p>No services found</p>
          </div>
        )}
      </div>

      <CreateService
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        churchId={churchId}
      />

      {selectedService && (
        <UpdateService
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedService(null);
          }}
          onSuccess={handleSuccess}
          service={selectedService}
        />
      )}
    </div>
  );
}