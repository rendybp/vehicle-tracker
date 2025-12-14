import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  console.log('👥 Seeding users...');
  
  const hashedPassword1 = await bcrypt.hash('Admin123#', 10);
  const hashedPassword2 = await bcrypt.hash('Admin456!', 10);
  const hashedPassword3 = await bcrypt.hash('User123!', 10);
  const hashedPassword4 = await bcrypt.hash('User456!', 10);
  const hashedPassword5 = await bcrypt.hash('User789!', 10);

  const users = await prisma.user.createMany({
    data: [
      {
        name: 'Rendi Buana',
        email: 'rendibuana@gmail.com',
        password: hashedPassword1,
        role: 'ADMIN',
        is_active: true,
      },
      {
        name: 'Admin Widya',
        email: 'admin@widya.com',
        password: hashedPassword2,
        role: 'ADMIN',
        is_active: true,
      },
      {
        name: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        password: hashedPassword3,
        role: 'USER',
        is_active: true,
      },
      {
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@gmail.com',
        password: hashedPassword4,
        role: 'USER',
        is_active: true,
      },
      {
        name: 'Ahmad Rizky',
        email: 'ahmad.rizky@gmail.com',
        password: hashedPassword5,
        role: 'USER',
        is_active: true,
      },
    ],
  });

  console.log(`✅ Created ${users.count} users`);

  // Seed Vehicles
  console.log('🚗 Seeding vehicles...');

  const vehicles = await prisma.vehicle.createMany({
    data: [
      {
        name: 'Toyota Avanza - B1234XYZ',
        status: 'ACTIVE',
        fuel_level: 75.5,
        odometer: 45230.8,
        latitude: -6.200000,
        longitude: 106.816666,
        speed: 0,
      },
      {
        name: 'Honda Jazz - B5678ABC',
        status: 'ACTIVE',
        fuel_level: 60.2,
        odometer: 32150.5,
        latitude: -6.175110,
        longitude: 106.865036,
        speed: 45.5,
      },
      {
        name: 'Suzuki Ertiga - B9012DEF',
        status: 'ACTIVE',
        fuel_level: 85.0,
        odometer: 28900.0,
        latitude: -6.914744,
        longitude: 107.609810,
        speed: 60.0,
      },
      {
        name: 'Daihatsu Xenia - B3456GHI',
        status: 'INACTIVE',
        fuel_level: 20.5,
        odometer: 67890.3,
        latitude: -7.797068,
        longitude: 110.370529,
        speed: 0,
      },
      {
        name: 'Mitsubishi Pajero - B7890JKL',
        status: 'ACTIVE',
        fuel_level: 95.0,
        odometer: 15230.2,
        latitude: -8.670458,
        longitude: 115.212631,
        speed: 70.3,
      },
      {
        name: 'Isuzu Panther - B2345MNO',
        status: 'MAINTENANCE',
        fuel_level: 45.8,
        odometer: 125600.7,
        latitude: -6.121435,
        longitude: 106.774124,
        speed: 0,
      },
      {
        name: 'Toyota Fortuner - B6789PQR',
        status: 'ACTIVE',
        fuel_level: 70.0,
        odometer: 52100.5,
        latitude: -6.302100,
        longitude: 106.652800,
        speed: 55.0,
      },
      {
        name: 'Honda CR-V - B0123STU',
        status: 'ACTIVE',
        fuel_level: 80.5,
        odometer: 38750.0,
        latitude: -6.229728,
        longitude: 106.689857,
        speed: 40.2,
      },
      {
        name: 'Nissan X-Trail - B4567VWX',
        status: 'ACTIVE',
        fuel_level: 55.3,
        odometer: 44320.8,
        latitude: -3.316694,
        longitude: 114.590111,
        speed: 65.8,
      },
      {
        name: 'Mazda CX-5 - B8901YZA',
        status: 'INACTIVE',
        fuel_level: 30.0,
        odometer: 71450.2,
        latitude: -5.147665,
        longitude: 119.432732,
        speed: 0,
      },
      {
        name: 'Hyundai Creta - B1357BCD',
        status: 'ACTIVE',
        fuel_level: 92.0,
        odometer: 18900.5,
        latitude: -0.502106,
        longitude: 117.153709,
        speed: 50.5,
      },
      {
        name: 'KIA Seltos - B2468EFG',
        status: 'ACTIVE',
        fuel_level: 65.5,
        odometer: 35670.3,
        latitude: -6.990389,
        longitude: 110.423447,
        speed: 58.7,
      },
    ],
  });

  console.log(`✅ Created ${vehicles.count} vehicles`);

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📝 Summary:');
  console.log(`   - Users: ${users.count} (2 Admins, 3 Users)`);
  console.log(`   - Vehicles: ${vehicles.count}`);
  console.log('');
  console.log('🔐 Admin Login:');
  console.log('   Email: rendibuana@gmail.com');
  console.log('   Password: Admin123#');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
