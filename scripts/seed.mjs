import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ Error: DATABASE_URL is not set.");
  process.exit(1);
}

const sampleParticipants = [
  {
    fullName: "Tanvir Ahmed",
    mobileNumber: "01711223344",
    preferredDate: "2nd day after Eid",
    customDate: null,
    preferredFood: "Biryani",
    customFood: null,
    mealSchedule: "Lunch + Evening Snacks",
    preferredGift: "Customized Gift Box",
    customGift: null,
    preferredActivities: ["Memories and Storytelling", "Photography and Photo Booth", "Batch Networking and Hangout"],
    activitiesToAvoid: ["Long Speeches and Formalities", "Delayed Food Serving", "Overly Formal Environment"],
    additionalSuggestions: "Looking forward to catching up with all old batchmates! Please arrange a proper photo booth.",
  },
  {
    fullName: "Nusrat Jahan",
    mobileNumber: "01819345678",
    preferredDate: "3rd day after Eid",
    customDate: null,
    preferredFood: "Morog Pulao",
    customFood: null,
    mealSchedule: "Lunch + Evening Snacks",
    preferredGift: "Only Customized T-shirt",
    customGift: null,
    preferredActivities: ["Cultural Program and Music", "Fun Games and Competitions", "Surprise Performances"],
    activitiesToAvoid: ["Long Speeches and Formalities", "Lengthy Cultural Programs"],
    additionalSuggestions: "Keep the speeches very short and sweet so we have more time to interact.",
  },
  {
    fullName: "Sabbir Hossain",
    mobileNumber: "01912987654",
    preferredDate: "2nd day after Eid",
    customDate: null,
    preferredFood: "Biryani",
    customFood: null,
    mealSchedule: "Lunch Only",
    preferredGift: "Customized Gift Box",
    customGift: null,
    preferredActivities: ["Fun Games and Competitions", "Batch Networking and Hangout", "Award Ceremony"],
    activitiesToAvoid: ["Excessive Photo Sessions", "Repetitive Games and Competitions"],
    additionalSuggestions: "Let's make sure the sound system is top notch for batch music.",
  },
  {
    fullName: "Farhana Akter",
    mobileNumber: "01615554433",
    preferredDate: "Custom Date",
    customDate: "2027-04-10",
    preferredFood: "Fried Rice + Chicken / Other Items",
    customFood: null,
    mealSchedule: "Lunch + Evening Snacks",
    preferredGift: "Custom Gift Preference",
    customGift: "Engraved Memory Crest with Batch Logo",
    preferredActivities: ["Memories and Storytelling", "Photography and Photo Booth", "Surprise Performances"],
    activitiesToAvoid: ["Long Speeches and Formalities", "Delayed Food Serving"],
    additionalSuggestions: "A dedicated memory video reel playing on a projector would be heartwarming.",
  },
  {
    fullName: "Mahmudur Rahman",
    mobileNumber: "01512345670",
    preferredDate: "2nd day after Eid",
    customDate: null,
    preferredFood: "Biryani",
    customFood: null,
    mealSchedule: "Lunch + Evening Snacks",
    preferredGift: "Customized Gift Box",
    customGift: null,
    preferredActivities: ["Cultural Program and Music", "Batch Networking and Hangout", "Photography and Photo Booth"],
    activitiesToAvoid: ["Lengthy Cultural Programs", "Overly Formal Environment", "Delayed Food Serving"],
    additionalSuggestions: "Let's keep the vibe casual, festive, and comfortable for everyone.",
  },
];

async function seed() {
  console.log("🌱 Seeding sample submissions to Neon PostgreSQL...");
  const sql = neon(databaseUrl);

  for (const p of sampleParticipants) {
    try {
      await sql`
        INSERT INTO reunion_submissions (
          full_name, mobile_number, preferred_date, custom_date,
          preferred_food, custom_food, meal_schedule,
          preferred_gift, custom_gift,
          preferred_activities, activities_to_avoid,
          additional_suggestions
        ) VALUES (
          ${p.fullName}, ${p.mobileNumber}, ${p.preferredDate}, ${p.customDate},
          ${p.preferredFood}, ${p.customFood}, ${p.mealSchedule},
          ${p.preferredGift}, ${p.customGift},
          ${JSON.stringify(p.preferredActivities)}, ${JSON.stringify(p.activitiesToAvoid)},
          ${p.additionalSuggestions}
        )
        ON CONFLICT (mobile_number) DO NOTHING;
      `;
      console.log(`✅ Seeded: ${p.fullName} (${p.mobileNumber})`);
    } catch (e) {
      console.error(`❌ Failed seeding ${p.fullName}:`, e.message);
    }
  }

  console.log("🎉 Seeding complete!");
}

seed();

