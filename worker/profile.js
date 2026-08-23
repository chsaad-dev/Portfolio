export const PROFILE = {
  name: "Muhammad Saad",
  role: "Android Developer",
  location: "Sahiwal, Pakistan",
  education: [
    "BS Software Engineering, COMSATS University Islamabad, Sahiwal Campus (Graduated July 2026, CGPA 3.14/4.00)"
  ],
  certifications: [
    "Meta Android Developer Certificate",
    "Google UX Design Professional Certificate",
    "AI For Everyone by DeepLearning.AI",
    "Design Thinking For Innovation (By University of Virginia & Darden School of Business)"
  ],
  stack: [
    "Kotlin", "Java", "Jetpack Compose", "MVVM / Clean Architecture",
    "Room Database", "Coroutines", "Retrofit",
    "Firebase (Auth, Firestore, Realtime DB, Storage, FCM, Crashlytics, Remote Config, Hosting)",
  ],
  projects: [
    { name: "GiveEase", desc: "Verified donation platform connecting donors and NGOs, ID-verified trust system, real-time impact tracking.", tech: "Kotlin, Firebase Auth, Firestore, Storage, MVVM", role: "Team Lead — Final Year Project (2024-2026)" },
    { name: "SpendWise", desc: "Offline-first expense tracker, local PDF reports, zero data leaves device.", tech: "Kotlin, Jetpack Compose, Room, Material 3", role: "Personal Project (2025-2026)" },
    { name: "FindCircle", desc: "Lost & found community app with real-time location mapping and image-based matching.", tech: "Kotlin, MVVM, Coroutines, FCM", role: "Personal Project (2025-2026)" },
    { name: "CampusConnect", desc: "Social campus app with an integrated Gemini AI assistant via Cloudflare Workers and a live web admin console.", tech: "Kotlin, MVVM Clean, Hilt, Firebase, Room, Gemini AI", role: "Full Stack & Android Lead (2025-2026)" },
    { name: "NoteSync", desc: "Offline-first notes app with cloud sync and hardware-backed AES encryption.", tech: "Flutter, Riverpod, Isar DB, Firebase, AES", role: "Cross-Platform Engineer (2025-2026)" }
  ],
  contact: {
    github: "github.com/chsaad-dev",
    linkedin: "linkedin.com/in/muhammad-saad075",
    email: "saaddevlabs@gmail.com",
    resume: "muhammadsaad-portfolio.web.app/muhammad-saad-android-developer-resume.pdf"
  },
  availability: "Open to freelance and full-time Android roles"
};

export function buildSystemPrompt(p) {
  return `You are the AI assistant on ${p.name}'s portfolio website.
Answer ONLY questions about ${p.name}, his skills, and his projects.
If asked anything unrelated, politely say you can only answer questions about ${p.name}.

PROFILE:
- ${p.role}, ${p.location}
- Education: ${p.education.join("; ")}
- Certifications: ${p.certifications.join(", ")}
- Stack: ${p.stack.join(", ")}

PROJECTS:
${p.projects.map((pr, i) => `${i + 1}. ${pr.name} — ${pr.desc} Tech: ${pr.tech}. ${pr.role}.`).join("\n")}

CONTACT:
- GitHub: ${p.contact.github}
- LinkedIn: ${p.contact.linkedin}
- Email: ${p.contact.email}
- Resume: ${p.contact.resume}

${p.availability}

Keep answers short and conversational. Encourage recruiters/clients to check GitHub or email him for hiring.`;
}
