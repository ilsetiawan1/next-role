import type { ApplicationStatus } from "@prisma/client";
import { AI_MODELS } from "@/config/ai";
import { toVectorLiteral } from "@/utils/vector";

export interface DemoApplicationSeed {
  companyName: string;
  position: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  jobSource: string;
  keyRequirements: string[];
  jdSnapshot: string;
  status: ApplicationStatus;
  daysAgo: number;
  recruiterName: string | null;
  recruiterContact: string | null;
  targetSimilarity: number; // 0.65..0.95 -> menghasilkan matchScore pgvector realistis tanpa panggilan Gemini
}

/**
 * Menghasilkan vektor 768d deterministik dengan cosine similarity mendekati `targetSimilarity`
 * terhadap vektor basis CV demo `[1, 0, 0, ...]` (0 panggilan AI, instan saat klik Mode Demo).
 */
export function buildDemoBaseVectorLiteral(): string {
  const vec = Array.from({ length: AI_MODELS.EMBEDDING_DIMENSIONS }, (_, i) => (i === 0 ? 1 : 0));
  return toVectorLiteral(vec);
}

export function buildDemoJdVectorLiteral(targetSimilarity: number): string {
  const cos = Math.max(0.1, Math.min(0.99, targetSimilarity));
  const sin = Math.sqrt(1 - cos * cos);
  const vec = Array.from({ length: AI_MODELS.EMBEDDING_DIMENSIONS }, (_, i) => {
    if (i === 0) return cos;
    if (i === 1) return sin;
    return 0;
  });
  return toVectorLiteral(vec);
}

