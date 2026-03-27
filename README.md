# InvestgoV1.001 — Secured Storage Facility Platform

> A premium secured storage vault management platform for precious assets (gold, diamonds, platinum, etc.)

## Features

- 🔐 Three-tier role system (Super Admin, Platform Admin, User)
- 📊 Real-time gold price ticker with multi-currency support
- 💎 Asset portfolio management with charts
- �� Withdrawal request workflow
- 🎫 Support ticket system
- 📈 Reports and analytics
- 🔑 OTP-based two-factor authentication
- ��️ Investment backdating for superadmin

## Roles

| Role | Access |
|------|--------|
| Super Admin | Full platform control, add investments with backdating, user management, settings |
| Platform Admin | Approve withdrawals, manage support tickets, read-only platform view |
| User | View portfolio, request withdrawals, submit support tickets |

## Demo Credentials

| Role | Email | Password | OTP |
|------|-------|----------|-----|
| Super Admin | superadmin@vaultsecure.co.za | Super@1234 | 123456 |
| Platform Admin | admin@vaultsecure.co.za | Admin@1234 | 123456 |
| User | user@vaultsecure.co.za | User@1234 | 123456 |

## Tech Stack

React 19, TypeScript, Vite 8, Tailwind CSS, React Router 7, Recharts, React Hook Form, Lucide Icons

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
