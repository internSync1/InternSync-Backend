const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URL;
if (!mongoUri) {
    console.error('Error: MONGODB_URL environment variable is not set');
    process.exit(1);
}
console.log('Connecting to MongoDB:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials

mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});

// Job Schema (matching your existing model)
const JobCompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    logoUrl: String,
    industry: String,
    aboutUs: String,
    gallery: [String],
    address: String,
    hours: String,
    phone: String,
    website: String,
}, { _id: false });

const JobDescriptionSchema = new mongoose.Schema({
    details: { type: String, required: true },
    requirements: String,
    stipend: {
        currency: { type: String, default: "USD" },
        amount: { type: Number, default: 0 },
    },
}, { _id: false });

const VisibilitySchema = new mongoose.Schema({
    displayInApp: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
}, { _id: false });

const jobSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4, required: true },
    title: { type: String, required: true },
    company: { type: JobCompanySchema, required: true },
    description: { type: JobDescriptionSchema, required: true },
    duration: String,
    location: String,
    labels: [String],
    startDate: Date,
    endDate: Date,
    applicationDeadline: Date,
    status: { type: String, default: 'OPEN' },
    jobType: String,
    weeklyHours: Number,
    isRemote: Boolean,
    visibility: { type: VisibilitySchema, required: true },
    // New fields for swipe functionality
    relevancyScore: { type: Number, default: 0 },
    tags: [String],
    categories: [String],
    skillsRequired: [String],
    sourceUrl: String,
    source: String,
    prize: String,
    bannerImageUrl: String,
    sourceType: String,
    applyMode: String,
    // Stable dedupe key (computed here for import convenience)
    importKey: { type: String, index: true, unique: false },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

