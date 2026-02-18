# 🚀 Enterprise Ready SaaS Frontend

<p align="center">
  <a href="https://nextjs.org/" target="blank"><img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" width="120" alt="Next.js Logo" /></a>
</p>

<p align="center">
  A highly scalable, modern, and secure Frontend application built with <strong>Next.js 16</strong> and <strong>React 19</strong>.
  <br />
  Designed to seamlessly integrate with the Enterprise NestJS Authentication Backend, featuring <strong>JWT Management, React Query, shadcn/ui, and reCAPTCHA v3</strong>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query" />
</p>

---

## 🚀 Key Features

This frontend architecture is built for production, focusing on security, performance, and developer experience:

- **🔐 Seamless Authentication Integration:**
  - **Axios Interceptors:** Automatically injects JWT Bearer tokens from cookies into every request.
  - **Secure Token Management:** Utilizes `cookies-next` for robust access token handling.
  - **Ready for Refresh Tokens:** Interceptor structure pre-configured to handle 401 Unauthorized responses and silent token rotation.

- **✨ Modern & Accessible UI/UX:**
  - **shadcn/ui & Radix UI:** Highly customizable, accessible, and unstyled base components.
  - **Tailwind CSS:** Utility-first styling for rapid and responsive design.
  - **Dark/Light Mode:** Built-in theme switching capability powered by `next-themes`.
  - **Toast Notifications:** Elegant user feedback using `sonner`.

- **📝 Robust Form Handling:**
  - **React Hook Form:** Performant, flexible, and extensible forms with easy-to-use validation.
  - **Zod Integration:** Strict schema-based validation (`@hookform/resolvers`) ensuring clean data before it reaches the backend.

- **🛡️ Hardened Security (Frontend Context):**
  - **Google reCAPTCHA v3:** Invisible bot protection integrated seamlessly into auth forms to support the backend scoring system.

- **⚡ Efficient Data Fetching:**
  - **TanStack React Query:** Powerful asynchronous state management, caching, background updates, and optimistic rendering.

---

## 🛠️ Installation & Setup

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### 2. Clone the Repository
```bash
git clone [https://github.com/onur-aba/saas_frontend.git](https://github.com/onur-aba/saas_frontend.git)
cd saas_frontend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration (.env.local)
Create a `.env.local` file in the root directory. This allows the frontend to connect to the NestJS backend and third-party services. You can copy the example below:

```bash
# --- API CONFIGURATION ---
# The base URL of your NestJS Authentication Backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# --- GOOGLE RECAPTCHA v3 ---
# Get your Site Key from: [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
# (Make sure to use the SITE KEY here, the SECRET KEY goes to the backend)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=YOUR_GOOGLE_RECAPTCHA_SITE_KEY
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:3000` (or another port if 3000 is used by the backend).

### Production Build
To create an optimized production build:
```bash
npm run build
npm run start
```

## 📂 Key Project Structure Overview

- `src/app/`: Next.js App Router structure (e.g., `/(auth)/login`, `/(dashboard)`).
- `src/components/ui/`: Reusable UI components (buttons, inputs, forms) powered by shadcn/ui.
- `src/features/auth/`: Domain-specific logic, containing isolated auth components like `login-form.tsx` and `register-form.tsx`.
- `src/lib/axios.ts`: Pre-configured Axios instance with request/response interceptors for token management.
- `src/lib/utils.ts`: Helper functions (like Tailwind `cn` merger).

## 🤝 Contact & Feedback

> If you encounter any issues running the project, have suggestions for refactoring, or want to contribute to this open-source initiative:
> 
> 📧 **Email:** [onuraba34@gmail.com](mailto:onuraba34@gmail.com)
> 
> Developed by Onur Aba.