export const DEMO_APPLICATIONS_SEED: readonly DemoApplicationSeed[] = [
  {
    companyName: "Shopee Indonesia",
    position: "Software Engineer - Web",
    location: "Jakarta Selatan (On-Site)",
    employmentType: "Full-time",
    salaryRange: "Rp 15.000.000 - Rp 20.000.000",
    jobSource: "LinkedIn",
    keyRequirements: ["React", "Next.js", "TypeScript", "REST API"],
    jdSnapshot:
      "Mengembangkan antarmuka web marketplace Shopee dengan React & Next.js App Router. Memastikan performa responsif, kecepatan loading tinggi, dan Core Web Vitals prima. Berkolaborasi dengan tim Produk dan Backend untuk integrasi REST API yang aman.",
    status: "APPLIED",
    daysAgo: 2,
    recruiterName: "Rina Kartika",
    recruiterContact: "recruiter@shopee.co.id",
    targetSimilarity: 0.84,
  },
  {
    companyName: "Dana Indonesia",
    position: "Frontend Engineer",
    location: "Jakarta Selatan (Hybrid)",
    employmentType: "Full-time",
    salaryRange: "Rp 20.000.000 - Rp 27.000.000",
    jobSource: "LinkedIn",
    keyRequirements: ["TypeScript", "React", "Design System", "Testing"],
    jdSnapshot:
      "Membangun fitur dompet digital dan dashboard merchant menggunakan TypeScript dan React modern. Menjaga kualitas komponen UI bersama tim desain serta menulis unit test otomatis.",
    status: "APPLIED",
    daysAgo: 3,
    recruiterName: "Dimas Pratama",
    recruiterContact: "talent@dana.id",
    targetSimilarity: 0.88,
  },
  {
    companyName: "Tokopedia",
    position: "Senior Frontend Engineer",
    location: "Jakarta Selatan (Hybrid)",
    employmentType: "Full-time",
    salaryRange: "Rp 18.000.000 - Rp 25.000.000",
    jobSource: "LinkedIn",
    keyRequirements: ["Next.js", "TypeScript", "Tailwind CSS", "Performance"],
    jdSnapshot:
      "Merancang arsitektur antarmuka web berskala besar untuk ekosistem penjual Tokopedia. Mengoptimalkan bundle size, aksesibilitas, dan kolaborasi lintas tim engineering.",
    status: "FOLLOW_UP_NEEDED",
    daysAgo: 8,
    recruiterName: "Nadia Putri",
    recruiterContact: "nadia.hr@tokopedia.com",
    targetSimilarity: 0.91,
  },
  {
    companyName: "Bukalapak",
    position: "Lead Frontend Architect",
    location: "Jakarta Selatan (Remote)",
    employmentType: "Full-time",
    salaryRange: "Rp 28.000.000 - Rp 36.000.000",
    jobSource: "Glints",
    keyRequirements: ["React", "Architecture", "TypeScript", "CI/CD"],
    jdSnapshot:
      "Memimpin standar arsitektur frontend, review teknis, dan peningkatan developer experience untuk beberapa squad produk digital.",
    status: "FOLLOW_UP_NEEDED",
    daysAgo: 9,
    recruiterName: "Arief Wibowo",
    recruiterContact: "careers@bukalapak.com",
    targetSimilarity: 0.79,
  },
  {
    companyName: "GoTo Financial",
    position: "React Native Engineer",
    location: "Jakarta Selatan (Hybrid)",
    employmentType: "Full-time",
    salaryRange: "Rp 20.000.000 - Rp 26.000.000",
    jobSource: "TechInAsia",
    keyRequirements: ["React Native", "TypeScript", "GraphQL"],
    jdSnapshot:
      "Mengembangkan modul finansial mobile dengan fokus pada reliabilitas transaksi, keamanan sisi klien, dan animasi UI 60fps.",
    status: "APPLIED",
    daysAgo: 6,
    recruiterName: null,
    recruiterContact: "hiring@gotofinancial.com",
    targetSimilarity: 0.74,
  },
  {
    companyName: "Grab Indonesia",
    position: "Senior Web Engineer",
    location: "Jakarta Selatan (Hybrid)",
    employmentType: "Full-time",
    salaryRange: "Rp 22.000.000 - Rp 30.000.000",
    jobSource: "LinkedIn",
    keyRequirements: ["React", "TypeScript", "State Management", "REST API"],
    jdSnapshot:
      "Membangun platform web operasional dan portal mitra Grab. Terlibat dalam tahap user interview teknis bersama Engineering Manager.",
    status: "INTERVIEW_SCHEDULED",
    daysAgo: 11,
    recruiterName: "Sinta Dewi",
    recruiterContact: "sinta@grab.com",
    targetSimilarity: 0.89,
  },
  {
    companyName: "Traveloka",
    position: "Senior Frontend Engineer",
    location: "Tangerang (Hybrid)",
    employmentType: "Full-time",
    salaryRange: "Rp 25.000.000 - Rp 32.000.000",
    jobSource: "JobStreet",
    keyRequirements: ["Next.js", "TypeScript", "SEO", "Web Performance"],
    jdSnapshot:
      "Mengembangkan alur pemesanan tiket dan akomodasi Traveloka dengan performa tinggi. Kandidat lolos seluruh tahap wawancara dan masuk tahap penawaran.",
    status: "OFFERED",
    daysAgo: 16,
    recruiterName: "Bima Sakti",
    recruiterContact: "bima.hr@traveloka.com",
    targetSimilarity: 0.93,
  },
  {
    companyName: "Blibli",
    position: "UI Engineer",
    location: "Jakarta Barat (Hybrid)",
    employmentType: "Contract",
    salaryRange: "Rp 16.000.000 - Rp 21.000.000",
    jobSource: "Glints",
    keyRequirements: ["CSS", "Design System", "Accessibility", "React"],
    jdSnapshot:
      "Membangun dan mendokumentasikan komponen design system internal untuk seluruh aplikasi web e-commerce.",
    status: "GHOSTED",
    daysAgo: 21,
    recruiterName: null,
    recruiterContact: null,
    targetSimilarity: 0.72,
  },
];
