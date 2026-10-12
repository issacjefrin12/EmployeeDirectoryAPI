const express = require("express");
const app = express();
app.use(express.json());

let employees = [];
let nextId = 1;

// Test endpoint
app.get("/", (req, res) => {
    res.json({ message: "My API is working!" });
});

app.post("/api/employees", (req, res) => {
    const { name, designation, department, salary,experienceYears, isActive,employeeCode } = req.body;

    // Validate name
    if (typeof name !== "string" || name.trim().length < 3 || name.trim().length > 60) {
        return res.status(400).json({ error: "Invalid name" });
    }
    if (typeof designation !== "string" || designation.trim().length < 2 || designation.trim().length > 40) {
        return res.status(400).json({ error: "Invalid designation" });
    }
    if (typeof department !== "string" || department.trim().length < 2 || department.trim().length > 40) {
        return res.status(400).json({ error: "Invalid department" });
    }
    if (typeof salary !== "number" || salary <= 0 || salary > 100000) {
        return res.status(400).json({ error: "Invalid salary" });
    }
    if (typeof experienceYears !== "number" || experienceYears < 0 || experienceYears > 50) {
        return res.status(400).json({ error: "Invalid experience years" });
    }
    if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "Invalid isActive" });
    }
    if (typeof employeeCode !== "string" || employeeCode.trim().length < 5 || employeeCode.trim().length > 20) {
        return res.status(400).json({ error: "Invalid employee code" });
    }
    const employee = {
        id: nextId++,
        name: name.trim(),
        designation: designation.trim(),
        department: department.trim(),
        salary,
        experienceYears,
        isActive,
        employeeCode: employeeCode.trim()
    };
    employees.push(employee);
    res.status(201).json(employee);
});

app.get("/api/employees", (req, res) => {
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 10 : Number(req.query.limit);
    const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";
    const sort = req.query.sort || "id";
    const order = (req.query.order || "asc").toLowerCase();
    const sortableFields = ["id", "name", "designation", "department", "salary", "experienceYears", "isActive", "employeeCode"];

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
        return res.status(400).json({ error: "page and limit must be positive integers" });
    }
    if (!sortableFields.includes(sort)) {
        return res.status(400).json({ error: "Invalid sort field" });
    }
    if (order !== "asc" && order !== "desc") {
        return res.status(400).json({ error: "order must be 'asc' or 'desc'" });
    }

    const filteredEmployees = employees.filter(employee => {
        return !search || [employee.name, employee.designation, employee.department, employee.employeeCode]
            .some(value => value.toLowerCase().includes(search));
    });
    filteredEmployees.sort((first, second) => {
        const firstValue = first[sort];
        const secondValue = second[sort];
        const comparison = typeof firstValue === "string"
            ? firstValue.localeCompare(secondValue, undefined, { sensitivity: "base" })
            : Number(firstValue) - Number(secondValue);
        return order === "asc" ? comparison : -comparison;
    });

    const total = filteredEmployees.length;
    const start = (page - 1) * limit;
    res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        employees: filteredEmployees.slice(start, start + limit)
    });
});

app.get("/api/employees",(req,res) =>{})

app.get("/api/employees", (req, res) => {
    res.json(employees);
});
app.get("/api/employees/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
});

app.put("/api/employees/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
    }
    const { name, designation, department, salary, experienceYears, isActive, employeeCode } = req.body;

    // Validate name
    if (typeof name !== "string" || name.trim().length < 3 || name.trim().length > 60) {
        return res.status(400).json({ error: "Invalid name" });
    }
    if (typeof designation !== "string" || designation.trim().length < 2 || designation.trim().length > 40) {
        return res.status(400).json({ error: "Invalid designation" });
    }
    if (typeof department !== "string" || department.trim().length < 2 || department.trim().length > 40) {
        return res.status(400).json({ error: "Invalid department" });
    }
    if (typeof salary !== "number" || salary <= 0 || salary > 100000) {
        return res.status(400).json({ error: "Invalid salary" });
    }
    if (typeof experienceYears !== "integer" || experienceYears < 0 || experienceYears > 50) {
        return res.status(400).json({ error: "Invalid experience years" });
    }
    if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "Invalid isActive" });
    }
    if (typeof employeeCode !== "string" || employeeCode.trim().length < 5 || employeeCode.trim().length > 20) {
        return res.status(400).json({ error: "Invalid employee code" });
    }

    // Update employee
    employee.name = name.trim();
    employee.designation = designation.trim();
    employee.department = department.trim();
    employee.salary = salary;
    employee.experienceYears = experienceYears;
    employee.isActive = isActive;
    employee.employeeCode = employeeCode.trim();

    res.json(employee);
});

app.delete("/api/employees/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = employees.findIndex(emp => emp.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Employee not found" });
    }
    employees.splice(index, 1);
    res.json({ message: "Employee deleted successfully" });
});

app.patch("/api/employees/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const employee = employees.find(emp => emp.id === id);
    if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
    }
    const { name, designation, department, salary, experienceYears, isActive, employeeCode } = req.body;

    // Validate name
    if (typeof name !== "string" || name.trim().length < 3 || name.trim().length > 60) {
        return res.status(400).json({ error: "Invalid name" });
    }
    if (typeof designation !== "string" || designation.trim().length < 2 || designation.trim().length > 40) {
        return res.status(400).json({ error: "Invalid designation" });
    }
    if (typeof department !== "string" || department.trim().length < 2 || department.trim().length > 40) {
        return res.status(400).json({ error: "Invalid department" });
    }
    if (typeof salary !== "number" || salary <= 0 || salary > 100000) {
        return res.status(400).json({ error: "Invalid salary" });
    }
    if (typeof experienceYears !== "integer" || experienceYears < 0 || experienceYears > 50) {
        return res.status(400).json({ error: "Invalid experience years" });
    }
    if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "Invalid isActive" });
    }
    if (typeof employeeCode !== "string" || employeeCode.trim().length < 5 || employeeCode.trim().length > 20) {
        return res.status(400).json({ error: "Invalid employee code" });
    }

    // Update employee
    employee.name = name.trim();
    employee.designation = designation.trim();
    employee.department = department.trim();
    employee.salary = salary;
    employee.experienceYears = experienceYears;
    employee.isActive = isActive;
    employee.employeeCode = employeeCode.trim();

    res.json(employee);
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});