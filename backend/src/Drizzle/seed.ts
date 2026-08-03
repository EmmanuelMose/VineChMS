import db from "./db";
import {
  unregisteredUsers,
  largeOrganizations,
  organizations,
  churches,
  positions,
  givingCategories,
  expenseCategories,
} from "./schema";

async function seed() {
  try {
    console.log("🌿 Clearing existing data...");
    await db.delete(unregisteredUsers);
    await db.delete(churches);
    await db.delete(organizations);
    await db.delete(largeOrganizations);
    await db.delete(positions);
    await db.delete(givingCategories);
    await db.delete(expenseCategories);

    console.log("📦 Creating large organizations...");
    const largeOrg = await db
      .insert(largeOrganizations)
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

    console.log("📦 Creating small organizations...");
    const org = await db
      .insert(organizations)
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

    console.log("📦 Creating churches...");
    const church = await db
      .insert(churches)
      .values({
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
      })
      .returning();

    console.log("📦 Creating positions...");
    await db.insert(positions).values([
      {
        name: "Senior Pastor",
        description: "Lead pastor of the church",
        churchId: church[0].churchId,
        isActive: true,
      },
      {
        name: "Elder",
        description: "Church elder",
        churchId: church[0].churchId,
        isActive: true,
      },
      {
        name: "Treasurer",
        description: "Church treasurer",
        churchId: church[0].churchId,
        isActive: true,
      },
      {
        name: "Secretary",
        description: "Church secretary",
        churchId: church[0].churchId,
        isActive: true,
      },
    ]);

    console.log("📦 Creating giving categories...");
    await db.insert(givingCategories).values([
      {
        churchId: church[0].churchId,
        name: "Tithes",
        description: "10% of income",
        type: "tithe",
        isActive: true,
        image: "https://res.cloudinary.com/demo/image/upload/v1/tithe-icon.png",
      },
      {
        churchId: church[0].churchId,
        name: "Offerings",
        description: "Free-will offerings",
        type: "offering",
        isActive: true,
        image: "https://res.cloudinary.com/demo/image/upload/v1/offering-icon.png",
      },
      {
        churchId: church[0].churchId,
        name: "Building Fund",
        description: "Church building fund",
        type: "special",
        isActive: true,
        image: "https://res.cloudinary.com/demo/image/upload/v1/building-icon.png",
      },
    ]);

    console.log("📦 Creating expense categories...");
    await db.insert(expenseCategories).values([
      {
        churchId: church[0].churchId,
        name: "Utilities",
        description: "Electricity, water, internet",
        isActive: true,
        image: "https://res.cloudinary.com/demo/image/upload/v1/utilities-icon.png",
      },
      {
        churchId: church[0].churchId,
        name: "Salaries",
        description: "Staff and pastor salaries",
        isActive: true,
        image: "https://res.cloudinary.com/demo/image/upload/v1/salary-icon.png",
      },
      {
        churchId: church[0].churchId,
        name: "Ministry Expenses",
        description: "Outreach and ministry costs",
        isActive: true,
        image: "https://res.cloudinary.com/demo/image/upload/v1/ministry-icon.png",
      },
    ]);

    console.log("📧 Creating unregistered users (email + role only)...");
    const tokenExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    await db.insert(unregisteredUsers).values([
      {
        email: "emmanuelmose806@gmail.com",
        fullName: "Emmanuel Mose",
        role: "super_admin",
        invitationToken: "ADMIN_TOKEN_001",
        tokenExpiresAt,
        largeOrganizationId: null,
        organizationId: null,
        churchId: null,
      },
      {
        email: "emmanuelmose64@yahoo.com",
        fullName: "Emmanuel Mose",
        role: "church_admin",
        invitationToken: "CHURCH_TOKEN_002",
        tokenExpiresAt,
        largeOrganizationId: null,
        organizationId: null,
        churchId: null,
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
        email: "smallorg@example.com",
        fullName: "Small Organization Admin",
        role: "small_org_admin",
        invitationToken: "SMALL_TOKEN_004",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: null,
      },
      {
        email: "churchadmin@example.com",
        fullName: "Church Admin",
        role: "church_admin",
        invitationToken: "CHURCH_TOKEN_005",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
      {
        email: "member@example.com",
        fullName: "John Member",
        role: "church_member",
        invitationToken: "MEMBER_TOKEN_006",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
      {
        email: "pastor@example.com",
        fullName: "Pastor Peter",
        role: "pastor",
        invitationToken: "PASTOR_TOKEN_007",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
      {
        email: "treasurer@example.com",
        fullName: "Treasurer Paul",
        role: "treasurer",
        invitationToken: "TREASURER_TOKEN_008",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
      {
        email: "secretary@example.com",
        fullName: "Secretary Jane",
        role: "secretary",
        invitationToken: "SECRETARY_TOKEN_009",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
      {
        email: "elder@example.com",
        fullName: "Elder James",
        role: "elder",
        invitationToken: "ELDER_TOKEN_010",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
    ]);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📋 Unregistered Users (Must Register First):");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email                         | Role");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("emmanuelmose806@gmail.com      | super_admin");
    console.log("emmanuelmose64@yahoo.com       | church_admin");
    console.log("largeorg@example.com           | large_org_admin");
    console.log("smallorg@example.com           | small_org_admin");
    console.log("churchadmin@example.com        | church_admin");
    console.log("member@example.com             | church_member");
    console.log("pastor@example.com             | pastor");
    console.log("treasurer@example.com          | treasurer");
    console.log("secretary@example.com          | secretary");
    console.log("elder@example.com              | elder");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🔑 Users can register with just email and password.");
    console.log("   Email must exist in unregisteredUsers table first.");
    console.log("\n🎉 Seed completed!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed.");
    console.error(error);
    process.exit(1);
  }
}

seed();