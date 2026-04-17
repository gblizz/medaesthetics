"use server";

import { auth } from "@repo/auth";
import { db } from "@repo/db";

export type ServiceInput = {
  name: string;
  description: string;
  durationMins: number;
  price: number; // in cents
};

export type OnboardingData = {
  practice: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    website: string;
    timezone: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    titleFont: string;
    headerFont: string;
    bodyFont: string;
  };
  location: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
  };
  provider: {
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    bio: string;
    npiNumber: string;
  };
  services: ServiceInput[];
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

export async function onboardPractice(data: OnboardingData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  // Create unique slug
  const baseSlug = generateSlug(data.practice.name);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;

  // Create the practice
  const practice = await db.practice.create({
    data: {
      name: data.practice.name,
      slug,
      phone: data.practice.phone || null,
      email: data.practice.email || null,
      website: data.practice.website || null,
      primaryColor: data.practice.primaryColor,
      secondaryColor: data.practice.secondaryColor || null,
      accentColor: data.practice.accentColor || null,
      titleFont: data.practice.titleFont || null,
      headerFont: data.practice.headerFont || null,
      bodyFont: data.practice.bodyFont || null,
      timezone: data.practice.timezone,
    },
  });

  // Create the primary location
  await db.location.create({
    data: {
      practiceId: practice.id,
      name: "Primary Location",
      addressLine1: data.location.addressLine1 || null,
      addressLine2: data.location.addressLine2 || null,
      city: data.location.city || null,
      state: data.location.state || null,
      zip: data.location.zip || null,
    },
  });

  // Create the practice owner / provider
  await db.provider.create({
    data: {
      practiceId: practice.id,
      clerkUserId: userId,
      firstName: data.provider.firstName,
      lastName: data.provider.lastName,
      email: data.provider.email,
      title: data.provider.title || null,
      bio: data.provider.bio || null,
      npiNumber: data.provider.npiNumber || null,
      role: "PRACTICE_OWNER",
    },
  });

  // Create services
  for (const svc of data.services) {
    if (!svc.name.trim()) continue;
    await db.service.create({
      data: {
        practiceId: practice.id,
        name: svc.name,
        description: svc.description || null,
        durationMins: svc.durationMins,
        price: svc.price,
      },
    });
  }

  return { success: true, practiceId: practice.id };
}
