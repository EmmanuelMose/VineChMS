import db from "./db";
import {
  users,
  largeOrganizations,
  organizations,
  churches,
  members,
  positions,
  leaders,
  services,
  givingCategories,
  expenseCategories,
  events,
  prayerRequests,
  announcements,
  groups,
  sermons,
  giving,
  unregisteredUsers,
} from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("Clearing existing data...");
    await db.delete(giving);
    await db.delete(leaders);
    await db.delete(members);
    await db.delete(churches);
    await db.delete(organizations);
    await db.delete(largeOrganizations);
    await db.delete(users);
    await db.delete(unregisteredUsers);

    console.log("Creating users...");
    const passwordHash = await bcrypt.hash("password123", 10);

    const adminUser = await db
      .insert(users)
      .values({
        email: "emmanuelmose806@gmail.com",
        passwordHash,
        fullName: "Emmanuel Mose",
        role: "super_admin",
        isActive: true,
        isVerified: true,
        verificationCode: "ADMIN123",
      })
      .returning();

    const largeOrgAdmin = await db
      .insert(users)
      .values({
        email: "largeorg@example.com",
        passwordHash,
        fullName: "Large Organization Admin",
        role: "large_org_admin",
        isActive: true,
        isVerified: true,
        verificationCode: "LARGE456",
      })
      .returning();

    const smallOrgAdmin = await db
      .insert(users)
      .values({
        email: "smallorg@example.com",
        passwordHash,
        fullName: "Small Organization Admin",
        role: "small_org_admin",
        isActive: true,
        isVerified: true,
        verificationCode: "SMALL789",
      })
      .returning();

    const churchAdmin = await db
      .insert(users)
      .values({
        email: "churchadmin@example.com",
        passwordHash,
        fullName: "Church Admin",
        role: "church_admin",
        isActive: true,
        isVerified: true,
        verificationCode: "CHURCH123",
      })
      .returning();

    const churchMember = await db
      .insert(users)
      .values({
        email: "member@example.com",
        passwordHash,
        fullName: "John Member",
        role: "church_member",
        isActive: true,
        isVerified: true,
        verificationCode: "MEMBER456",
      })
      .returning();

    const pastor = await db
      .insert(users)
      .values({
        email: "pastor@example.com",
        passwordHash,
        fullName: "Pastor Peter",
        role: "pastor",
        isActive: true,
        isVerified: true,
        verificationCode: "PASTOR789",
      })
      .returning();

    const treasurer = await db
      .insert(users)
      .values({
        email: "treasurer@example.com",
        passwordHash,
        fullName: "Treasurer Paul",
        role: "treasurer",
        isActive: true,
        isVerified: true,
        verificationCode: "TREAS123",
      })
      .returning();

    const secretary = await db
      .insert(users)
      .values({
        email: "secretary@example.com",
        passwordHash,
        fullName: "Secretary Jane",
        role: "secretary",
        isActive: true,
        isVerified: true,
        verificationCode: "SECRET123",
      })
      .returning();

    const elder = await db
      .insert(users)
      .values({
        email: "elder@example.com",
        passwordHash,
        fullName: "Elder James",
        role: "elder",
        isActive: true,
        isVerified: true,
        verificationCode: "ELDER123",
      })
      .returning();

    const secondEmail = await db
      .insert(users)
      .values({
        email: "emmanuelmose64@yahoo.com",
        passwordHash,
        fullName: "Emmanuel Mose",
        role: "church_admin",
        isActive: true,
        isVerified: true,
        verificationCode: "ADMIN456",
      })
      .returning();

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
        createdBy: adminUser[0].userId,
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
        createdBy: largeOrgAdmin[0].userId,
        maxChurches: 20,
        maxMembers: 500,
        logo: "https://res.cloudinary.com/demo/image/upload/v1/nairobi-diocese-logo.png",
      })
      .returning();

    console.log("Creating churches...");
    const church1 = await db
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
        createdBy: smallOrgAdmin[0].userId,
        maxMembers: 200,
        logo: "https://res.cloudinary.com/demo/image/upload/v1/nairobi-central-logo.png",
      })
      .returning();

    const church2 = await db
      .insert(churches)
      .values({
        name: "Westlands Fellowship",
        description: "Westlands area church",
        email: "info@westlandsfellowship.org",
        phone: "+254712345680",
        country: "Kenya",
        city: "Nairobi",
        state: "Nairobi",
        denomination: "Pentecostal",
        organizationId: org[0].organizationId,
        createdBy: smallOrgAdmin[0].userId,
        maxMembers: 150,
        logo: "https://res.cloudinary.com/demo/image/upload/v1/westlands-logo.png",
      })
      .returning();

    console.log("Creating members...");
    const member1 = await db
      .insert(members)
      .values({
        userId: churchMember[0].userId,
        churchId: church1[0].churchId,
        membershipNumber: "MEM001",
        isActive: true,
        isBaptized: true,
        isConfirmed: true,
        isLeader: false,
      })
      .returning();

    const member2 = await db
      .insert(members)
      .values({
        userId: pastor[0].userId,
        churchId: church1[0].churchId,
        membershipNumber: "MEM002",
        isActive: true,
        isBaptized: true,
        isConfirmed: true,
        isLeader: true,
      })
      .returning();

    const member3 = await db
      .insert(members)
      .values({
        userId: treasurer[0].userId,
        churchId: church1[0].churchId,
        membershipNumber: "MEM003",
        isActive: true,
        isBaptized: true,
        isConfirmed: true,
        isLeader: true,
      })
      .returning();

    const member4 = await db
      .insert(members)
      .values({
        userId: churchAdmin[0].userId,
        churchId: church1[0].churchId,
        membershipNumber: "MEM004",
        isActive: true,
        isBaptized: true,
        isConfirmed: true,
        isLeader: true,
      })
      .returning();

    const member5 = await db
      .insert(members)
      .values({
        userId: secretary[0].userId,
        churchId: church1[0].churchId,
        membershipNumber: "MEM005",
        isActive: true,
        isBaptized: true,
        isConfirmed: true,
        isLeader: true,
      })
      .returning();

    const member6 = await db
      .insert(members)
      .values({
        userId: elder[0].userId,
        churchId: church1[0].churchId,
        membershipNumber: "MEM006",
        isActive: true,
        isBaptized: true,
        isConfirmed: true,
        isLeader: true,
      })
      .returning();

    const member7 = await db
      .insert(members)
      .values({
        userId: secondEmail[0].userId,
        churchId: church1[0].churchId,
        membershipNumber: "MEM007",
        isActive: true,
        isBaptized: true,
        isConfirmed: true,
        isLeader: true,
      })
      .returning();

    console.log("Creating positions...");
    const positionsList = await db
      .insert(positions)
      .values([
        {
          name: "Senior Pastor",
          description: "Lead pastor of the church",
          churchId: church1[0].churchId,
          isActive: true,
        },
        {
          name: "Elder",
          description: "Church elder",
          churchId: church1[0].churchId,
          isActive: true,
        },
        {
          name: "Treasurer",
          description: "Church treasurer",
          churchId: church1[0].churchId,
          isActive: true,
        },
        {
          name: "Secretary",
          description: "Church secretary",
          churchId: church1[0].churchId,
          isActive: true,
        },
      ])
      .returning();

    console.log("Creating leaders...");
    await db.insert(leaders).values([
      {
        memberId: member2[0].memberId,
        positionId: positionsList[0].positionId,
        startDate: new Date(),
        isActive: true,
        isApproved: true,
        approvedBy: churchAdmin[0].userId,
        approvedAt: new Date(),
        profilePicture: "https://res.cloudinary.com/demo/image/upload/v1/pastor-peter.jpg",
      },
      {
        memberId: member6[0].memberId,
        positionId: positionsList[1].positionId,
        startDate: new Date(),
        isActive: true,
        isApproved: true,
        approvedBy: churchAdmin[0].userId,
        approvedAt: new Date(),
        profilePicture: "https://res.cloudinary.com/demo/image/upload/v1/elder-james.jpg",
      },
      {
        memberId: member3[0].memberId,
        positionId: positionsList[2].positionId,
        startDate: new Date(),
        isActive: true,
        isApproved: true,
        approvedBy: churchAdmin[0].userId,
        approvedAt: new Date(),
        profilePicture: "https://res.cloudinary.com/demo/image/upload/v1/treasurer-paul.jpg",
      },
      {
        memberId: member5[0].memberId,
        positionId: positionsList[3].positionId,
        startDate: new Date(),
        isActive: true,
        isApproved: true,
        approvedBy: churchAdmin[0].userId,
        approvedAt: new Date(),
        profilePicture: "https://res.cloudinary.com/demo/image/upload/v1/secretary-jane.jpg",
      },
    ]);

    console.log("Creating services...");
    await db.insert(services).values([
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

    console.log("Creating giving categories...");
    const givingCats = await db.insert(givingCategories).values([
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
    ]).returning();

    console.log("Creating expense categories...");
    await db.insert(expenseCategories).values([
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
    ]);

    console.log("Creating events with images...");
    await db.insert(events).values([
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
        createdBy: churchAdmin[0].userId,
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
        title: "Youth Camp",
        description: "Annual youth camp with fun activities",
        location: "Kijabe",
        startDate: new Date("2025-08-10"),
        endDate: new Date("2025-08-14"),
        status: "published",
        isPublic: true,
        maxAttendees: 100,
        createdBy: churchAdmin[0].userId,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/youth-camp-banner.jpg",
        coverImageUrl: "https://res.cloudinary.com/demo/image/upload/v1/youth-camp-cover.jpg",
        gallery: JSON.stringify([
          "https://res.cloudinary.com/demo/image/upload/v1/youth-gallery1.jpg",
          "https://res.cloudinary.com/demo/image/upload/v1/youth-gallery2.jpg",
        ]),
      },
    ]);

    console.log("Creating prayer requests...");
    await db.insert(prayerRequests).values([
      {
        churchId: church1[0].churchId,
        memberId: member1[0].memberId,
        title: "Healing for Mama Jane",
        description: "Prayer for healing of Mama Jane who is in hospital",
        status: "pending",
        visibility: "public",
        prayerCount: 5,
        image: "https://res.cloudinary.com/demo/image/upload/v1/prayer-healing.jpg",
      },
      {
        churchId: church1[0].churchId,
        memberId: member2[0].memberId,
        title: "Church Outreach",
        description: "Prayer for the upcoming outreach program",
        status: "praying",
        visibility: "public",
        prayerCount: 12,
        image: "https://res.cloudinary.com/demo/image/upload/v1/prayer-outreach.jpg",
      },
    ]);

    console.log("Creating announcements...");
    await db.insert(announcements).values([
      {
        churchId: church1[0].churchId,
        title: "Church Service Changes",
        content: "Sunday service will now start at 10:00 AM instead of 9:00 AM",
        isPublished: true,
        publishedAt: new Date(),
        createdBy: churchAdmin[0].userId,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/announcement-service.jpg",
        imagePosition: "top",
      },
      {
        churchId: church1[0].churchId,
        title: "Prayer Week",
        content: "Join us for a week of prayer starting Monday",
        isPublished: true,
        publishedAt: new Date(),
        createdBy: churchAdmin[0].userId,
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1/announcement-prayer.jpg",
        imagePosition: "cover",
      },
    ]);

    console.log("Creating groups...");
    await db.insert(groups).values([
      {
        churchId: church1[0].churchId,
        name: "Men's Fellowship",
        description: "Men's group meeting every Saturday",
        type: "fellowship",
        leaderId: member2[0].memberId,
        meetingDay: 6,
        location: "Church Hall",
        isActive: true,
      },
      {
        churchId: church1[0].churchId,
        name: "Women's Fellowship",
        description: "Women's group meeting every Friday",
        type: "fellowship",
        leaderId: member3[0].memberId,
        meetingDay: 5,
        location: "Church Hall",
        isActive: true,
      },
    ]);

    console.log("Creating sermons...");
    await db.insert(sermons).values([
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
    ]);

    console.log("Creating sample giving records...");
    await db.insert(giving).values([
      {
        memberId: member1[0].memberId,
        churchId: church1[0].churchId,
        categoryId: givingCats[0].categoryId,
        amount: "100.00",
        currency: "KES",
        type: "tithe",
        status: "completed",
        date: new Date(),
        paymentMethod: "cash",
        receiptNumber: "RCP-001",
        receiptFile: "https://res.cloudinary.com/demo/image/upload/v1/receipt-001.jpg",
      },
      {
        memberId: member2[0].memberId,
        churchId: church1[0].churchId,
        categoryId: givingCats[1].categoryId,
        amount: "50.00",
        currency: "KES",
        type: "offering",
        status: "completed",
        date: new Date(),
        paymentMethod: "cash",
        receiptNumber: "RCP-002",
        receiptFile: "https://res.cloudinary.com/demo/image/upload/v1/receipt-002.jpg",
      },
    ]);

    console.log("Database seeding completed successfully.");
    console.log("Users created:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Email                         | Role                 | Password");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("emmanuelmose806@gmail.com      | super_admin          | password123");
    console.log("emmanuelmose64@yahoo.com       | church_admin         | password123");
    console.log("largeorg@example.com           | large_org_admin      | password123");
    console.log("smallorg@example.com           | small_org_admin      | password123");
    console.log("churchadmin@example.com        | church_admin         | password123");
    console.log("member@example.com             | church_member        | password123");
    console.log("pastor@example.com             | pastor               | password123");
    console.log("treasurer@example.com          | treasurer            | password123");
    console.log("secretary@example.com          | secretary            | password123");
    console.log("elder@example.com              | elder                | password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("All users password: password123");
    console.log("🎉 Seed completed!");

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed.");
    console.error(error);
    process.exit(1);
  }
}

seed();