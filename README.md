VineChMS – Church Governance & Management Platform
Project Documentation
Version: 2.0

Executive Summary
VineChMS is a multi-tenant SaaS platform for managing local churches, church organizations, and large governing organizations through a hierarchical architecture. It provides secure administration, member engagement, finance, attendance, events, reporting, and governance.
Hierarchy
Large Organization → Small Organization → Local Church → Church Members.
Dashboards
1. Large Organization Admin
2. Large Organization Member
3. Small Organization Admin
4. Small Organization Member
5. Local Church Admin
6. Local Church Member
Registration Flow
Large Organization Admin creates Small Organizations by inviting their administrators. Small Organization Admin creates Churches by inviting Church Administrators. Church Administrators invite church members. Users register only through invited email addresses and are redirected to the correct dashboard after login.
Technology Stack
Frontend: React, TypeScript, Redux Toolkit, React Router, TanStack Query, React Hook Form.
Backend: Node.js, Express.js, TypeScript.
Database: PostgreSQL with Drizzle ORM.
Authentication: JWT, bcrypt, invitation tokens.
Storage: Cloud storage (AWS S3/Cloudinary).
Core Modules
Organization Management, Church Management, Member Management, Leadership, Attendance, Finance, Events, Communication, Prayer Requests, Reports, Notifications, Documents, Audit Logs.
Security
Role-Based Access Control, JWT authentication, bcrypt password hashing, audit logs, HTTPS, validation, rate limiting, invitation-based onboarding, approval workflow for sensitive data.
Permissions
Financial and pastoral records require approval from the owning church before higher levels can access them.
Recommended Database
Core entities: users, large_organizations, organizations, churches, members, ministries, attendance, giving, expenses, events, visitors, prayer_requests, announcements, notifications, documents, audit_logs, invitations, subscriptions.
Business Model
Subscription-based SaaS with Starter, Growth and Enterprise plans supporting churches of different sizes.
Future Modules
AI Assistant, M-Pesa integration, Volunteer Management, Payroll, Asset Management, Mobile Apps, Multi-language, Multi-country support.
