import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    try {
        // Create founder codes
        const founderCodes = await prisma.founderCode.createMany({
            data: [
                {
                    code: 'HOORA2026',
                    isActive: true,
                    maxUses: null // Unlimited
                },
                {
                    code: 'FOUNDER100',
                    isActive: true,
                    maxUses: 100
                },
                {
                    code: 'ELITE2026',
                    isActive: true,
                    maxUses: 50
                }
            ],
            skipDuplicates: true
        });
        console.log(`✅ Created ${founderCodes.count} founder codes`);

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123456', 10);
        const admin = await prisma.user.upsert({
            where: { email: 'admin@hooraflix.com' },
            update: {},
            create: {
                email: 'admin@hooraflix.com',
                password: adminPassword,
                name: 'HooraFlix Admin',
                role: 'ADMIN',
                isFounder: false
            }
        });
        console.log(`✅ Created admin user: ${admin.email}`);

        // Create sample founder user
        const founderPassword = await bcrypt.hash('founder123', 10);
        const founderUser = await prisma.user.upsert({
            where: { email: 'founder@hooraflix.com' },
            update: {},
            create: {
                email: 'founder@hooraflix.com',
                password: founderPassword,
                name: 'Sample Founder',
                role: 'FOUNDER',
                isFounder: true
            }
        });

        // Create founder profile
        const founder = await prisma.founder.upsert({
            where: { userId: founderUser.id },
            update: {},
            create: {
                userId: founderUser.id,
                founderCode: 'HOORA2026',
                referralLink: 'https://hooraflix.com/signup?refId=samplefounder',
                rank: 'GOLD',
                totalEarnings: 2500.00
            }
        });
        console.log(`✅ Created sample founder: ${founderUser.email}`);

        // Create sample referred users
        const referredUsers = [];
        for (let i = 1; i <= 5; i++) {
            const userPassword = await bcrypt.hash(`user${i}123`, 10);
            const user = await prisma.user.upsert({
                where: { email: `user${i}@example.com` },
                update: {},
                create: {
                    email: `user${i}@example.com`,
                    password: userPassword,
                    name: `Test User ${i}`,
                    role: 'USER',
                    isFounder: false
                }
            });
            referredUsers.push(user);
        }
        console.log(`✅ Created ${referredUsers.length} sample users`);

        // Create referrals
        for (const user of referredUsers) {
            await prisma.referral.upsert({
                where: { referredUserId: user.id },
                update: {},
                create: {
                    founderId: founder.id,
                    referredUserId: user.id,
                    status: 'ACTIVE'
                }
            });
        }
        console.log(`✅ Created ${referredUsers.length} referral relationships`);

        console.log('\n🎉 Database seeded successfully!\n');
        console.log('📝 Test Credentials:');
        console.log('   Admin: admin@hooraflix.com / admin123456');
        console.log('   Founder: founder@hooraflix.com / founder123');
        console.log('   Users: user1@example.com to user5@example.com / user[1-5]123');
        console.log('   Founder Codes: HOORA2026, FOUNDER100, ELITE2026\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
