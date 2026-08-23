const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Registration = require('../models/Registration');
const Match = require('../models/Match');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('Seeding initial tournament data...');

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const admin = await User.create({
      name: 'Admin Controller',
      email: 'admin@tournament.com',
      password: adminPassword,
      role: 'admin'
    });

    const user1 = await User.create({
      name: 'Akil Captain',
      email: 'user@tournament.com',
      password: userPassword,
      role: 'user'
    });

    const user2 = await User.create({
      name: 'John Smith',
      email: 'john@tournament.com',
      password: userPassword,
      role: 'user'
    });

    const user3 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@tournament.com',
      password: userPassword,
      role: 'user'
    });

    // 2. Create Tournaments
    const t1 = await Tournament.create({
      name: 'College Football Championship',
      sport: 'Football',
      location: 'Main Sports Complex Arena',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-10'),
      maxTeams: 8,
      status: 'Upcoming'
    });

    const t2 = await Tournament.create({
      name: 'Inter College Cricket Cup',
      sport: 'Cricket',
      location: 'University Oval Field',
      startDate: new Date('2026-08-25'),
      endDate: new Date('2026-09-05'),
      maxTeams: 8,
      status: 'Ongoing'
    });

    const t3 = await Tournament.create({
      name: 'E-Sports Championship',
      sport: 'Valorant / Gaming',
      location: 'Student Union Tech Lounge',
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-15'),
      maxTeams: 4,
      status: 'Completed'
    });

    // 3. Create Teams
    const team1 = await Team.create({
      teamName: 'Thunder Strikers',
      captain: 'Akil Captain',
      sport: 'Football',
      user: user1._id
    });

    const team2 = await Team.create({
      teamName: 'Cyber Warriors',
      captain: 'Akil Captain',
      sport: 'Valorant / Gaming',
      user: user1._id
    });

    const team3 = await Team.create({
      teamName: 'Titan Strikers',
      captain: 'John Smith',
      sport: 'Football',
      user: user2._id
    });

    const team4 = await Team.create({
      teamName: 'Phoenix Knights',
      captain: 'Sarah Connor',
      sport: 'Cricket',
      user: user3._id
    });

    // 4. Create Registrations
    await Registration.create({
      tournament: t1._id,
      team: team1._id,
      status: 'Approved'
    });

    await Registration.create({
      tournament: t1._id,
      team: team3._id,
      status: 'Approved'
    });

    await Registration.create({
      tournament: t2._id,
      team: team4._id,
      status: 'Approved'
    });

    await Registration.create({
      tournament: t3._id,
      team: team2._id,
      status: 'Approved'
    });

    // 5. Create Matches
    await Match.create({
      tournament: t1._id,
      team1: team1._id,
      team2: team3._id,
      matchDate: new Date('2026-09-02'),
      matchTime: '15:00',
      venue: 'Stadium Court A',
      status: 'Upcoming',
      streamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      roundNumber: 1
    });

    await Match.create({
      tournament: t3._id,
      team1: team2._id,
      team2: team4._id,
      matchDate: new Date('2026-08-12'),
      matchTime: '18:00',
      venue: 'Tech Arena Center',
      score1: 2,
      score2: 1,
      winner: team2._id,
      status: 'Completed',
      streamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      roundNumber: 1
    });

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding data:', err.message);
  }
};

module.exports = seedData;
