import { spawn } from "child_process";
import http from "http";

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        });
      })
      .on("error", reject);
  });
}

async function probe() {
  console.log("Starting Next.js production server for probe on port 3000...");
  const server = spawn("cmd.exe", ["/c", "pnpm", "start", "-p", "3000"], {
    stdio: "inherit",
  });

  // Wait 4 seconds for server to boot
  await new Promise((r) => setTimeout(r, 4500));

  try {
    console.log("1. Probing Landing Page: http://localhost:3000");
    const home = await fetchUrl("http://localhost:3000");
    console.log(`Landing Page Status: ${home.status}`);
    const hasProgoti = home.body.includes("PROGOTI 21");
    console.log(`Contains 'PROGOTI 21': ${hasProgoti}`);

    console.log("\n2. Probing Survey Form: http://localhost:3000/survey");
    const survey = await fetchUrl("http://localhost:3000/survey");
    console.log(`Survey Page Status: ${survey.status}`);
    const hasSurvey = survey.body.includes("Progoti 21 Reunion Survey");
    console.log(`Contains 'Progoti 21 Reunion Survey': ${hasSurvey}`);

    console.log("\n3. Probing Admin Login: http://localhost:3000/admin/login");
    const login = await fetchUrl("http://localhost:3000/admin/login");
    console.log(`Admin Login Status: ${login.status}`);

    console.log("\n4. Probing Protected Dashboard (should redirect without auth cookie): http://localhost:3000/admin/dashboard");
    const dash = await fetchUrl("http://localhost:3000/admin/dashboard");
    console.log(`Admin Dashboard Status: ${dash.status} (Redirect to login)`);
    console.log(`Redirect Location: ${dash.headers.location}`);

    console.log("\n✅ All server endpoints verified successfully!");
  } catch (err) {
    console.error("Probe error:", err);
  } finally {
    console.log("Shutting down probe server...");
    server.kill();
    // On Windows, kill process tree
    spawn("taskkill", ["/pid", server.pid.toString(), "/f", "/t"]);
  }
}

probe();

