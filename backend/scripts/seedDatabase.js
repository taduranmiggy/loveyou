const { User, Pill, PillIntake, Cycle, CycleDay } = require('../models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.bulkCreate([
      {
        email: 'alice@example.com',
        password: hashedPassword,
        firstName: 'Alice',
        lastName: 'Johnson',
        dateOfBirth: '1995-03-15',
        isEmailVerified: true,
        preferences: {
          notifications: {
            pillReminders: true,
            cycleUpdates: true,
            healthInsights: true
          },
          privacy: {
            shareData: false,
            publicProfile: false
          },
          ui: {
            theme: 'pink',
            animations: true
          }
        }
      },
      {
        email: 'emma@example.com',
        password: hashedPassword,
        firstName: 'Emma',
        lastName: 'Davis',
        dateOfBirth: '1992-07-22',
        isEmailVerified: true,
        preferences: {
          notifications: {
            pillReminders: true,
            cycleUpdates: false,
            healthInsights: true
          },
          privacy: {
            shareData: false,
            publicProfile: true
          },
          ui: {
            theme: 'rose',
            animations: false
          }
        }
      },
      {
        email: 'sophia@example.com',
        password: hashedPassword,
        firstName: 'Sophia',
        lastName: 'Martinez',
        dateOfBirth: '1998-11-08',
        isEmailVerified: false,
        preferences: {
          notifications: {
            pillReminders: true,
            cycleUpdates: true,
            healthInsights: false
          },
          privacy: {
            shareData: true,
            publicProfile: false
          },
          ui: {
            theme: 'purple',
            animations: true
          }
        }
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create sample pills
    const pills = await Pill.bulkCreate([
      {
        userId: users[0].id,
        name: 'Yasmin',
        brand: 'Bayer',
        type: 'combination',
        dosage: '3mg/0.03mg',
        color: 'Yellow',
        shape: 'Round',
        reminderTimes: ['08:00'],
        instructions: 'Take one tablet daily at the same time',
        prescribedBy: 'Dr. Smith',
        prescriptionDate: '2024-01-15',
        expiryDate: '2025-01-15',
        isActive: true,
        notes: 'Take with food to reduce nausea'
      },
      {
        userId: users[1].id,
        name: 'Loestrin Fe',
        brand: 'Allergan',
        type: 'combination',
        dosage: '1mg/20mcg',
        color: 'White',
        shape: 'Round',
        reminderTimes: ['21:00'],
        instructions: 'Take one tablet daily',
        prescribedBy: 'Dr. Johnson',
        prescriptionDate: '2024-02-01',
        expiryDate: '2025-02-01',
        isActive: true,
        notes: 'Low dose formulation'
      },
      {
        userId: users[2].id,
        name: 'Nexplanon',
        brand: 'Merck',
        type: 'progestin-only',
        dosage: '68mg',
        color: 'N/A',
        shape: 'Implant',
        reminderTimes: [],
        instructions: 'Implant effective for 3 years',
        prescribedBy: 'Dr. Williams',
        prescriptionDate: '2024-03-10',
        expiryDate: '2027-03-10',
        isActive: true,
        notes: 'Subdermal implant in left arm'
      }
    ]);

    console.log(`✅ Created ${pills.length} pills`);

    // Create sample pill intakes
    const intakes = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Alice's pill intakes
      intakes.push({
        userId: users[0].id,
        pillId: pills[0].id,
        scheduledDate: date.toISOString().split('T')[0],
        scheduledTime: '08:00:00',
        takenAt: i < 25 ? new Date(date.getTime() + 8 * 60 * 60 * 1000) : null,
        status: i < 25 ? 'taken' : (i < 28 ? 'missed' : 'scheduled'),
        lateTaken: i === 5 || i === 12,
        minutesLate: i === 5 ? 15 : (i === 12 ? 30 : null),
        mood: ['great', 'good', 'okay'][Math.floor(Math.random() * 3)],
        location: 'Home'
      });

      // Emma's pill intakes
      if (i < 20) {
        intakes.push({
          userId: users[1].id,
          pillId: pills[1].id,
          scheduledDate: date.toISOString().split('T')[0],
          scheduledTime: '21:00:00',
          takenAt: i < 18 ? new Date(date.getTime() + 21 * 60 * 60 * 1000) : null,
          status: i < 18 ? 'taken' : 'missed',
          lateTaken: i === 3,
          minutesLate: i === 3 ? 45 : null,
          mood: ['good', 'okay'][Math.floor(Math.random() * 2)],
          location: 'Home'
        });
      }
    }

    await PillIntake.bulkCreate(intakes);
    console.log(`✅ Created ${intakes.length} pill intakes`);

    // Create sample cycles
    const cycles = await Cycle.bulkCreate([
      {
        userId: users[0].id,
        startDate: '2024-01-01',
        endDate: '2024-01-05',
        lengthDays: 28,
        flow: 'medium',
        symptoms: ['cramps', 'headache'],
        mood: ['irritable', 'tired'],
        pain: 6,
        notes: 'Regular cycle',
        isComplete: true
      },
      {
        userId: users[0].id,
        startDate: '2024-01-29',
        endDate: '2024-02-03',
        lengthDays: 29,
        flow: 'heavy',
        symptoms: ['cramps', 'bloating'],
        mood: ['emotional', 'tired'],
        pain: 7,
        notes: 'Slightly heavier flow',
        isComplete: true
      },
      {
        userId: users[1].id,
        startDate: '2024-01-15',
        endDate: '2024-01-19',
        lengthDays: 26,
        flow: 'light',
        symptoms: ['mild cramps'],
        mood: ['normal'],
        pain: 3,
        notes: 'Light cycle',
        isComplete: true
      }
    ]);

    console.log(`✅ Created ${cycles.length} cycles`);

    // Create sample cycle days
    const cycleDays = [];
    
    // Add cycle days for Alice's first cycle
    for (let i = 0; i < 28; i++) {
      const date = new Date('2024-01-01');
      date.setDate(date.getDate() + i);
      
      cycleDays.push({
        userId: users[0].id,
        cycleId: cycles[0].id,
        date: date.toISOString().split('T')[0],
        cycleDay: i + 1,
        phase: i < 5 ? 'menstrual' : (i < 14 ? 'follicular' : (i < 16 ? 'ovulation' : 'luteal')),
        flow: i < 5 ? ['heavy', 'medium', 'light', 'spotting', 'none'][Math.min(i, 4)] : 'none',
        mood: ['okay', 'good', 'great'][Math.floor(Math.random() * 3)],
        energy: Math.floor(Math.random() * 10) + 1,
        sleep: Math.floor(Math.random() * 10) + 1,
        stress: Math.floor(Math.random() * 10) + 1,
        pain: i < 5 ? Math.floor(Math.random() * 8) + 1 : Math.floor(Math.random() * 3),
        temperature: 36.5 + Math.random() * 1.5,
        notes: i === 14 ? 'Ovulation day' : (i < 5 ? 'Period day' : null)
      });
    }

    await CycleDay.bulkCreate(cycleDays);
    console.log(`✅ Created ${cycleDays.length} cycle days`);

    console.log('🎉 Database seeded successfully!');
    console.log('🌐 Visit http://localhost:5173/database to view the data');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

module.exports = seedDatabase;

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}
