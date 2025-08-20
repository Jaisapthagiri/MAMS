import bcrypt from 'bcryptjs';
import Base from '../models/Base.js';
import EquipmentType from '../models/EquipmentType.js';
import User from '../models/User.js';

export const seedIfNeeded = async () => {
  const baseCount = await Base.countDocuments();
  if (baseCount > 0) return;
  const alpha = await Base.create({ name: 'Base Alpha' });
  const bravo = await Base.create({ name: 'Base Bravo' });
  const rifle = await EquipmentType.create({ name: 'Rifle', unit: 'pcs' });
  const ammo = await EquipmentType.create({ name: '5.56 Ammo', unit: 'rounds' });
  const vehicle = await EquipmentType.create({ name: 'Jeep', unit: 'vehicles' });

  const mkHash = async (pwd) => bcrypt.hash(pwd, 10);

  await User.create({
    name: 'Global Admin',
    email: 'admin@mil.gov',
    passwordHash: await mkHash('Admin@123'),
    role: 'admin'
  });
  await User.create({
    name: 'Alpha Commander',
    email: 'alpha.cmd@mil.gov',
    passwordHash: await mkHash('Alpha@123'),
    role: 'commander',
    base: alpha._id
  });
  await User.create({
    name: 'Alpha Logistics',
    email: 'alpha.log@mil.gov',
    passwordHash: await mkHash('Alpha@123'),
    role: 'logistics',
    base: alpha._id
  });

  console.log('Seeded Bases, EquipmentTypes, Users');
};
