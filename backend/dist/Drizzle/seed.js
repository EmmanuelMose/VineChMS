"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const schema_1 = require("./schema");
async function seed() {
    try {
        console.log("Clearing existing data...");
        await db_1.default.delete(schema_1.unregisteredUsers);
        await db_1.default.delete(schema_1.churches);
        await db_1.default.delete(schema_1.organizations);
        await db_1.default.delete(schema_1.largeOrganizations);
        console.log("Creating large organizations...");
        const largeOrg = await db_1.default
            .insert(schema_1.largeOrganizations)
            .values({
            name: "Global Church Network",
            description: "International church network",
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
        console.log("Creating small organizations...");
        const org = await db_1.default
            .insert(schema_1.organizations)
            .values({
            name: "Nairobi Diocese",
            description: "Nairobi region diocese",
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
        console.log("Creating churches...");
        await db_1.default.insert(schema_1.churches).values([
            {
                name: "Nairobi Central Church",
                description: "Main church in Nairobi",
                email: "info@nairolicentral.org",
                phone: "+254712345679",
                country: "Kenya",
                city: "Nairobi",
                state: "Nairobi",
                denomination: "Pentecostal",
                organizationId: org[0].organizationId,
                maxMembers: 200,
                logo: "https://res.cloudinary.com/demo/image/upload/v1/nairobi-central-logo.png",
            },
            {
                name: "Westlands Fellowship",
                description: "Westlands area church",
                email: "info@westlandsfellowship.org",
                phone: "+254712345680",
                country: "Kenya",
                city: "Nairobi",
                state: "Nairobi",
                denomination: "Pentecostal",
                organizationId: org[0].organizationId,
                maxMembers: 150,
                logo: "https://res.cloudinary.com/demo/image/upload/v1/westlands-logo.png",
            },
        ]);
        console.log("Creating unregistered users (must be registered first)...");
        const invitationToken1 = "INV" + Math.floor(100000 + Math.random() * 900000);
        const invitationToken2 = "INV" + Math.floor(100000 + Math.random() * 900000);
        const invitationToken3 = "INV" + Math.floor(100000 + Math.random() * 900000);
        const invitationToken4 = "INV" + Math.floor(100000 + Math.random() * 900000);
        const invitationToken5 = "INV" + Math.floor(100000 + Math.random() * 900000);
        const invitationToken6 = "INV" + Math.floor(100000 + Math.random() * 900000);
        const invitationToken7 = "INV" + Math.floor(100000 + Math.random() * 900000);
        const invitationToken8 = "INV" + Math.floor(100000 + Math.random() * 900000);
        const invitationToken9 = "INV" + Math.floor(100000 + Math.random() * 900000);
        const invitationToken10 = "INV" + Math.floor(100000 + Math.random() * 900000);
        const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await db_1.default.insert(schema_1.unregisteredUsers).values([
            {
                email: "emmanuelmose806@gmail.com",
                fullName: "Emmanuel Mose",
                role: "super_admin",
                invitationToken: invitationToken1,
                tokenExpiresAt,
                largeOrganizationId: null,
                organizationId: null,
                churchId: null,
            },
            {
                email: "emmanuelmose64@yahoo.com",
                fullName: "Emmanuel Mose",
                role: "church_admin",
                invitationToken: invitationToken2,
                tokenExpiresAt,
                largeOrganizationId: null,
                organizationId: null,
                churchId: null,
            },
            {
                email: "largeorg@example.com",
                fullName: "Large Organization Admin",
                role: "large_org_admin",
                invitationToken: invitationToken3,
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: null,
                churchId: null,
            },
            {
                email: "smallorg@example.com",
                fullName: "Small Organization Admin",
                role: "small_org_admin",
                invitationToken: invitationToken4,
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: null,
            },
            {
                email: "churchadmin@example.com",
                fullName: "Church Admin",
                role: "church_admin",
                invitationToken: invitationToken5,
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: 1,
            },
            {
                email: "member@example.com",
                fullName: "John Member",
                role: "church_member",
                invitationToken: invitationToken6,
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: 1,
            },
            {
                email: "pastor@example.com",
                fullName: "Pastor Peter",
                role: "pastor",
                invitationToken: invitationToken7,
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: 1,
            },
            {
                email: "treasurer@example.com",
                fullName: "Treasurer Paul",
                role: "treasurer",
                invitationToken: invitationToken8,
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: 1,
            },
            {
                email: "secretary@example.com",
                fullName: "Secretary Jane",
                role: "secretary",
                invitationToken: invitationToken9,
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: 1,
            },
            {
                email: "elder@example.com",
                fullName: "Elder James",
                role: "elder",
                invitationToken: invitationToken10,
                tokenExpiresAt,
                largeOrganizationId: largeOrg[0].largeOrganizationId,
                organizationId: org[0].organizationId,
                churchId: 1,
            },
        ]);
        console.log("\n Database seeding completed successfully!");
        console.log("\n Unregistered Users (Must Register First):");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("Email                         | Role                 | Token");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`emmanuelmose806@gmail.com      | super_admin          | ${invitationToken1}`);
        console.log(`emmanuelmose64@yahoo.com       | church_admin         | ${invitationToken2}`);
        console.log(`largeorg@example.com           | large_org_admin      | ${invitationToken3}`);
        console.log(`smallorg@example.com           | small_org_admin      | ${invitationToken4}`);
        console.log(`churchadmin@example.com        | church_admin         | ${invitationToken5}`);
        console.log(`member@example.com             | church_member        | ${invitationToken6}`);
        console.log(`pastor@example.com             | pastor               | ${invitationToken7}`);
        console.log(`treasurer@example.com          | treasurer            | ${invitationToken8}`);
        console.log(`secretary@example.com          | secretary            | ${invitationToken9}`);
        console.log(`elder@example.com              | elder                | ${invitationToken10}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n🔑 Use these tokens to register:");
        console.log("1. Go to /register page");
        console.log("2. Enter email and password");
        console.log("3. Use the invitation token above");
        console.log("4. Check email for verification code");
        console.log("5. Verify email to complete registration");
        console.log("\n🎉 Seed completed!");
        process.exit(0);
    }
    catch (error) {
        console.error("Database seeding failed.");
        console.error(error);
        process.exit(1);
    }
}
seed();
