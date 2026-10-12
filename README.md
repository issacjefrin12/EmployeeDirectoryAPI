# Employee Directory API

A RESTful API built with **Node.js** and **Express.js** for managing employee records. It supports creating, retrieving, updating, deleting, searching, sorting, and paginating employee data.

## Features

- Create a new employee
- Retrieve employees and individual employee records
- Update an employee record
- Delete an employee record
- Search by name, designation, department, or employee code
- Sort results by supported employee fields in ascending or descending order
- Paginate employee listings
- Validate incoming employee data
- Return JSON responses and appropriate HTTP status codes

## Tech Stack

- Node.js
- Express.js
- JavaScript
- JSON for request and response data
- Postman (optional, for API testing)

## Prerequisites

Install **Node.js** and npm. Check that they are available:

```bash
node --version
npm --version
```

## Getting Started

### 1. Create a project folder

```bash
mkdir employee-directory-api
cd employee-directory-api
```

Place your server code in a file named `server.js` in this folder.

### 2. Initialize the project

```bash
npm init -y
```

### 3. Install Express

```bash
npm install express
```

### 4. Start the server

```bash
node server.js
```

The server uses port `8080` by default. If the `PORT` environment variable is set, it uses that port instead.

```text
Server is running on port 8080
```

### 5. Check that the API is running

Send a `GET` request to:

```text
http://localhost:8080/
```

Expected response:

```json
{
  "message": "My API is working!"
}
```

## Base URL

```text
http://localhost:8080
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check that the API is running |
| POST | `/api/employees` | Create an employee |
| GET | `/api/employees` | List employees with pagination, search, and sorting |
| GET | `/api/employees/:id` | Retrieve one employee by ID |
| PUT | `/api/employees/:id` | Update an employee record |
| PATCH | `/api/employees/:id` | Update an employee record (currently requires all employee fields) |
| DELETE | `/api/employees/:id` | Delete an employee |

## Employee Data Format

Send employee data as JSON with these fields:

```json
{
  "name": "Alex Johnson",
  "designation": "Software Engineer",
  "department": "Engineering",
  "salary": 65000,
  "experienceYears": 3,
  "isActive": true,
  "employeeCode": "EMP001"
}
```

### Validation Rules

| Field | Validation |
|---|---|
| `name` | String, 3–60 characters |
| `designation` | String, 2–40 characters |
| `department` | String, 2–40 characters |
| `salary` | Number greater than 0 and no more than 100000 |
| `experienceYears` | Number from 0 to 50 |
| `isActive` | Boolean (`true` or `false`) |
| `employeeCode` | String, 5–20 characters |

Whitespace is trimmed from string fields before storing them. JSON numeric fields must be sent as numbers, not quoted strings.

## Request Examples

### Create an employee

**POST** `/api/employees`

Set the request header:

```text
Content-Type: application/json
```

Request body:

```json
{
  "name": "Alex Johnson",
  "designation": "Software Engineer",
  "department": "Engineering",
  "salary": 65000,
  "experienceYears": 3,
  "isActive": true,
  "employeeCode": "EMP001"
}
```

A successful request returns **201 Created** and the new employee, including its generated `id`.

### List employees

**GET** `/api/employees`

The listing endpoint supports these query parameters:

| Parameter | Default | Description |
|---|---|---|
| `page` | `1` | Page number; must be a positive integer |
| `limit` | `10` | Number of records per page; must be a positive integer |
| `search` | Empty | Case-insensitive search across name, designation, department, and employee code |
| `sort` | `id` | Field used to sort results |
| `order` | `asc` | Sort direction: `asc` or `desc` |

Supported sort fields: `id`, `name`, `designation`, `department`, `salary`, `experienceYears`, `isActive`, and `employeeCode`.

Example:

```text
GET /api/employees?page=1&limit=5&search=engineer&sort=name&order=asc
```

The listing response has this structure:

```json
{
  "page": 1,
  "limit": 5,
  "total": 1,
  "totalPages": 1,
  "employees": [
    {
      "id": 1,
      "name": "Alex Johnson",
      "designation": "Software Engineer",
      "department": "Engineering",
      "salary": 65000,
      "experienceYears": 3,
      "isActive": true,
      "employeeCode": "EMP001"
    }
  ]
}
```

The values above are an illustrative example.

### Get one employee

**GET** `/api/employees/1`

Replace `1` with the employee ID. If the ID does not exist, the API returns **404 Not Found**.

### Update an employee

**PUT** `/api/employees/1`

Send the complete employee object in the request body. The current implementation validates all fields before updating the record.

### Partially update an employee

**PATCH** `/api/employees/1`

The route currently validates and assigns every employee field, just like the `PUT` route. Therefore, send all required fields even when using `PATCH`.

### Delete an employee

**DELETE** `/api/employees/1`

A successful request returns:

```json
{
  "message": "Employee deleted successfully"
}
```

If the employee does not exist, the API returns **404 Not Found**.

## Common Responses

| Status code | Meaning |
|---|---|
| `200 OK` | Request succeeded |
| `201 Created` | Employee created successfully |
| `400 Bad Request` | Invalid input or query parameters |
| `404 Not Found` | Employee ID does not exist |

Validation errors return JSON, for example:

```json
{
  "error": "Invalid name"
}
```

The exact error message depends on the field or query parameter that failed validation.

## Testing with Postman

1. Start the server using `node server.js`.
2. Open Postman and create a request.
3. Use `http://localhost:8080` as the base URL.
4. Select the HTTP method and endpoint from the API Endpoints table.
5. For `POST`, `PUT`, and `PATCH`, select **Body → raw → JSON** and provide the employee JSON.
6. Send the request and inspect the HTTP status code and JSON response.
7. Create an employee before testing get, update, and delete operations.

## Project Structure

```text
employee-directory-api/
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Current Limitations

- **In-memory storage:** employee data is stored in a JavaScript array and is lost when the server restarts.
- **No database:** the current implementation does not use persistent database storage.
- **No authentication or authorization:** endpoints are not protected by user login or roles.
- **PATCH behavior:** the current PATCH endpoint requires all employee fields rather than accepting only changed fields.
- **Duplicate employee codes:** the current implementation does not enforce uniqueness for `employeeCode`.

## Future Improvements

- Add persistent storage with MySQL, PostgreSQL, or MongoDB.
- Add authentication and role-based authorization.
- Enforce unique employee codes.
- Implement true partial updates for PATCH.
- Add automated tests and centralized error handling.

## License

This project is intended for learning and development. Add a license if you plan to distribute it publicly.
