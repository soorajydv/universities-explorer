require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const University = require('./models/University');

const BASE_URL = 'https://cms.studies-overseas.com/universities';
const BATCH_SIZE = 100;

function transformUniversity(raw) {
  const overviewCards = raw.overviewSection?.overviewCard || [];
  const findCard = (sub) => overviewCards.find(c =>
    c.subTitle?.toLowerCase().includes(sub.toLowerCase())
  )?.title || null;

  // Generate unique slug if original is null or empty
  let slug = raw.slug;
  if (!slug || slug.trim() === '') {
    // Create slug from university name with random suffix
    const baseSlug = raw.universityName 
      ? raw.universityName.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : `university-${raw.id}`;
    
    // Add random suffix to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    slug = `${baseSlug}-${randomSuffix}`;
  }

  return {
    originalId: raw.id,
    country: raw.country,
    name: raw.name,
    universityName: raw.universityName,
    extraDetail: raw.extraDetail,
    slug: slug,
    location: raw.location,
    locale: raw.locale,
    priority: raw.priority,
    universityUrl: raw.universityUrl,
    universityBannerImage: raw.universityBannerImage,

    image: raw.image ? {
      imageUrl: raw.image.imageUrl,
      alt: raw.image.alt,
    } : null,

    universityLogo: raw.universityLogo ? {
      imageUrl: raw.universityLogo.imageUrl,
      alt: raw.universityLogo.alt,
      imageAltTag: raw.universityLogo.imageAltTag,
    } : null,

    overviewStats: {
      acceptanceRate: findCard('acceptance'),
      totalInternationalStudents: findCard('international'),
      studentFacultyRatio: findCard('faculty'),
      placementRate: findCard('placement'),
    },

    rankings: (raw.rankingSection?.rankingCard || []).map(r => ({
      title: r.title,
      subTitle: r.subTitle,
    })),

    topCourses: (raw.topCourseDetail || []).map(cat => ({
      name: cat.name,
      cardDetail: (cat.cardDetail || []).map(c => ({
        courseName: c.courseName,
        title1: c.title1,
        subTitle1: c.subTitle1,
        title2: c.title2,
        subTitle2: c.subTitle2,
      })),
    })),

    costToStudy: (raw.costToStudySection?.costToStudy || []).map(c => ({
      expenseType: c.expenseType,
      annualExpenses: c.annualExpenses,
    })),

    intakes: (raw.intakeSection?.intakeDetail || []).map(i => ({
      intake: i.intake,
      description: i.description,
    })),

    scholarships: (raw.scholarshipsAvailable?.scholarshipsCard || []).map(s => ({
      name: s.name,
      detail: s.detail || [],
    })),

    admissionRequirements: (raw.admissionRequirementDetail || []).map(level => ({
      level: level.name,
      requirements: (level.requirementCard || []).map(r => ({
        title: r.title,
        cardDetails: r.cardDetails,
      })),
    })),

    placement: {
      description: raw.universityPlacementSection?.description || null,
      averageSalary: (raw.universityPlacementSection?.averageSalary || []).map(s => ({
        expenceType: s.expenceType,
        totalSalary: s.totalSalary,
      })),
    },

    metaTitle: raw.meta?.metaTitle || null,
    metaDescription: raw.meta?.metaDescription || null,

    published_at: raw.published_at ? new Date(raw.published_at) : null,
    created_at: raw.created_at ? new Date(raw.created_at) : null,
    updated_at: raw.updated_at ? new Date(raw.updated_at) : null,
  };
}

async function fetchBatch(start, limit) {
  const url = `${BASE_URL}?_sort=priority:ASC,created_at:asc&_start=${start}&_limit=${limit}`;
  const res = await axios.get(url, { timeout: 30000 });
  return res.data;
}

async function scrapeAll() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/uni_explorer';
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  let start = 0;
  let totalSaved = 0;
  let totalFetched = 0;

  console.log('🚀 Starting scrape...\n');

  while (true) {
    try {
      console.log(`📡 Fetching batch: start=${start}, limit=${BATCH_SIZE}`);
      const batch = await fetchBatch(start, BATCH_SIZE);

      if (!batch || batch.length === 0) {
        console.log('✅ No more data. Scraping complete!');
        break;
      }

      totalFetched += batch.length;

      for (const raw of batch) {
        try {
          const data = transformUniversity(raw);
          
          // Check for slug conflicts and make unique
          let finalSlug = data.slug;
          let counter = 1;
          let originalSlug = finalSlug;
          
          // Check if slug already exists (excluding current university by originalId)
          let existing = await University.findOne({ 
            slug: finalSlug, 
            originalId: { $ne: data.originalId } 
          });
          
          while (existing) {
            finalSlug = `${originalSlug}-${counter}`;
            existing = await University.findOne({ 
              slug: finalSlug, 
              originalId: { $ne: data.originalId } 
            });
            counter++;
          }
          
          data.slug = finalSlug;

          await University.findOneAndUpdate(
            { originalId: data.originalId },
            { $set: data },
            { upsert: true, new: true }
          );
          totalSaved++;
          process.stdout.write(`\r💾 Saved: ${totalSaved} | Fetched: ${totalFetched}`);
        } catch (err) {
          console.error(`\n⚠️  Error saving ID ${raw.id}:`, err.message);
        }
      }

      if (batch.length < BATCH_SIZE) {
        console.log('\n✅ Last batch received. Done!');
        break;
      }

      start += BATCH_SIZE;
      // Small delay to be nice to the server
      await new Promise(r => setTimeout(r, 300));

    } catch (err) {
      console.error(`\n❌ Fetch error at start=${start}:`, err.message);
      console.log('Retrying in 2s...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n\n🎉 Scraping complete!`);
  console.log(`   Total fetched: ${totalFetched}`);
  console.log(`   Total saved:   ${totalSaved}`);

  // Print country breakdown
  const countries = await University.aggregate([
    { $group: { _id: '$country', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  console.log('\n📊 Country breakdown:');
  countries.forEach(c => console.log(`   ${c._id || 'Unknown'}: ${c.count}`));

  await mongoose.disconnect();
  console.log('\n✅ Done!');
}

scrapeAll().catch(console.error);
