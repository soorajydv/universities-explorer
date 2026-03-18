const axios = require('axios');

async function analyzeAPIFields() {
  try {
    console.log('Fetching API data...');
    const response = await axios.get('https://cms.studies-overseas.com/universities?_sort=priority:ASC,created_at:asc&_start=0&_limit=500');
    const universities = response.data;
    
    console.log(`\n✅ Successfully fetched ${universities.length} universities`);
    
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
    
    // Check overviewSection structure
    const overviewFields = new Set();
    universities.forEach(uni => {
      if (uni.overviewSection) {
        Object.keys(uni.overviewSection).forEach(key => overviewFields.add(key));
      }
    });
    console.log('overviewSection fields:', Array.from(overviewFields));
    
    // Check overviewCard structure
    const overviewCardFields = new Set();
    universities.forEach(uni => {
      if (uni.overviewSection?.overviewCard) {
        uni.overviewSection.overviewCard.forEach(card => {
          if (card) {
            Object.keys(card).forEach(key => overviewCardFields.add(key));
          }
        });
      }
    });
    console.log('overviewCard fields:', Array.from(overviewCardFields));
    
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
    
    // Check topCourseDetail structure
    const topCourseFields = new Set();
    universities.forEach(uni => {
      if (uni.topCourseDetail) {
        uni.topCourseDetail.forEach(course => {
          if (course) {
            Object.keys(course).forEach(key => topCourseFields.add(key));
          }
        });
      }
    });
    console.log('topCourseDetail fields:', Array.from(topCourseFields));
    
    console.log('\n✅ Analysis complete!');
    
  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
  }
}

analyzeAPIFields();