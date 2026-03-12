const mongoose = require('mongoose');
const Tour = require('./models/tourModel');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/.env' });

const tours = [
  {
    name: 'Mumbai Trip',
    description: 'Explore the vibrant city of Mumbai with guided tours, local cuisine, and shopping.',
    cost: 12000,
    date: new Date('2025-08-10'),
    images: ['https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80'], // Mumbai
    flights: [
      { airline: 'IndiGo', from: 'Delhi', to: 'Mumbai', price: 4000, images: ['https://logo.clearbit.com/goindigo.in'] },
      { airline: 'Air India', from: 'Bangalore', to: 'Mumbai', price: 4500, images: ['https://logo.clearbit.com/airindia.com'] }
    ],
    hotels: [
      { name: 'Taj Mahal Palace', stars: 5, pricePerNight: 8000, images: ['https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80'] }, // Mumbai
      { name: 'Hotel Mumbai', stars: 4, pricePerNight: 5000, images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'] } // Mumbai
    ]
  },
  {
    name: 'Delhi Heritage Tour',
    description: 'Discover the rich history of Delhi with visits to Red Fort, Qutub Minar, and more.',
    cost: 10000,
    date: new Date('2025-09-15'),
    images: ['https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=800&q=80'], // Delhi
    flights: [
      { airline: 'Vistara', from: 'Mumbai', to: 'Delhi', price: 4200, images: ['https://logo.clearbit.com/airvistara.com'] },
      { airline: 'SpiceJet', from: 'Chennai', to: 'Delhi', price: 4700, images: ['https://logo.clearbit.com/spicejet.com'] }
    ],
    hotels: [
      { name: 'The Leela Palace', stars: 5, pricePerNight: 9000, images: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'] }, // Delhi
      { name: 'Hotel Delhi', stars: 3, pricePerNight: 3500, images: ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80'] } // Delhi
    ]
  },
  {
    name: 'Goa Beach Holiday',
    description: 'Relax on the beaches of Goa, enjoy water sports, and vibrant nightlife.',
    cost: 15000,
    date: new Date('2025-12-01'),
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'], // Goa
    flights: [
      { airline: 'GoAir', from: 'Delhi', to: 'Goa', price: 5000, images: ['https://logo.clearbit.com/goair.in'] },
      { airline: 'IndiGo', from: 'Bangalore', to: 'Goa', price: 4800, images: ['https://logo.clearbit.com/goindigo.in'] }
    ],
    hotels: [
      { name: 'Grand Hyatt Goa', stars: 5, pricePerNight: 10000, images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'] }, // Goa
      { name: 'Goa Beach Resort', stars: 4, pricePerNight: 6000, images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'] } // Goa
    ]
  },
  {
    name: 'Paris Adventure',
    description: 'Experience the romance of Paris with flights, luxury hotels, and guided city tours.',
    cost: 185000,
    date: new Date('2025-10-05'),
    images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'], // Paris
    flights: [
      { airline: 'Air France', from: 'Delhi', to: 'Paris', price: 55000, images: ['https://logo.clearbit.com/airfrance.com'] },
      { airline: 'Lufthansa', from: 'Mumbai', to: 'Paris', price: 60000, images: ['https://logo.clearbit.com/lufthansa.com'] }
    ],
    hotels: [
      { name: 'Le Meurice', stars: 5, pricePerNight: 25000, images: ['https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'] }, // Paris
      { name: 'Hotel Paris Bastille', stars: 4, pricePerNight: 12000, images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'] } // Paris
    ]
  },
  {
    name: 'Tokyo Explorer',
    description: 'Discover Tokyo with flights, top hotels, and cultural experiences.',
    cost: 240000,
    date: new Date('2025-11-12'),
    images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'], // Tokyo
    flights: [
      { airline: 'Japan Airlines', from: 'Delhi', to: 'Tokyo', price: 70000, images: ['https://logo.clearbit.com/jal.com'] },
      { airline: 'ANA', from: 'Bangalore', to: 'Tokyo', price: 72000, images: ['https://logo.clearbit.com/ana.co.jp'] }
    ],
    hotels: [
      { name: 'Park Hyatt Tokyo', stars: 5, pricePerNight: 30000, images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'] }, // Tokyo
      { name: 'Shinjuku Granbell Hotel', stars: 4, pricePerNight: 15000, images: ['https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80'] } // Tokyo
    ]
  },
  {
    name: 'London Business Class',
    description: 'Business class flights to London and premium hotel stays.',
    cost: 135000,
    date: new Date('2025-09-20'),
    images: ['https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80'], // London
    flights: [
      { airline: 'British Airways', from: 'Delhi', to: 'London', price: 85000, images: ['https://logo.clearbit.com/britishairways.com'] },
      { airline: 'Virgin Atlantic', from: 'Mumbai', to: 'London', price: 83000, images: ['https://logo.clearbit.com/virginatlantic.com'] }
    ],
    hotels: [
      { name: 'The Savoy', stars: 5, pricePerNight: 35000, images: ['https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80'] }, // London
      { name: 'Premier Inn London', stars: 3, pricePerNight: 9000, images: ['https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80'] } // London
    ]
  },
  {
    name: 'Bali Beach Retreat',
    description: 'Stay at a 5-star beachfront resort in Bali with flights and all amenities.',
    cost: 35000,
    date: new Date('2025-08-25'),
    images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'], // Bali
    flights: [
      { airline: 'Garuda Indonesia', from: 'Chennai', to: 'Bali', price: 25000, images: ['https://logo.clearbit.com/garuda-indonesia.com'] },
      { airline: 'Singapore Airlines', from: 'Delhi', to: 'Bali', price: 27000, images: ['https://logo.clearbit.com/singaporeair.com'] }
    ],
    hotels: [
      { name: 'Luxury Resort Bali', stars: 5, pricePerNight: 20000, images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'] }, // Bali
      { name: 'Bali Beach Hotel', stars: 4, pricePerNight: 11000, images: ['https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=800&q=80'] } // Bali
    ]
  },
  {
    name: 'New York City Tour',
    description: 'Explore NYC with direct flights and central hotels.',
    cost: 210000,
    date: new Date('2025-12-15'),
    images: ['https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'], // NYC
    flights: [
      { airline: 'United Airlines', from: 'Delhi', to: 'New York', price: 95000, images: ['https://logo.clearbit.com/united.com'] },
      { airline: 'Air India', from: 'Mumbai', to: 'New York', price: 97000, images: ['https://logo.clearbit.com/airindia.com'] }
    ],
    hotels: [
      { name: 'New York Hilton Midtown', stars: 4, pricePerNight: 22000, images: ['https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'] }, // NYC
      { name: 'The Manhattan Hotel', stars: 3, pricePerNight: 14000, images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'] } // NYC
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // Seed admin user
    const adminEmail = 'admin@regalvoyage.com';
    const adminPassword = 'admin123';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user seeded! Email: admin@regalvoyage.com Password: admin123');
    } else {
      console.log('Admin user already exists.');
    }
    await Tour.deleteMany();
    await Tour.insertMany(tours);
    console.log('Sample tours seeded!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed(); 