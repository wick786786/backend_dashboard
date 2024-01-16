const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 5000; // Set your desired port
app.use(cors());
const pool = new Pool({
    user: 'satyamyadav',
    host: 'localhost',
    database: 'program',
    password: 'satu@786786',
    port: 5432,
});

app.use(bodyParser.json());

// Routes for CRUD operations
app.get('/programs', getAllPrograms);
app.get('/programs/:id', getProgramById);
app.post('/programs', createProgram);
app.put('/programs/:id', updateProgram);
app.delete('/programs/:id', deleteProgram);

// Functions for CRUD operations
async function getAllPrograms(req, res) {
    const { rows } = await pool.query('SELECT * FROM programs');
    res.json(rows);
}

async function getProgramById(req, res) {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM programs WHERE id = $1', [id]);

    if (rows.length > 0) {
        res.json(rows[0]);
    } else {
        res.status(404).json({ error: 'Program not found' });
    }
}

async function createProgram(req, res) {
    const program = req.body;
    const { rows } = await pool.query(
        'INSERT INTO programs (name, price, domain, program_type, registrations_status, description, placement_assurance, image_url, university_name, faculty_profile_url, learning_hours, duration, certificate_diploma, eligibility_criteria) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
        [
            program.name,
            program.price,
            program.domain,
            program.program_type,
            program.registrations_status,
            program.description,
            program.placement_assurance,
            program.image_url,
            program.university_name,
            program.faculty_profile_url,
            program.learning_hours,
            program.duration,
            program.certificate_diploma,
            program.eligibility_criteria,
        ]
    );

    res.status(201).json(rows[0]);
}

async function updateProgram(req, res) {
    const { id } = req.params;
    const program = req.body;
    const { rows } = await pool.query(
        'UPDATE programs SET name=$1, price=$2, domain=$3, program_type=$4, registrations_status=$5, description=$6, placement_assurance=$7, image_url=$8, university_name=$9, faculty_profile_url=$10, learning_hours=$11, duration=$12, certificate_diploma=$13, eligibility_criteria=$14 WHERE id=$15 RETURNING *',
        [
            program.name,
            program.price,
            program.domain,
            program.program_type,
            program.registrations_status,
            program.description,
            program.placement_assurance,
            program.image_url,
            program.university_name,
            program.faculty_profile_url,
            program.learning_hours,
            program.duration,
            program.certificate_diploma,
            program.eligibility_criteria,
            id,
        ]
    );

    if (rows.length > 0) {
        res.json(rows[0]);
    } else {
        res.status(404).json({ error: 'Program not found' });
    }
}

async function deleteProgram(req, res) {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM programs WHERE id = $1 RETURNING *', [id]);

    if (rows.length > 0) {
        res.json({ message: 'Program deleted successfully' });
    } else {
        res.status(404).json({ error: 'Program not found' });
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