function parseCSVField(field) {
    if (!field || field === '""' || field === '') return null;
    
    // Handle JSON arrays in CSV
    if (field.startsWith('[') && field.endsWith(']')) {
        try {
            return JSON.parse(field.replace(/"/g, '"'));
        } catch (e) {
            return [];
        }
    }
    
    // Remove extra quotes
    return field.replace(/^"|"$/g, '');
}

// Parse arrays that may be JSON (double-quoted) or python-like (single-quoted), or comma-separated strings
function parseFlexibleArray(field) {
    if (field == null) return [];
    let s = String(field).trim();
    // Strip outer quotes if present
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        s = s.slice(1, -1).trim();
    }
    if (s.startsWith('[') && s.endsWith(']')) {
        // Try strict JSON first
        try { return JSON.parse(s); } catch (_) {}
        // Replace single quotes with double quotes and try again
        try { return JSON.parse(s.replace(/'/g, '"')); } catch (_) {}
        // Fallback: split by commas and strip quotes/spaces
        const inner = s.slice(1, -1);
        return inner.split(',').map(x => x.replace(/^\s*["']?|["']?\s*$/g, '').trim()).filter(Boolean);
    }
    if (!s) return [];
    return s.split(',').map(x => x.replace(/^\s*["']?|["']?\s*$/g, '').trim()).filter(Boolean);
}

function parseSalary(salaryStr, amountStr, prizeStr) {
    let currency = 'USD';
    let amount = 0;
    
    if (salaryStr && salaryStr !== '""') {
        const match = salaryStr.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
        if (match) {
            amount = parseFloat(match[1].replace(/,/g, ''));
        }
    }
    
    if (amountStr && amountStr !== '""') {
        const match = amountStr.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
        if (match) {
            amount = parseFloat(match[1].replace(/,/g, ''));
        }
    }
    
    return { currency, amount };
}

// Normalize CSV 'type' to canonical set: internship | scholarship | extracurricular | activity
function normalizeType(raw) {
    const s = (parseCSVField(raw) || '').toString().trim().toLowerCase();
    if (!s) return 'internship';

    // Scholarships and similar funding opportunities
    const scholarshipWords = ['scholarship', 'scholar', 'bursary', 'grant', 'fellowship', 'award', 'financial aid', 'tuition'];
    if (scholarshipWords.some(w => s.includes(w))) return 'scholarship';

    // Internships
    if (s.includes('intern')) return 'internship';

    // Activities (we keep this internal type, but frontend may treat under "extracurricular")
    const activityWords = ['activity', 'activities', 'event', 'hackathon', 'competition', 'bootcamp', 'workshop', 'course', 'conference', 'meetup'];
    if (activityWords.some(w => s.includes(w))) return 'activity';

    // Extracurricular: volunteer and similar programs
    const extraWords = ['extracurricular', 'volunteer', 'volunteering'];
    if (extraWords.some(w => s.includes(w))) return 'extracurricular';

    // Fallback
    return 'internship';
}

function deriveCategories(normalizedType, existingCategories = [], tags = []) {
    const set = new Set(Array.isArray(existingCategories) ? existingCategories : []);
    const add = (v) => { if (v && String(v).trim() !== '') set.add(v); };
    if (normalizedType === 'internship') {
        add('Internship');
        add('Internships');
    } else if (normalizedType === 'scholarship') {
        add('Scholarship');
        add('Scholarships');
        add('Fellowship');
        add('Grant');
    } else if (normalizedType === 'activity') {
        add('Activity');
        add('Activities');
    } else if (normalizedType === 'extracurricular') {
        add('Extracurricular');
        add('Extracurriculars');
        add('Volunteer');
        add('Volunteering');
    }

    return Array.from(set);
}

// Pick first non-empty field value from a list of potential CSV headers
function pickFirst(row, keys) {
    for (const key of keys) {
        if (key in row) {
            const parsed = parseCSVField(row[key]);
            if (parsed && String(parsed).trim() !== '') return parsed;
        }
    }
    return null;
}

async function importJobs() {
    try {
        console.log('Starting job import from CSV...');
        
        // Do NOT delete existing CSV-sourced jobs; preserve IDs so bookmarks remain intact
        const jobs = [];
        
        fs.createReadStream('./opportunities_with_categories_v2.csv')
            .pipe(csv())
            .on('data', (row) => {
                try {
                    const stipend = parseSalary(row.salary, row.amount, row.prize);
                    const tags = parseFlexibleArray(row.tags);
                    const categoriesFromCsv = parseFlexibleArray(row.categories);
                    const requirements = parseFlexibleArray(row.requirements);
                    const normalizedType = normalizeType(row.type || row.category || row.categories);
                    // Use detailed categories from CSV directly (deduped)
                    const normalizedCategories = Array.from(new Set((categoriesFromCsv || []).map(s => String(s).trim()).filter(Boolean)));
                    
                    const job = {
                        _id: uuidv4(),
                        title: parseCSVField(row.title) || 'Untitled Position',
                        company: {
                            name: parseCSVField(row.organization) || 'Unknown Company',
                            website: parseCSVField(row.url),
                            logoUrl: pickFirst(row, ['logo', 'logo_url', 'logoUrl', 'company_logo']),
                            aboutUs: parseCSVField(row.description)?.substring(0, 500) || '',
                        },
                        description: {
                            details: parseCSVField(row.description) || 'No description available',
                            requirements: requirements.join(', ') || '',
                            stipend: stipend,
                        },
                        location: parseCSVField(row.location) || 'Remote',
                        // Populate skillsRequired with tags as a reasonable default from CSV
                        skillsRequired: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(s => s.trim()).filter(Boolean) : []),
                        labels: tags,
                        applicationDeadline: parseCSVField(row.deadline) ? new Date(parseCSVField(row.deadline)) : null,
                        status: 'OPEN',
                        jobType: normalizedType,
                        isRemote: parseCSVField(row.location)?.toLowerCase().includes('remote') || parseCSVField(row.location)?.toLowerCase().includes('virtual') || parseCSVField(row.location)?.toLowerCase().includes('anywhere'),
                        visibility: {
                            displayInApp: true,
                            featured: false,
                        },
                        // Swipe-specific fields
                        relevancyScore: parseInt(parseCSVField(row.relevancy_score)) || 0,
                        tags: tags,
                        categories: normalizedCategories,
                        sourceUrl: parseCSVField(row.url),
                        source: parseCSVField(row.source) || 'CSV Import',
                        prize: parseCSVField(row.prize),
                        bannerImageUrl: pickFirst(row, ['banner_image_url', 'image', 'image_url']),
                        sourceType: 'csv',
                        applyMode: 'external',
                    };
                    
                    jobs.push(job);
                } catch (error) {
                    console.error('Error parsing row:', error);
                }
            })
            .on('end', async () => {
                try {
                    console.log(`Parsed ${jobs.length} jobs from CSV`);
                    
                    // Build upsert operations with a stable key
                    const ops = jobs.map((j) => {
                        const keyBase = `${(j.title||'').toLowerCase().trim()}|${(j.company?.name||'').toLowerCase().trim()}|${(j.sourceUrl||'').toLowerCase().trim()}`;
                        const key = keyBase || j._id;
                        j.importKey = key;

                        // Fields to update every run (reflect latest CSV data)
                        const setFields = {
                            title: j.title,
                            company: j.company,
                            description: j.description,
                            duration: j.duration,
                            location: j.location,
                            skillsRequired: j.skillsRequired,
                            labels: j.labels,
                            startDate: j.startDate,
                            endDate: j.endDate,
                            applicationDeadline: j.applicationDeadline,
                            status: j.status,
                            jobType: j.jobType,
                            weeklyHours: j.weeklyHours,
                            isRemote: j.isRemote,
                            visibility: j.visibility,
                            relevancyScore: j.relevancyScore,
                            tags: j.tags,
                            categories: j.categories,
                            sourceUrl: j.sourceUrl,
                            source: j.source,
                            prize: j.prize,
                            bannerImageUrl: j.bannerImageUrl,
                            sourceType: j.sourceType,
                            applyMode: j.applyMode,
                            // Ensure existing docs also receive/import the key for future runs
                            importKey: key,
                        };

                        return {
                            updateOne: {
                                // Match by importKey when present, otherwise by composite identity
                                filter: { $or: [ { importKey: key }, { title: j.title, 'company.name': j.company?.name, sourceUrl: j.sourceUrl } ] },
                                update: { $set: setFields, $setOnInsert: { _id: j._id } },
                                upsert: true,
                            }
                        };
                    });

                    const batchSize = 500;
                    for (let i = 0; i < ops.length; i += batchSize) {
                        const batch = ops.slice(i, i + batchSize);
                        await Job.bulkWrite(batch, { ordered: false });
                        console.log(`Upserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(ops.length/batchSize)}`);
                    }
                    
                    console.log('Job import completed successfully!');
                    process.exit(0);
                } catch (error) {
                    console.error('Error inserting jobs:', error);
                    process.exit(1);
                }
            });
            
    } catch (error) {
        console.error('Error importing jobs:', error);
        process.exit(1);
    }
}

importJobs();
