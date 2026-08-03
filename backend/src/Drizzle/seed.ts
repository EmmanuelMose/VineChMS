import db from "./db";
import {
  unregisteredUsers,
  largeOrganizations,
  organizations,
  churches,
} from "./schema";

async function seed() {
  try {
    console.log("Clearing existing data...");
    await db.delete(unregisteredUsers);
    await db.delete(churches);
    await db.delete(organizations);
    await db.delete(largeOrganizations);

    console.log("Creating large organizations...");
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

    console.log("Creating small organizations...");
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

    console.log("Creating churches...");
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

    console.log("Creating unregistered users (must register first)...");
    const tokenExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    await db.insert(unregisteredUsers).values([
      {
        email: "emmanuelmose806@gmail.com",
        fullName: "Emmanuel Mose",
        role: "super_admin",
        invitationToken: "ADMIN_TOKEN_123",
        tokenExpiresAt,
        largeOrganizationId: null,
        organizationId: null,
        churchId: null,
      },
      {
        email: "emmanuelmose64@yahoo.com",
        fullName: "Emmanuel Mose",
        role: "church_admin",
        invitationToken: "CHURCH_ADMIN_456",
        tokenExpiresAt,
        largeOrganizationId: null,
        organizationId: null,
        churchId: null,
      },
      {
        email: "largeorg@example.com",
        fullName: "Large Organization Admin",
        role: "large_org_admin",
        invitationToken: "LARGE_ORG_789",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: null,
        churchId: null,
      },
      {
        email: "smallorg@example.com",
        fullName: "Small Organization Admin",
        role: "small_org_admin",
        invitationToken: "SMALL_ORG_101",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: null,
      },
      {
        email: "churchadmin@example.com",
        fullName: "Church Admin",
        role: "church_admin",
        invitationToken: "CHURCH_ADMIN_202",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
      {
        email: "member@example.com",
        fullName: "John Member",
        role: "church_member",
        invitationToken: "MEMBER_303",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
      {
        email: "pastor@example.com",
        fullName: "Pastor Peter",
        role: "pastor",
        invitationToken: "PASTOR_404",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
      {
        email: "treasurer@example.com",
        fullName: "Treasurer Paul",
        role: "treasurer",
        invitationToken: "TREASURER_505",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
      {
        email: "secretary@example.com",
        fullName: "Secretary Jane",
        role: "secretary",
        invitationToken: "SECRETARY_606",
        tokenExpiresAt,
        largeOrganizationId: largeOrg[0].largeOrganizationId,
        organizationId: org[0].organizationId,
        churchId: church[0].churchId,
      },
      {
        email: "elder@example.com",
        fullName: "Elder James",
        role: "elder",
        invitationToken: "ELDER_707",
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
    console.log("   No invitation token needed!");
    console.log("\n🎉 Seed completed!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed.");
    console.error(error);
    process.exit(1);
  }
}

seed();