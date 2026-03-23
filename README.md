<div align="center">

<img src="frontend/public/sparkles.svg" width="100" alt="ProjectHub Logo"/>

# ProjectHub

*Discover, Share, and Showcase High-End Technical Builds*

</div>

A premium, modern full-stack web application designed for developers to showcase their open-source experiments, personal projects, and technical builds. ProjectHub features an immersive UI with 3D interactive elements, smooth animations, and a powerful MERN stack backend.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Reference](#api-reference)
- [License](#license)
- [Contact](#contact)

---

## Overview

ProjectHub is a sophisticated platform engineered for the modern developer. It moves beyond standard portfolio sites by providing a community-driven "Engineering Command Center" where users can explore cutting-edge web apps, AI/ML tools, mobile applications, and more. 

### Why ProjectHub?

- **Premium UI/UX:** A highly polished "Bento-Box" design language, complete with a custom spring-physics cursor and immersive 3D background elements.
- **React & Vite Integration**: Extremely fast frontend development with Hot Module Replacement (HMR).
- **Secure Authentication**: Role-based access control and JWT-based user sessions.
- **Robust Data Management**: Full CRUD operations for developer projects and user profiles.
- **Interactive 3D**: Powered by `react-three-fiber` and `framer-motion-3d` for an engaging, dynamic user experience.

---

## Features

- **Immersive Explore View:**  
  Browse projects through an interactive 3D hero section with real-time filtering, search capabilities, and technology tags.

- **Developer Workstation (Portfolio):**  
  A dedicated bento-grid dashboard where users can view their total impact, commits, and manage their deployed projects.

- **User Profiles:**  
  Update your developer alias and email address directly from your workstation.

- **Project Management:**  
  Deploy (create), reconfigure (edit), and delete your projects. Track github repositories, live URLs, development cycles, and architectural roadmaps.

- **Custom Physics Cursor:**  
  A dynamic, custom-built cursor that interacts seamlessly with clickable UI elements.

- **Secure Authentication:**  
  Secure registration and login endpoints utilizing bcrypt and jsonwebtoken.

---

## Architecture

ProjectHub utilizes a decoupled client-server architecture:

- **Client:** React 19 application built with Vite. Handles state management, 3D rendering (`three.js`), and complex animations (`framer-motion`).
- **Server:** Node.js/Express.js REST API. Responsible for validation, business logic, authentication, and database interaction.
- **Database:** MongoDB for flexible, document-based storage of users and projects.

---

## Tech Stack

- **Frontend**
  - [React.js](https://react.dev/) — Core UI library.
  - [Vite](https://vitejs.dev/) — Build tool and dev server.
  - [Framer Motion](https://www.framer.com/motion/) — Declarative animation library.
  - [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) & [Drei](https://github.com/pmndrs/drei) — 3D rendering and interactive canvas.
  - [Lucide React](https://lucide.dev/) — Beautiful, consistent iconography.

- **Backend**
  - [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) — API framework.
  - [Mongoose](https://mongoosejs.com/) — MongoDB object modeling.
  - [bcrypt](https://www.npmjs.com/package/bcrypt) & [JWT](https://www.npmjs.com/package/jsonwebtoken) — Security and auth.

- **Database**
  - [MongoDB](https://www.mongodb.com/) — NoSQL Database.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ProjectHub.git
   cd ProjectHub
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `/backend` directory:
   ```env
   PORT=3000
   MONGO_DB_USERNAME=your_username
   MONGO_DB_PASSWD=your_password
   MONGO_DB_ENDPOINT=your_cluster_url
   MONGO_DB_DATABASE=projecthub
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRY=24h
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `/frontend` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Run the Application**
   - Start the backend API:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend client:
     ```bash
     cd frontend
     npm run dev
     ```

---

## API Reference

### Auth
- `POST /auth/signup` - Register a new developer.
- `POST /auth/login` - Authenticate and receive a JWT.

### User
- `GET /user/:id` - Fetch user profile.
- `PUT /user/:id` - Update user profile (username, email).

### Projects (Recipes)
- `GET /recipes/` - Fetch all public projects.
- `GET /recipes/search?q=term` - Search projects by tech stack or name.
- `GET /recipes/my` - Fetch projects owned by the authenticated user.
- `POST /recipes/` - Deploy a new project.
- `PATCH /recipes/:id` - Update an existing project.
- `DELETE /recipes/:id` - Remove a project from the hub.

*(Note: API routes use the legacy `/recipes` paths internally but map to "Projects" on the UI layer).*

---

## License

This project is licensed under the MIT License.

```text
MIT License

Copyright (c) 2026 ProjectHub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## Contact

For collaboration or inquiries:
- Create an Issue or Pull Request on the repository.