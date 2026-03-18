const mongoose = require('mongoose');

async function analyzeDBFields() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/uni_explorer';
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('universities');
    
    // Get sample of universities
    const universities = await collection.find({}).limit(100).toArray();
    console.log(`\n✅ Successfully fetched ${universities.length} universities from database`);
    
    // Analyze field names across all universities
    const allFields = new Set();
    const fieldCounts = {};
    const inconsistentFields = [];
    
    universities.forEach((uni, index) => {
      const keys = Object.keys(uni);
      keys.forEach(key => {
        allFields.add(key);
        fieldCounts[key] = (fieldCounts[key] || 0) + 1;
      });
      
      // Check for specific fields that might have inconsistencies
      if (index === 0) {
        console.log('\n🔍 Analyzing first university structure:');
        console.log('Keys:', keys.sort());
      }
    });
    
    console.log('\n📊 Field Analysis:');
    console.log('================');
    
    // Sort fields by frequency
    const sortedFields = Object.entries(fieldCounts).sort((a, b) => b[1] - a[1]);
    
    sortedFields.forEach(([field, count]) => {
      const percentage = ((count / universities.length) * 100).toFixed(1);
      console.log(`${field.padEnd(25)}: ${count}/${universities.length} (${percentage}%)`);
      
      // Flag potentially inconsistent fields
      if (count < universities.length) {
        inconsistentFields.push(field);
      }
    });
    
    console.log('\n⚠️  Fields with inconsistencies (not present in all universities):');
    console.log('================================================================');
    inconsistentFields.forEach(field => {
      const percentage = ((fieldCounts[field] / universities.length) * 100).toFixed(1);
      console.log(`- ${field}: ${fieldCounts[field]}/${universities.length} (${percentage}%)`);
    });
    
    // Analyze nested objects
    console.log('\n🔍 Analyzing nested object structures:');
    console.log('=====================================');
    
    // Check overviewStats structure
    const overviewStatsFields = new Set();
    universities.forEach(uni => {
      if (uni.overviewStats) {
        Object.keys(uni.overviewStats).forEach(key => overviewStatsFields.add(key));
      }
    });
    console.log('overviewStats fields:', Array.from(overviewStatsFields));
    
    // Check universityLogo structure
    const logoFields = new Set();
    universities.forEach(uni => {
      if (uni.universityLogo) {
        Object.keys(uni.universityLogo).forEach(key => logoFields.add(key));
      }
    });
    console.log('universityLogo fields:', Array.from(logoFields));
    
    // Check image structure
    const imageFields = new Set();
    universities.forEach(uni => {
      if (uni.image) {
        Object.keys(uni.image).forEach(key => imageFields.add(key));
      }
    });
    console.log('image fields:', Array.from(imageFields));
    
    // Check topCourses structure
    const topCoursesFields = new Set();
    universities.forEach(uni => {
      if (uni.topCourses) {
        uni.topCourses.forEach(course => {
          if (course) {
            Object.keys(course).forEach(key => topCoursesFields.add(key));
          }
        });
      }
    });
    console.log('topCourses fields:', Array.from(topCoursesFields));
    
    // Check scholarships structure
    const scholarshipsFields = new Set();
    universities.forEach(uni => {
      if (uni.scholarships) {
        uni.scholarships.forEach(scholarship => {
          if (scholarship) {
            Object.keys(scholarship).forEach(key => scholarshipsFields.add(key));
          }
        });
      }
    });
    console.log('scholarships fields:', Array.from(scholarshipsFields));
    
    console.log('\n✅ Analysis complete!');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error analyzing data:', error.message);
  }
}

analyzeDBFields();