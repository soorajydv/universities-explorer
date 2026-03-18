const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: String,
  cardDetail: [{
    courseName: String,
    title1: String,
    subTitle1: String,
    title2: String,
    subTitle2: String,
  }]
}, { _id: false });

const UniversitySchema = new mongoose.Schema({
  originalId: { type: Number, index: true },
  country: { type: String, index: true },
  name: { type: String, index: true },
  universityName: String,
  extraDetail: String,
  slug: { type: String, unique: true, sparse: true },
  location: String,
  locale: String,
  priority: { type: Number, index: true },
  universityUrl: String,
  universityBannerImage: String,

  // Image data
  image: {
    imageUrl: String,
    alt: String,
  },
  universityLogo: {
    imageUrl: String,
    alt: String,
    imageAltTag: String,
  },

  // Overview stats
  overviewStats: {
    acceptanceRate: String,
    totalInternationalStudents: String,
    studentFacultyRatio: String,
    placementRate: String,
  },

  // Rankings
  rankings: [{
    title: String,
    subTitle: String,
  }],

  // Top courses (flattened)
  topCourses: [CourseSchema],

  // Cost data
  costToStudy: [{
    expenseType: String,
    annualExpenses: String,
  }],

  // Intakes
  intakes: [{
    intake: String,
    description: String,
  }],

  // Scholarships
  scholarships: [{
    name: String,
    detail: [String],
  }],

  // Admission requirements
  admissionRequirements: [{
    level: String,
    requirements: [{
      title: String,
      cardDetails: String,
    }]
  }],

  // Placement info
  placement: {
    description: String,
    averageSalary: [{
      expenceType: String,
      totalSalary: String,
    }],
  },

  // Meta
  metaTitle: String,
  metaDescription: String,

  published_at: Date,
  created_at: Date,
  updated_at: Date,

  // Scraped timestamp
  scrapedAt: { type: Date, default: Date.now },
}, {
  timestamps: false,
});

// Text index for full-text search
UniversitySchema.index({
  name: 'text',
  universityName: 'text',
  location: 'text',
  country: 'text',
  metaDescription: 'text',
});

module.exports = mongoose.model('University', UniversitySchema);
