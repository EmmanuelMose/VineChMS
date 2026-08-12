# ⛪ VineChMS – Church Governance & Management Platform

> **A modern multi-tenant SaaS platform for church governance, administration, and member management.**

---

## 📖 Overview

**VineChMS (Vine Church Management System)** is a cloud-based Church Governance & Management Platform designed to help churches and church organizations efficiently manage members, leadership, finances, attendance, events, communication, and organizational governance.

The platform supports a **hierarchical multi-tenant architecture**, allowing governing church bodies to oversee subordinate organizations while preserving each church's autonomy and data ownership.

---

## 🎯 Vision

To provide churches and Christian organizations with a secure, scalable, and intelligent digital platform that simplifies administration, strengthens governance, and enhances member engagement.

---

# 🏗 System Hierarchy

VineChMS follows a hierarchical organizational structure:

```text
Large Organization
        │
        ▼
Small Organization
        │
        ▼
Local Church
        │
        ▼
Church Members
```

Each level has dedicated administrators, members, and permissions.

---

# 👥 User Dashboards

The platform includes six role-specific dashboards:

| Dashboard                    | Description                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| 🏢 Large Organization Admin  | Manages the entire organization and all subordinate organizations.                    |
| 👥 Large Organization Member | Access to organization-level information based on permissions.                        |
| 🏛 Small Organization Admin  | Manages churches under their organization.                                            |
| 👤 Small Organization Member | Access to organization activities and reports.                                        |
| ⛪ Local Church Admin         | Manages church members, ministries, finances, attendance, and events.                 |
| 🙋 Local Church Member       | Access to personal profile, giving, attendance, announcements, and church activities. |

---

# 🔄 Registration Workflow

Registration is invitation-based to ensure security.

```text
Large Organization Admin
        │
        ▼
Invites Small Organization Admin
        │
        ▼
Small Organization Admin
        │
        ▼
Creates Local Churches
        │
        ▼
Invites Church Administrators
        │
        ▼
Church Administrator
        │
        ▼
Invites Church Members
```

Users can only register using a valid invitation email.

After authentication, users are automatically redirected to the appropriate dashboard.

---

# 🚀 Core Features

## Organization Management

* Large Organization Management
* Small Organization Management
* Church Management
* Branch Management
* Subscription Management

---

## Member Management

* Member Registration
* Member Profiles
* Family Relationships
* Baptism Records
* Membership Status
* Visitor Management
* Member Transfers

---

## Leadership Management

* Pastors
* Elders
* Deacons
* Ministry Leaders
* Church Staff
* Volunteers

---

## Ministry Management

* Ministry Registration
* Ministry Leaders
* Ministry Members
* Ministry Events

---

## Attendance Management

* Service Attendance
* Ministry Attendance
* Visitor Attendance
* Attendance Reports

---

## Financial Management

* Tithes
* Offerings
* Donations
* Expenses
* Budget Management
* Financial Reports

---

## Events Management

* Church Events
* Conferences
* Crusades
* Seminars
* Meetings
* Calendar

---

## Communication

* Announcements
* Notifications
* Email Broadcasts
* SMS Integration (Future)
* Push Notifications

---

## Prayer Requests

* Prayer Request Submission
* Prayer Follow-up
* Confidential Prayer Requests

---

## Reports & Analytics

* Membership Reports
* Financial Reports
* Attendance Reports
* Growth Statistics
* Ministry Reports
* Organization Reports

---

## Documents

* Church Documents
* Policies
* Meeting Minutes
* Certificates
* File Storage

---

## Audit Logs

Track every important action performed within the platform for accountability and transparency.

---

# 🔐 Security Features

* JWT Authentication
* Invitation-based Registration
* Password Hashing (bcrypt)
* Role-Based Access Control (RBAC)
* Audit Logging
* HTTPS Support
* Input Validation
* Rate Limiting
* Secure Password Reset
* Approval Workflow for Sensitive Data

---

# 🔑 Permission Model

Financial and sensitive pastoral records remain under the ownership of the local church.

Higher organizational levels can only access such information after approval from the owning church.

This ensures:

* Privacy
* Accountability
* Data Ownership
* Compliance

---

# 🛠 Technology Stack

## Frontend

* React
* TypeScript
* Redux Toolkit
* React Router
* TanStack Query
* React Hook Form

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* PostgreSQL
* Drizzle ORM

## Authentication

* JWT
* bcrypt
* Invitation Tokens

## File Storage

* AWS S3 *(planned)*
* Cloudinary *(planned)*

---

# 🗄 Database Structure

Core entities include:

```text
users
large_organizations
organizations
churches
members
ministries
attendance
giving
expenses
events
visitors
prayer_requests
announcements
notifications
documents
audit_logs
invitations
subscriptions
```

Additional tables will be introduced as new modules are implemented.

---

# 💼 Business Model

VineChMS is offered as a Software-as-a-Service (SaaS) platform.

### Starter

Designed for small churches.

### Growth

Suitable for medium-sized churches and organizations.

### Enterprise

Ideal for large church organizations with multiple branches and advanced governance requirements.

---

# 🚧 Future Roadmap

* AI Church Assistant
* M-Pesa Integration
* Volunteer Management
* Payroll Management
* Asset Management
* Mobile Applications (Android & iOS)
* Multi-language Support
* Multi-country Support
* Online Giving
* Live Streaming Integration
* Digital Membership Cards
* QR Code Attendance
* Church Website Builder
* API Integrations

---

# 📂 Suggested Project Structure

```text
VineChMS/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── drizzle/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│
├── database/
│
├── .github/
│
├── README.md
│
└── LICENSE
```

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

Please ensure all code follows the project's coding standards and includes appropriate tests where applicable.

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Emmanuel Mose**

Bachelor of Science in Computer Science

---

## ⭐ Support the Project

If you find this project useful, please consider giving it a ⭐ on GitHub to support its development and help others discover it.
