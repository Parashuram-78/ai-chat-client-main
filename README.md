# AI Chat Assistant Project

## Overview

This project is an AI-powered chat assistant that uses **Google Gemini** for generating responses. It features a secure email and password-based authentication system and a real-time, interactive chat interface. The application is divided into two repositories:

1. **Frontend:** Built with **TypeScript**, **Next.js**, **Tailwind CSS**, **Shadcn UI**, and **Zod** for schema validation.
2. **Backend:** Developed with **Node.js** and **Express**, utilizing **MongoDB** for data storage.

---

## Tech Stack

### Frontend:

-  **TypeScript**
-  **Next.js**
-  **Tailwind CSS**
-  **Shadcn UI**
-  **Zod** (Schema validation)

### Backend:

-  **Node.js**
-  **Express**

### Database:

-  **MongoDB**

### AI:

-  **Google Gemini**

---

## How to Run the Project

Follow these steps to run both the **frontend** and **backend**:

1. Ensure **Node.js** and **npm** are installed on your system.
   (If not installed, you can download it from here: [Download](https://nodejs.org/en/download))
2. Clone the repository from GitHub and navigate to the root of the project.
3. Install the required dependencies.

   ```bash
   # Clone the repository
   git clone <repo-url>

   # Navigate to the project folder
   cd <project-directory>

   # Install dependencies
   npm install

   # Run the development server
   npm run dev
   ```

## Features Implemented

1. Authentication

   -  A secure email and password-based authentication system implemented using **JSON Web Tokens (JWT)**.
   -  User sessions are managed securely with token-based authentication.

1. AI-Powered Chat Interface

   -  After logging in, users are redirected to a chat interface where they can interact with the AI assistant.
   -  Prompts sent from the chat interface are processed by the backend and relayed to **Google Gemini** for generating responses.

1. Real-Time Response Streaming

   -  The AI's responses are streamed back to the frontend client using **Server-Sent Events (SSE)** for a seamless, real-time experience.

1. Data Validation and Security

   -  **Frontend:** All incoming and outgoing data is validated to ensure type safety and prevent invalid input.
   -  **Backend:** Data validation is implemented to enforce strict rules, safeguarding against malicious input and ensuring data integrity.

1. Scalable and Modular Architecture

   -  The project is designed with scalability in mind, separating concerns into two repositories for easier maintenance and deployment.

1. Responsive UI

   -  The chat interface is built with **Tailwind CSS** and **Shadcn UI**, ensuring a sleek, responsive design for an optimal user experience across devices.
