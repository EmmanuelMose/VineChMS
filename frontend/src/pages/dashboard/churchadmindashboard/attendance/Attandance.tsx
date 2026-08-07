import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";
import { fetchAttendance, deleteAttendance, type Attendance as AttendanceType } from "../../../../Features/attendance/attendanceAPI";
import { fetchMembers, type Member } from "../../../../Features/members/membersAPI";
import { fetchServices, type Service } from "../../../../Features/services/servicesAPI";
import CreateAttendance from "./CreateAttendance";
import UpdateAttendance from "./UpdateAttendance";
import "./Attendance.css";

export default function Attendance() {
  const token = useSelector((state: any) => state.user.token);
  const churchId = useSelector((state: any) => state.user.user?.churchId);
  
  const [attendance, setAttendance] = useState<AttendanceType[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceType | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [attendanceData, membersData, servicesData] = await Promise.all([
        fetchAttendance(token),
        fetchMembers(token),
        fetchServices(token),
      ]);
      
      const filteredAttendance = attendanceData.filter(a => a.churchId === churchId);
      setAttendance(filteredAttendance);
      setMembers(membersData);
      setServices(servicesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await deleteAttendance(deleteTargetId, token);
        await loadData();
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      } catch (error) {
        console.error("Failed to delete attendance:", error);
      }
    }
  };

  const handleEdit = (record: AttendanceType) => {
    setSelectedAttendance(record);
    setUpdateModalOpen(true);
  };

  const handleSuccess = () => {
    loadData();
    setCreateModalOpen(false);
    setUpdateModalOpen(false);
    setSelectedAttendance(null);
  };

  const getMemberName = (memberId: number) => {
    const member = members.find(m => m.memberId === memberId);
    return member ? member.fullName : "Unknown";
  };

  const getServiceName = (serviceId: number) => {
    const service = services.find(s => s.serviceId === serviceId);
    return service ? service.name : "Unknown";
  };

  const filteredAttendance = attendance.filter(record => {
    const memberName = getMemberName(record.memberId).toLowerCase();
    const serviceName = getServiceName(record.serviceId).toLowerCase();
    const matchesSearch = memberName.includes(searchTerm.toLowerCase()) || serviceName.includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "present" && record.attended) ||
      (filterStatus === "absent" && !record.attended);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.attended).length,
    absent: attendance.filter(a => !a.attended).length,
    attendanceRate: attendance.length > 0 ? Math.round((attendance.filter(a => a.attended).length / attendance.length) * 100) : 0,
  };

  if (loading) {
    return (
      <div className="attendance-loading">
        <div className="attendance-loading-spinner"></div>
        <p>Loading attendance records...</p>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      {showDeleteModal && (
        <div className="attendance-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="attendance-modal attendance-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="attendance-modal-header">
              <h3>Delete Attendance Record</h3>
              <button onClick={() => setShowDeleteModal(false)} className="attendance-modal-close">
                <FiX size={20} />
              </button>
            </div>
            <div className="attendance-modal-body">
              <p>Are you sure you want to permanently delete this attendance record?</p>
              <p className="attendance-modal-warning">This action cannot be undone.</p>
            </div>
            <div className="attendance-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="attendance-btn-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="attendance-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="attendance-header">
        <div>
          <h2 className="attendance-title">Attendance</h2>
          <p className="attendance-subtitle">Track and manage service attendance</p>
        </div>
        <div className="attendance-actions">
          <button onClick={() => setCreateModalOpen(true)} className="attendance-btn-primary">
            <FiPlus size={18} />
            Record Attendance
          </button>
        </div>
      </div>

      <div className="attendance-stats-grid">
        <div className="attendance-stat-card stat-total">
          <span className="attendance-stat-value">{stats.total}</span>
          <span className="attendance-stat-label">Total Records</span>
        </div>
        <div className="attendance-stat-card stat-present">
          <span className="attendance-stat-value">{stats.present}</span>
          <span className="attendance-stat-label">Present</span>
        </div>
        <div className="attendance-stat-card stat-absent">
          <span className="attendance-stat-value">{stats.absent}</span>
          <span className="attendance-stat-label">Absent</span>
        </div>
        <div className="attendance-stat-card stat-rate">
          <span className="attendance-stat-value">{stats.attendanceRate}%</span>
          <span className="attendance-stat-label">Attendance Rate</span>
        </div>
      </div>

      <div className="attendance-toolbar">
        <div className="attendance-search">
          <FiSearch className="attendance-search-icon" />
          <input
            type="text"
            placeholder="Search by member or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="attendance-search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="attendance-search-clear">
              <FiX size={16} />
            </button>
          )}
        </div>
        <div className="attendance-filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="attendance-filter-select"
          >
            <option value="all">All Records</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>
      </div>

      <div className="attendance-table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((record) => (
              <tr key={record.attendanceId}>
                <td>
                  <div className="attendance-cell-member">
                    <div className="attendance-avatar">
                      {getMemberName(record.memberId).charAt(0).toUpperCase()}
                    </div>
                    <span>{getMemberName(record.memberId)}</span>
                  </div>
                </td>
                <td>{getServiceName(record.serviceId)}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>
                  <span className={`attendance-status-badge ${record.attended ? "status-present" : "status-absent"}`}>
                    {record.attended ? (
                      <><FiCheckCircle size={14} /> Present</>
                    ) : (
                      <><FiXCircle size={14} /> Absent</>
                    )}
                  </span>
                </td>
                <td>
                  {record.checkInTime ? (
                    <span className="attendance-time">
                      <FiClock size={14} />
                      {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  ) : (
                    <span className="attendance-time-empty">—</span>
                  )}
                </td>
                <td>
                  {record.checkOutTime ? (
                    <span className="attendance-time">
                      <FiClock size={14} />
                      {new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  ) : (
                    <span className="attendance-time-empty">—</span>
                  )}
                </td>
                <td>
                  <div className="attendance-actions-cell">
                    <button onClick={() => handleEdit(record)} className="attendance-action-btn attendance-action-edit" title="Edit">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(record.attendanceId)} className="attendance-action-btn attendance-action-delete" title="Delete">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAttendance.length === 0 && (
              <tr>
                <td colSpan={7} className="attendance-empty">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateAttendance
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleSuccess}
        members={members}
        services={services}
      />

      {selectedAttendance && (
        <UpdateAttendance
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedAttendance(null);
          }}
          onSuccess={handleSuccess}
          attendance={selectedAttendance}
          members={members}
          services={services}
        />
      )}
    </div>
  );
}