# AI Cover Letter Generator

## Overview

AI Cover Letter Generator is a full-stack web application that helps users create professional and customized cover letters for job applications.  
The system collects user details such as name, role, and company and generates a structured cover letter using the Gemini API.

The goal of this project is to demonstrate practical implementation of AI in web applications using React and Node.js.

---

## Features

- Generate professional cover letters
- Simple and clean user interface
- Fast response using Gemini API
- React frontend
- Node.js Express backend
- REST API integration
- Easy to run locally

---

## Tech Stack

Frontend:
- React
- Vite
- Axios

Backend:
- Node.js
- Express
- Gemini API
- dotenv
- cors

---

## Project Structure


ai-cover-letter-generator

client/
src/
components/
api/

server/
index.js
.env

README.md
Prompts.md


---

## Installation

### Step 1: Clone or Download Project

Extract the project folder.

---

### Step 2: Run Backend


cd server
npm install


Create `.env`


GEMINI_API_KEY= ***


Run server


node index.js


Server runs on


http://localhost:5000


---

### Step 3: Run Frontend


cd client
npm install
npm run dev


Open browser


http://localhost:5173


---

## How It Works

1. User enters name, role, and company
2. Frontend sends data to backend
3. Backend sends prompt to Gemini API
4. AI generates cover letter
5. Response is shown on screen

---

## API Endpoint

### POST /generate

Request


{
name,
role,
company
}


Response


{
letter
}


---

## Future Improvements

- Resume upload
- Job description input
- PDF download
- Cover letter templates
- Authentication
- Save history
- Multiple AI models

---

## Author
Naman Harjai

Project developed for academic and learning purposes.
