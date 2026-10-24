# Vehicle Service Management System

A beginner-friendly college project built with HTML, CSS, JavaScript, Node.js, Express, and MySQL.

## Features

- Add a vehicle service booking
- View all bookings
- Dashboard totals for Pending, In Progress, and Completed
- Update a booking's status
- Delete a booking
- Store bookings persistently in MySQL

## Requirements

- Node.js LTS
- MySQL Server (MySQL Workbench is optional)
- Visual Studio Code

## Setup on Windows

### 1. Extract and open the project

Extract the ZIP file. In VS Code, select **File → Open Folder** and choose the extracted `vehicle-service-management` folder.

### 2. Install dependencies

Open **Terminal → New Terminal** in VS Code and run:

```bash
npm install
```

### 3. Create the database

1. Open MySQL Workbench and connect to your local MySQL server.
2. Open `database.sql` from this project.
3. Execute the full script using the lightning-bolt button.

This creates the `vehicle_service_db` database and the `bookings` table.

### 4. Set your MySQL password

In the project root, make a copy of `.env.example` and rename the copy to `.env`.

Edit `.env` and replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=vehicle_service_db
PORT=3000
```

Do not share your `.env` file or upload it to a public repository. The `.gitignore` file excludes it.

### 5. Start the application

Ensure MySQL Server is running. In the VS Code terminal, run:

```bash
npm start
```

If successful, the terminal displays a message that MySQL connected and the server is running.

### 6. Open the website

Visit:

http://localhost:3000

Do not open `public/index.html` directly from File Explorer. The page needs to be served by Node.js to use the API.

## Check saved data

In MySQL Workbench, run:

```sql
USE vehicle_service_db;
SELECT * FROM bookings;
```

## Troubleshooting

- **Access denied:** Check `DB_USER` and `DB_PASSWORD` in `.env`.
- **Unknown database:** Execute `database.sql`.
- **ECONNREFUSED:** Make sure MySQL Server is running.
- **Cannot find module:** Run `npm install` in the project root.
- **Port is busy:** Set `PORT=3001` in `.env`, restart the server, and open http://localhost:3001.

## Project structure

```text
vehicle-service-management/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env.example
├── .gitignore
├── database.sql
├── package.json
├── README.md
└── server.js
```

## Notes

This is an educational starter project. It does not include authentication, payment processing, mechanic assignment, or production security hardening.
