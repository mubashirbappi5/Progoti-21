import {
  surveyFormSchema,
  normalizeBdPhone,
  BD_PHONE_REGEX,
} from "../src/lib/validations.ts";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const DEFAULT_AUTH_SECRET = "progoti-21-secret-token-key-min-32-chars-long!";
const DEFAULT_PASSWORD_HASH =
  "$2b$10$sYOYRrTlPWkLON2SYbfDE.SZl58YMlS4moYHCJcZrXdO0g0Oi4GcO";

function getSecretKey() {
  return new TextEncoder().encode(DEFAULT_AUTH_SECRET);
}

async function createSessionToken(email) {
  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());
}

async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role === "admin" && typeof payload.email === "string") {
      return { email: payload.email, role: "admin" };
    }
    return null;
  } catch {
    return null;
  }
}

async function verifyAdminCredentials(email, plainPassword) {
  if (email.toLowerCase().trim() !== "admin@progoti21.org") return false;
  return await bcrypt.compare(plainPassword, DEFAULT_PASSWORD_HASH);
}

async function runTestSuite() {
  console.log("=========================================");
  console.log("🧪 PROGOTI 21 PLATFORM TEST SUITE");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Phone number format tests
  console.log("--- 1. Bangladesh Phone Validation Tests ---");
  assert(BD_PHONE_REGEX.test("01712345678"), "Standard 11-digit mobile (01712345678)");
  assert(BD_PHONE_REGEX.test("+8801812345678"), "Mobile with +88 prefix (+8801812345678)");
  assert(BD_PHONE_REGEX.test("8801912345678"), "Mobile with 88 prefix (8801912345678)");
  assert(!BD_PHONE_REGEX.test("01212345678"), "Invalid operator 012 is rejected");
  assert(!BD_PHONE_REGEX.test("017123456"), "Short phone number is rejected");
  assert(!BD_PHONE_REGEX.test("12345678901"), "Non-BD prefix is rejected");

  assert(normalizeBdPhone("+8801712345678") === "01712345678", "Normalize +88017... to 017...");
  assert(normalizeBdPhone("8801812345678") === "01812345678", "Normalize 88018... to 018...");
  assert(normalizeBdPhone("01912345678") === "01912345678", "Keep standard 019...");

  // 2. Survey Form Validation Schema Tests
  console.log("\n--- 2. Form Schema Validation Tests ---");
  const validSubmission = {
    fullName: "Kamal Hossain",
    mobileNumber: "01711223344",
    preferredDate: "2nd day after Eid",
    customDate: null,
    preferredFood: "Biryani",
    customFood: null,
    mealSchedule: "Lunch + Evening Snacks",
    preferredGift: "Customized Gift Box",
    customGift: null,
    preferredActivities: [
      "Memories and Storytelling",
      "Photography and Photo Booth",
      "Batch Networking and Hangout",
    ],
    activitiesToAvoid: [
      "Long Speeches and Formalities",
      "Delayed Food Serving",
    ],
    additionalSuggestions: "Excited to meet everyone!",
  };

  const validResult = surveyFormSchema.safeParse(validSubmission);
  assert(validResult.success, "Valid standard survey submission passes Zod schema");

  // Custom Date without date picked should fail
  const customDateFail = {
    ...validSubmission,
    preferredDate: "Custom Date",
    customDate: "",
  };
  const customDateResult = surveyFormSchema.safeParse(customDateFail);
  assert(!customDateResult.success, "Custom Date without date value is properly rejected");

  // Custom Date with date picked should pass
  const customDatePass = {
    ...validSubmission,
    preferredDate: "Custom Date",
    customDate: "2027-04-12",
  };
  assert(
    surveyFormSchema.safeParse(customDatePass).success,
    "Custom Date with date value passes"
  );

  // Custom Food without specification should fail
  const customFoodFail = {
    ...validSubmission,
    preferredFood: "Custom Food Preference",
    customFood: "",
  };
  assert(
    !surveyFormSchema.safeParse(customFoodFail).success,
    "Custom Food without description is rejected"
  );

  // Exceeding 3 activities should fail
  const tooManyActivities = {
    ...validSubmission,
    preferredActivities: [
      "Cultural Program and Music",
      "Fun Games and Competitions",
      "Memories and Storytelling",
      "Photography and Photo Booth",
    ],
  };
  assert(
    !surveyFormSchema.safeParse(tooManyActivities).success,
    "Exceeding 3 activities is rejected (max 3 allowed)"
  );

  // Custom Activity without specification should fail
  const customActivityFail = {
    ...validSubmission,
    preferredActivities: ["Custom Activity"],
    customPreferredActivity: "",
  };
  assert(
    !surveyFormSchema.safeParse(customActivityFail).success,
    "Custom Activity without details is rejected"
  );

  // 3. Admin Auth and JWT Tests
  console.log("\n--- 3. Admin Authentication & JWT Tests ---");
  const authValid = await verifyAdminCredentials(
    "admin@progoti21.org",
    "Progoti21@Admin"
  );
  assert(authValid, "Admin credentials verification succeeds for default credentials");

  const authInvalid = await verifyAdminCredentials(
    "admin@progoti21.org",
    "WrongPassword123"
  );
  assert(!authInvalid, "Admin verification fails for incorrect password");

  const token = await createSessionToken("admin@progoti21.org");
  assert(typeof token === "string" && token.length > 20, "JWT session token created successfully");

  const verifiedPayload = await verifySessionToken(token);
  assert(
    verifiedPayload !== null && verifiedPayload.email === "admin@progoti21.org",
    "JWT session token successfully verified with admin role"
  );

  const fakeVerified = await verifySessionToken("invalid.token.signature");
  assert(fakeVerified === null, "Invalid JWT token rejected");

  console.log("\n=========================================");
  console.log(`Results: ${passed} PASSED, ${failed} FAILED`);
  console.log("=========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
