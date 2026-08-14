"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const schema_1 = require("./schema");
async function seed() {
    try {
        console.log("🌿 Clearing existing data...");
        await db_1.default.delete(schema_1.sermons);
        await db_1.default.delete(schema_1.groups);
        await db_1.default.delete(schema_1.announcements);
        await db_1.default.delete(schema_1.events);
        await db_1.default.delete(schema_1.services);
        await db_1.default.delete(schema_1.expenseCategories);
        await db_1.default.delete(schema_1.givingCategories);
        await db_1.default.delete(schema_1.positions);
        await db_1.default.delete(schema_1.churches);
        await db_1.default.delete(schema_1.organizations);
        await db_1.default.delete(schema_1.largeOrganizations);
        await db_1.default.delete(schema_1.unregisteredUsers);
        console.log("📦 Creating large organizations...");
        const largeOrg = await db_1.default
            .insert(schema_1.largeOrganizations)
            .values({
            name: "Global Church Network",
            description: "International church network serving thousands of churches worldwide",
            email: "info@globalchurch.org",
            phone: "+1234567890",
            country: "Kenya",
            city: "Nairobi",
            state: "Nairobi",
            subscriptionPlan: "enterprise",
            subscriptionStatus: "active",
            maxOrganizations: 50,
            maxChurches: 500,
            maxMembers: 10000,
            logo: "https://res.cloudinary.com/demo/image/upload/v1/global-church-logo.png",
        })
            .returning();
        console.log("📦 Creating small organizations...");
        const org = await db_1.default
            .insert(schema_1.organizations)
            .values({
            name: "Nairobi Diocese",
            description: "Nairobi region diocese covering all churches in Nairobi county",
            email: "info@nairobidiocese.org",
            phone: "+254712345678",
            country: "Kenya",
            city: "Nairobi",
            state: "Nairobi",
            largeOrganizationId: largeOrg[0].largeOrganizationId,
            maxChurches: 20,
            maxMembers: 500,
            logo: "https://res.cloudinary.com/demo/image/upload/v1/nairobi-diocese-logo.png",
        })
            .returning();
        console.log("📦 Creating churches...");
        const church1 = await db_1.default
            .insert(schema_1.churches)
            .values({
            name: "Nairobi Central Church",
            description: "Main church in Nairobi city center",
            email: "info@nairolicentral.org",
            phone: "+254712345679",
            country: "Kenya",
            city: "Nairobi",
            state: "Nairobi",
            denomination: "Pentecostal",
            organizationId: org[0].organizationId,
            maxMembers: 200,
            logo: "https://res.cloudinary.com/demo/image/upload/v1/nairobi-central-logo.png",
        })
            .returning();
        const church2 = await db_1.default
            .insert(schema_1.churches)
            .values({
            name: "Westlands Fellowship",
            description: "Westlands area church serving the community",
            email: "info@westlandsfellowship.org",
            phone: "+254712345680",
            country: "Kenya",
            city: "Nairobi",
            state: "Nairobi",
            denomination: "Pentecostal",
            organizationId: org[0].organizationId,
            maxMembers: 150,
            logo: "https://res.cloudinary.com/demo/image/upload/v1/westlands-logo.png",
        })
            .returning();
        console.log("📦 Creating positions...");
        await db_1.default
            .insert(schema_1.positions)
            .values([
            {
                name: "Senior Pastor",
                description: "Lead pastor of the church",
                churchId: church1[0].churchId,
                isActive: true,
            },
            {
                name: "Elder",
                description: "Church elder responsible for governance",
                churchId: church1[0].churchId,
                isActive: true,
            },
            {
                name: "Treasurer",
                description: "Church treasurer managing finances",
                churchId: church1[0].churchId,
                isActive: true,
            },
            {
                name: "Secretary",
                description: "Church secretary managing records",
                churchId: church1[0].churchId,
                isActive: true,
            },
            {
                name: "Youth Pastor",
                description: "Youth ministry pastor",
                churchId: church1[0].churchId,
                isActive: true,
            },
            {
                name: "Worship Leader",
                description: "Leads worship and music ministry",
                churchId: church1[0].churchId,
                isActive: true,
            },
        ])
            .returning();
        console.log("📦 Creating giving categories...");
        await db_1.default.insert(schema_1.givingCategories).values([
            {
                churchId: church1[0].churchId,
                name: "Tithes",
                description: "10% of income",
                type: "tithe",
                isActive: true,
                image: "https://res.cloudinary.com/demo/image/upload/v1/tithe-icon.png",
            },
            {
                churchId: church1[0].churchId,
                name: "Offerings",
                description: "Free-will offerings",
                type: "offering",
                isActive: true,
                image: "https://res.cloudinary.com/demo/image/upload/v1/offering-icon.png",
            },
            {
                churchId: church1[0].churchId,
                name: "Building Fund",
                description: "Church building fund",
                type: "special",
                isActive: true,
                image: "https://res.cloudinary.com/demo/image/upload/v1/building-icon.png",
            },
            {
                churchId: church1[0].churchId,
                name: "Missions",
                description: "Missions and outreach support",
                type: "donation",
                isActive: true,
                image: "https://res.cloudinary.com/demo/image/upload/v1/missions-icon.png",
            },
            {
                churchId: church1[0].churchId,
                name: "Benevolence",
                description: "Support for those in need",
                type: "special",
                isActive: true,
                image: "https://res.cloudinary.com/demo/image/upload/v1/benevolence-icon.png",
            },
        ]);
        console.log("📦 Creating expense categories...");
        await db_1.default.insert(schema_1.expenseCategories).values([
            {
                churchId: church1[0].churchId,
                name: "Utilities",
                description: "Electricity, water, internet",
                isActive: true,
                image: "https://res.cloudinary.com/demo/image/upload/v1/utilities-icon.png",
            },
            {
                churchId: church1[0].churchId,
                name: "Salaries",
                description: "Staff and pastor salaries",
                isActive: true,
                image: "https://res.cloudinary.com/demo/image/upload/v1/salary-icon.png",
            },
            {
                churchId: church1[0].churchId,
                name: "Ministry Expenses",
                description: "Outreach and ministry costs",
                isActive: true,
                image: "https://res.cloudinary.com/demo/image/upload/v1/ministry-icon.png",
            },
            {
                churchId: church1[0].churchId,
                name: "Maintenance",
                description: "Church building and equipment maintenance",
                isActive: true,
                image: "https://res.cloudinary.com/demo/image/upload/v1/maintenance-icon.png",
            },
            {
                churchId: church1[0].churchId,
                name: "Events",
                description: "Church events and conferences",
                isActive: true,
                image: "https://res.cloudinary.com/demo/image/upload/v1/events-icon.png",
            },
        ]);
        console.log("📦 Creating services...");
        await db_1.default.insert(schema_1.services).values([
            {
                churchId: church1[0].churchId,
                name: "Sunday Worship",
                description: "Main Sunday service",
                dayOfWeek: 0,
                startTime: new Date(),
                endTime: new Date(),
                serviceType: "worship",
                attendanceType: "in_person",
                isActive: true,
            },
            {
                churchId: church1[0].churchId,
                name: "Wednesday Bible Study",
                description: "Mid-week Bible study",
                dayOfWeek: 3,
                startTime: new Date(),
                endTime: new Date(),
                serviceType: "bible_study",
                attendanceType: "both",
                isActive: true,
            },
            {
                churchId: church1[0].churchId,
                name: "Friday Prayer Meeting",
                description: "Friday evening prayer meeting",
                dayOfWeek: 5,
                startTime: new Date(),
                endTime: new Date(),
                serviceType: "prayer",
                attendanceType: "in_person",
                isActive: true,
            },
            {
                churchId: church2[0].churchId,
                name: "Sunday Worship",
                description: "Main Sunday service",
                dayOfWeek: 0,
                startTime: new Date(),
                endTime: new Date(),
                serviceType: "worship",
                attendanceType: "in_person",
                isActive: true,
            },
        ]);
        console.log("📦 Creating events...");
        await db_1.default.insert(schema_1.events).values([
            {
                churchId: church1[0].churchId,
                title: "Annual Conference 2025",
                description: "Annual church conference with guest speakers",
                location: "Nairobi Convention Centre",
                startDate: new Date("2025-06-15"),
                endDate: new Date("2025-06-18"),
                status: "published",
                isPublic: true,
                maxAttendees: 500,
                imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/conference-banner.jpg",
                coverImageUrl: "https://res.cloudinary.com/demo/image/upload/v1/conference-cover.jpg",
                gallery: JSON.stringify([
                    "https://res.cloudinary.com/demo/image/upload/v1/gallery1.jpg",
                    "https://res.cloudinary.com/demo/image/upload/v1/gallery2.jpg",
                    "https://res.cloudinary.com/demo/image/upload/v1/gallery3.jpg",
                ]),
            },
            {
                churchId: church1[0].churchId,
                title: "Youth Camp 2025",
                description: "Annual youth camp with fun activities",
                location: "Kijabe",
                startDate: new Date("2025-08-10"),
                endDate: new Date("2025-08-14"),
                status: "published",
                isPublic: true,
                maxAttendees: 100,
                imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/youth-camp-banner.jpg",
                coverImageUrl: "https://res.cloudinary.com/demo/image/upload/v1/youth-camp-cover.jpg",
                gallery: JSON.stringify([
                    "https://res.cloudinary.com/demo/image/upload/v1/youth-gallery1.jpg",
                    "https://res.cloudinary.com/demo/image/upload/v1/youth-gallery2.jpg",
                ]),
            },
            {
                churchId: church1[0].churchId,
                title: "Women's Conference",
                description: "Empowering women in faith",
                location: "Church Hall",
                startDate: new Date("2025-09-20"),
                endDate: new Date("2025-09-22"),
                status: "published",
                isPublic: true,
                maxAttendees: 200,
                imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/women-conference.jpg",
            },
        ]);
        console.log("📦 Creating announcements...");
        await db_1.default.insert(schema_1.announcements).values([
            {
                churchId: church1[0].churchId,
                title: "Church Service Changes",
                content: "Sunday service will now start at 10:00 AM instead of 9:00 AM",
                isPublished: true,
                publishedAt: new Date(),
                imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/announcement-service.jpg",
                imagePosition: "top",
            },
            {
                churchId: church1[0].churchId,
                title: "Prayer Week",
                content: "Join us for a week of prayer starting Monday",
                isPublished: true,
                publishedAt: new Date(),
                imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/announcement-prayer.jpg",
                imagePosition: "cover",
            },
            {
                churchId: church1[0].churchId,
                title: "New Ministry Launch",
                content: "We are launching a new youth ministry next month",
                isPublished: true,
                publishedAt: new Date(),
                imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/announcement-ministry.jpg",
                imagePosition: "top",
            },
            {
                churchId: church1[0].churchId,
                title: "Community Outreach",
                content: "Join us for community outreach this Saturday",
                isPublished: false,
                publishedAt: null,
                imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/announcement-outreach.jpg",
            },
            {
                churchId: church1[0].churchId,
                title: "Christmas Service",
                content: "Christmas service will be held on December 25th at 9:00 AM",
                isPublished: true,
                publishedAt: new Date(),
                expiresAt: new Date("2025-12-26"),
                imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/announcement-christmas.jpg",
                imagePosition: "cover",
            },
        ]);
        console.log("📦 Creating groups...");
        await db_1.default
            .insert(schema_1.groups)
            .values([
            {
                churchId: church1[0].churchId,
                name: "Men's Fellowship",
                description: "Men's group meeting every Saturday",
                type: "fellowship",
                meetingDay: 6,
                location: "Church Hall",
                isActive: true,
            },
            {
                churchId: church1[0].churchId,
                name: "Women's Fellowship",
                description: "Women's group meeting every Friday",
                type: "fellowship",
                meetingDay: 5,
                location: "Church Hall",
                isActive: true,
            },
            {
                churchId: church1[0].churchId,
                name: "Youth Group",
                description: "Youth group meeting every Saturday",
                type: "youth",
                meetingDay: 6,
                location: "Youth Center",
                isActive: true,
            },
            {
                churchId: church1[0].churchId,
                name: "Bible Study Group",
                description: "Weekly Bible study on Wednesdays",
                type: "bible_study",
                meetingDay: 3,
                location: "Main Hall",
                isActive: true,
            },
            {
                churchId: church1[0].churchId,
                name: "Prayer Warriors",
                description: "Early morning prayer group",
                type: "prayer",
                meetingDay: 0,
                location: "Church",
                isActive: true,
            },
        ]);
        console.log("📦 Creating sermons...");
        await db_1.default.insert(schema_1.sermons).values([
            {
                churchId: church1[0].churchId,
                title: "The Power of Faith",
                speaker: "Pastor Peter",
                topic: "Faith",
                scripture: "Hebrews 11:1",
                description: "Sermon on the power of faith",
                preachedAt: new Date("2025-01-05"),
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/faith-sermon.mp4",
                audioUrl: "https://res.cloudinary.com/demo/audio/upload/v1/faith-sermon.mp3",
            },
            {
                churchId: church1[0].churchId,
                title: "Love Your Neighbor",
                speaker: "Pastor Peter",
                topic: "Love",
                scripture: "Mark 12:31",
                description: "Sermon on loving others",
                preachedAt: new Date("2025-01-12"),
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/love-sermon.mp4",
                audioUrl: "https://res.cloudinary.com/demo/audio/upload/v1/love-sermon.mp3",
            },
            {
                churchId: church1[0].churchId,
                title: "Walking in the Spirit",
                speaker: "Pastor Peter",
                topic: "Holy Spirit",
                scripture: "Galatians 5:16",
                description: "Sermon on walking in the Spirit",
                preachedAt: new Date("2025-01-19"),
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/spirit-sermon.mp4",
                audioUrl: "https://res.cloudinary.com/demo/audio/upload/v1/spirit-sermon.mp3",
            },
            {
                churchId: church1[0].churchId,
                title: "The Great Commission",
                speaker: "Pastor Peter",
                topic: "Missions",
                scripture: "Matthew 28:19-20",
                description: "Sermon on the Great Commission",
                preachedAt: new Date("2025-01-26"),
                videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/missions-sermon.mp4",
            },
            {
                churchId: church2[0].churchId,
                title: "Living by Faith",
                speaker: "Pastor John",
                topic: "Faith",
                scripture: "2 Corinthians 5:7",
                description: "Sermon on living by faith",
                preachedAt: new Date("2025-02-02"),
                audioUrl: "https://res.cloudinary.com/demo/audio/upload/v1/faith-sermon2.mp3",
            },
        ]);
        console.log("📧 Creating unregistered users (email + role only)...");
        const tokenExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        await db_1.default.insert(schema_1.unregisteredUsers).values([
            {
                email: "emmanuelmose806@gmail.com",
                fullName: "Emmanuel Mose",
                role: "church_member",
                invitationToken: "MEMBER_TOKEN_001",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: church1[0].churchId,
            },
            {
                email: "emmanuelmose64@yahoo.com",
                fullName: "Emmanuel Mose",
                role: "church_admin",
                invitationToken: "CHURCH_TOKEN_002",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: church1[0].churchId,
            },
            {
                email: "largeorg@example.com",
                fullName: "Large Organization Admin",
                role: "large_org_admin",
                invitationToken: "LARGE_TOKEN_003",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: null,
                churchId: null,
            },
            {
                email: "largeorgmember@example.com",
                fullName: "Large Organization Member",
                role: "large_org_member",
                invitationToken: "LARGE_MEM_004",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: null,
                churchId: null,
            },
            {
                email: "smallorg@example.com",
                fullName: "Small Organization Admin",
                role: "small_org_admin",
                invitationToken: "SMALL_TOKEN_005",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: null,
            },
            {
                email: "smallorgmember@example.com",
                fullName: "Small Organization Member",
                role: "small_org_member",
                invitationToken: "SMALL_MEM_006",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: null,
            },
            {
                email: "churchadmin@example.com",
                fullName: "Church Admin",
                role: "church_admin",
                invitationToken: "CHURCH_TOKEN_007",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: church1[0].churchId,
            },
            {
                email: "member@example.com",
                fullName: "John Member",
                role: "church_member",
                invitationToken: "MEMBER_TOKEN_008",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: church1[0].churchId,
            },
            {
                email: "pastor@example.com",
                fullName: "Pastor Peter",
                role: "pastor",
                invitationToken: "PASTOR_TOKEN_009",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: church1[0].churchId,
            },
            {
                email: "treasurer@example.com",
                fullName: "Treasurer Paul",
                role: "treasurer",
                invitationToken: "TREASURER_TOKEN_010",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: church1[0].churchId,
            },
            {
                email: "secretary@example.com",
                fullName: "Secretary Jane",
                role: "secretary",
                invitationToken: "SECRETARY_TOKEN_011",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: church1[0].churchId,
            },
            {
                email: "elder@example.com",
                fullName: "Elder James",
                role: "elder",
                invitationToken: "ELDER_TOKEN_012",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: church1[0].churchId,
            },
            {
                email: "youthpastor@example.com",
                fullName: "Youth Pastor Mark",
                role: "pastor",
                invitationToken: "YOUTH_PASTOR_013",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: church1[0].churchId,
            },
            {
                email: "worship@example.com",
                fullName: "Worship Leader David",
                role: "church_member",
                invitationToken: "WORSHIP_014",
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: church1[0].churchId,
            },
        ]);
        console.log("\n✅ Database seeding completed successfully!");
        console.log("\n📋 Unregistered Users (Must Register First):");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("Email                         | Role");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("emmanuelmose806@gmail.com      | church_member");
        console.log("emmanuelmose64@yahoo.com       | church_admin");
        console.log("largeorg@example.com           | large_org_admin");
        console.log("largeorgmember@example.com     | large_org_member");
        console.log("smallorg@example.com           | small_org_admin");
        console.log("smallorgmember@example.com     | small_org_member");
        console.log("churchadmin@example.com        | church_admin");
        console.log("member@example.com             | church_member");
        console.log("pastor@example.com             | pastor");
        console.log("treasurer@example.com          | treasurer");
        console.log("secretary@example.com          | secretary");
        console.log("elder@example.com              | elder");
        console.log("youthpastor@example.com        | pastor");
        console.log("worship@example.com            | church_member");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n🔑 Users can register with just email and password.");
        console.log("   Email must exist in unregisteredUsers table first.");
        console.log("   After registration, user must verify email before login.");
        console.log("   Users REMAIN in unregisteredUsers table after registration.");
        console.log("\n🎉 Seed completed!");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Database seeding failed.");
        console.error(error);
        process.exit(1);
    }
}
seed();
