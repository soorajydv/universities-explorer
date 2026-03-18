require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const University = require('./models/University');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/uni_explorer';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── GET /api/universities ─────────────────────────────────────────────────
// Query params:
//   page, limit
//   search         - full text search
//   country        - comma-separated list
//   sortBy         - field name
//   sortOrder      - asc | desc
//   minAcceptance, maxAcceptance  - % numbers
//   hasScholarship - true/false
//   intakeType     - Fall | Spring | Winter
//   level          - Masters | Bachelors | PhD
// ──────────────────────────────────────────────────────────────────────────
app.get('/api/universities', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      country = '',
      sortBy = 'priority',
      sortOrder = 'asc',
      hasScholarship,
      intakeType,
      level,
      minAcceptance,
      maxAcceptance,
    } = req.query;

    const filter = {};

    // Filter out universities without banner images
    filter.universityBannerImage = { $ne: null };

    // Full-text search
    if (search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Country filter (supports comma-separated multi-select)
    if (country.trim()) {
      const countries = country.split(',').map(c => c.trim()).filter(Boolean);
      if (countries.length === 1) {
        filter.country = { $regex: new RegExp(`^${countries[0]}$`, 'i') };
      } else if (countries.length > 1) {
        filter.country = { $in: countries.map(c => new RegExp(`^${c}$`, 'i')) };
      }
    }

    // Scholarship filter
    if (hasScholarship === 'true') {
      filter['scholarships.0'] = { $exists: true };
    }

    // Intake type filter
    if (intakeType) {
      filter['intakes.intake'] = { $regex: new RegExp(intakeType, 'i') };
    }

    // Course level filter
    if (level) {
      filter['topCourses.name'] = { $regex: new RegExp(level, 'i') };
    }

    // Acceptance rate range
    if (minAcceptance || maxAcceptance) {
      const acceptanceFilter = {};
      const parseRate = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? null : num;
      };
      const min = parseRate(minAcceptance);
      const max = parseRate(maxAcceptance);

      // We'll handle this via aggregation below
      filter._acceptanceFilter = { min, max };
    }

    // Build sort
    const sortObj = {};
    const validSortFields = ['priority', 'name', 'country', 'created_at', 'updated_at'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'priority';
    sortObj[safeSortBy] = sortOrder === 'desc' ? -1 : 1;

    // Add text score sort if searching
    if (search.trim()) {
      sortObj.score = { $meta: 'textScore' };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Remove internal filter flag
    const acceptanceFilter = filter._acceptanceFilter;
    delete filter._acceptanceFilter;

    // If acceptance rate filter, use aggregation
    let universities, total;
    if (acceptanceFilter) {
      const pipeline = [
        { $match: filter },
        {
          $addFields: {
            acceptanceNum: {
              $toDouble: {
                $replaceAll: {
                  input: { $ifNull: ['$overviewStats.acceptanceRate', '0'] },
                  find: '%', replacement: ''
                }
              }
            }
          }
        },
      ];

      const rateFilter = {};
      if (acceptanceFilter.min !== null) rateFilter.$gte = acceptanceFilter.min;
      if (acceptanceFilter.max !== null) rateFilter.$lte = acceptanceFilter.max;
      if (Object.keys(rateFilter).length) {
        pipeline.push({ $match: { acceptanceNum: rateFilter } });
      }

      const countPipeline = [...pipeline, { $count: 'total' }];
      const countResult = await University.aggregate(countPipeline);
      total = countResult[0]?.total || 0;

      pipeline.push({ $sort: sortObj }, { $skip: skip }, { $limit: limitNum });
      universities = await University.aggregate(pipeline);
    } else {
      const projection = search.trim() ? { score: { $meta: 'textScore' } } : {};
      [universities, total] = await Promise.all([
        University.find(filter, projection)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        University.countDocuments(filter),
      ]);
    }

    res.json({
      data: universities,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/universities/:slug ──────────────────────────────────────────
app.get('/api/universities/:slug', async (req, res) => {
  try {
    const uni = await University.findOne({ slug: req.params.slug }).lean();
    if (!uni) return res.status(404).json({ error: 'Not found' });
    res.json(uni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/filters/meta ────────────────────────────────────────────────
// Returns available filter options from actual DB data
app.get('/api/filters/meta', async (req, res) => {
  try {
    const [countries, intakes, levels] = await Promise.all([
      University.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1 } },
        { $project: { country: '$_id', count: 1, _id: 0 } },
      ]),
      University.aggregate([
        { $unwind: '$intakes' },
        { $group: { _id: '$intakes.intake' } },
        { $match: { _id: { $ne: null } } },
        { $sort: { _id: 1 } },
      ]),
      University.aggregate([
        { $unwind: '$topCourses' },
        { $group: { _id: '$topCourses.name' } },
        { $match: { _id: { $ne: null } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      countries: countries.map(c => ({ value: c.country, label: c.country, count: c.count })),
      intakes: intakes.map(i => i._id).filter(Boolean),
      levels: levels.map(l => l._id).filter(Boolean),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/stats ───────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [total, countriesCount] = await Promise.all([
      University.countDocuments(),
      University.distinct('country').then(c => c.filter(Boolean).length),
    ]);
    res.json({ total, countries: countriesCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
