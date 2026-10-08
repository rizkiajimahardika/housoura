export type Language = "id" | "en";

const strings = {
  // Header
  appName: { id: "Housoura", en: "Housoura" },

  // Landing hero
  heroHeadline: {
    id: "Tahu apa yang perlu diwaspadai sebelum Anda membeli.",
    en: "Know what to worry about before you buy.",
  },
  heroSub: {
    id: "Foto properti dengan panduan langkah demi langkah, lalu dapatkan catatan risiko visual berbasis AI tentang hal-hal yang layak diperiksa sebelum Anda memutuskan.",
    en: "Take a guided set of photos of a property and get AI-powered visual risk notes on what's worth investigating before you commit.",
  },
  ctaButton: {
    id: "Periksa Properti",
    en: "Inspect a Property",
  },

  // Trust line
  trustLine: {
    id: "Housoura membantu Anda mengenali apa yang perlu dilihat lebih dekat. Housoura tidak menggantikan inspeksi properti oleh tenaga profesional.",
    en: "Housoura helps you identify what deserves a closer look. It does not replace a professional property inspection.",
  },

  // Section: investigate
  investigateTitle: {
    id: "Jangan hanya melihat rumahnya. Selidiki.",
    en: "Don't just look at the house. Investigate it.",
  },
  investigateCopy: {
    id: "Cat baru bisa menutupi banyak hal. Housoura membantu Anda memeriksa area yang sering terlewat: plafon, sudut dinding, kusen, dan instalasi.",
    en: "A fresh coat of paint can hide a lot. Housoura helps you check areas buyers often overlook: ceilings, wall corners, door frames and installations.",
  },

  // Section: how it works
  howItWorksTitle: {
    id: "Cara kerjanya",
    en: "How it works",
  },
  howStep1: { id: "Kelilingi properti", en: "Walk through the property" },
  howStep2: { id: "Ambil foto dengan panduan", en: "Take guided photos" },
  howStep3: { id: "Housoura menganalisis", en: "Housoura analyzes your photos" },
  howStep4: { id: "Lihat apa yang perlu diperiksa", en: "See what deserves a closer look" },

  // Section: built for
  builtForTitle: {
    id: "Dibuat untuk pembelian terbesar dalam hidup Anda.",
    en: "Built for the biggest purchase of your life.",
  },
  builtForCopy: {
    id: "Housoura tidak memberi tahu Anda apakah harus membeli atau tidak. Housoura membantu Anda memahami apa yang layak diperiksa lebih lanjut.",
    en: "Housoura doesn't tell you whether to buy. It helps you understand what deserves a closer look.",
  },

  // Disclaimer
  disclaimer: {
    id: "Housoura memberikan penyaringan visual berdasarkan gambar dan informasi yang dikirimkan saja. Housoura bukan pengganti inspeksi properti berlisensi, inspeksi struktural, listrik atau plumbing, atau penilaian profesional lainnya. Cacat tersembunyi mungkin tidak terlihat dalam foto.",
    en: "Housoura provides visual screening based only on submitted images and information. It is not a substitute for a licensed property inspection, structural, electrical or plumbing inspection, or other professional assessment. Hidden defects may not be visible in photographs.",
  },

  // Privacy link
  privacyLink: { id: "Kebijakan Privasi", en: "Privacy Policy" },

  // Interactive UI strings
  viewGuidePhoto: { id: "Lihat panduan sudut foto", en: "View angle guide" },
  hideGuidePhoto: { id: "Tutup panduan foto", en: "Hide angle guide" },
  hotspotRoof: { id: "Atap & Teritisan", en: "Roofline & Eaves" },
  hotspotRoofDesc: {
    id: "Deteksi genteng melorot, kebocoran talang, dan noda rembesan bawah lisplang.",
    en: "Check for displaced tiles, gutter leaks, and water stains under eaves.",
  },
  hotspotWall: { id: "Dinding & Sambungan", en: "Walls & Joint Lines" },
  hotspotWallDesc: {
    id: "Periksa retak plesteran, rembesan kapiler, dan jalur rayap tanah.",
    en: "Screen for plaster cracks, moisture seepage, and termite mud trails.",
  },
  hotspotDrainage: { id: "Drainase & Fondasi", en: "Drainage & Foundation" },
  hotspotDrainageDesc: {
    id: "Cek kelancaran parit buangan dan kelembapan pangkal dinding.",
    en: "Inspect perimeter drain runoff and wall-to-ground moisture.",
  },
  interactiveExampleTag: {
    id: "Simulasi Hasil Skrining Housoura",
    en: "Housoura Screening Simulation",
  },
  interactiveExampleSub: {
    id: "Lihat bagaimana Housoura mengidentifikasi hal yang layak diperiksa lebih lanjut secara objektif dan hati-hati.",
    en: "See how Housoura objectively and cautiously identifies what deserves a closer look.",
  },
  interactiveTabRoof: { id: "Plafon Ruang Tamu", en: "Living Room Ceiling" },
  interactiveTabDrain: { id: "Drainase & Dinding", en: "Drainage & Lower Wall" },
  interactiveTabElectrical: { id: "Panel Listrik MCB", en: "Electrical Panel" },
  tapToExplore: { id: "Ketuk titik untuk melihat fokus skrining", en: "Tap pins to explore screening focus" },

  // Setup / Consent
  consentLabel: {
    id: "Saya mengerti foto saya akan dikirim ke penyedia AI untuk dianalisis.",
    en: "I understand my photos will be sent to an AI provider for analysis.",
  },
  propertyType: { id: "Tipe properti", en: "Property type" },
  propertyTypeHouse: { id: "Rumah", en: "House" },
  propertyTypeApartment: { id: "Apartemen", en: "Apartment" },
  propertyTypeTownhouse: { id: "Rumah kota", en: "Townhouse" },
  propertyTypeOther: { id: "Lainnya", en: "Other" },
  propertyAge: { id: "Usia properti", en: "Property age" },
  ageUnknown: { id: "Tidak diketahui", en: "Unknown" },
  ageLess5: { id: "Kurang dari 5 tahun", en: "Less than 5 years" },
  age5to10: { id: "5–10 tahun", en: "5–10 years" },
  age10to20: { id: "10–20 tahun", en: "10–20 years" },
  age20plus: { id: "Lebih dari 20 tahun", en: "20+ years" },
  askingPrice: { id: "Harga yang diminta (IDR)", en: "Asking price (IDR)" },
  location: { id: "Lokasi", en: "Location" },
  notes: { id: "Catatan", en: "Notes" },
  startButton: { id: "Mulai", en: "Start" },

  // Step flow
  stepOf: { id: "Langkah {current} dari {total}", en: "Step {current} of {total}" },
  takePhoto: { id: "Ambil Foto", en: "Take Photo" },
  chooseGallery: { id: "Pilih dari galeri", en: "Choose from gallery" },
  skip: { id: "Lewati", en: "Skip" },
  next: { id: "Lanjut", en: "Next" },
  back: { id: "Kembali", en: "Back" },
  retake: { id: "Ambil ulang", en: "Retake" },
  sendAnyway: { id: "Kirim saja", en: "Send anyway" },
  analyzing: { id: "Menganalisis...", en: "Analyzing..." },
  done: { id: "Selesai", en: "Done" },
  failed: { id: "Gagal", en: "Failed" },
  retry: { id: "Coba lagi", en: "Retry" },

  // Quality warnings
  qualityTitle: {
    id: "Kami butuh foto yang lebih jelas.",
    en: "We need a clearer photo.",
  },
  tooDark: {
    id: "Nyalakan lampu atau buka tirai.",
    en: "Turn on a light or open the curtains.",
  },
  tooBright: {
    id: "Cari area dengan cahaya lebih lembut atau kurangi pencahayaan langsung.",
    en: "Find an area with softer light or reduce direct lighting.",
  },
  blurry: {
    id: "Tahan ponsel lebih stabil dan dekatkan sedikit.",
    en: "Hold the phone steady and move a bit closer.",
  },

  // Optional extra step
  addMoreTitle: { id: "Foto tambahan", en: "Additional photos" },
  addMoreTip: {
    id: "Tambahkan foto area yang terlihat rusak atau tidak biasa.",
    en: "Add photos of anything that looks damaged or unusual.",
  },
  addMore: { id: "Tambah foto", en: "Add photo" },
  seeResults: { id: "Lihat Hasil", en: "See Results" },

  // Results
  resultsTitle: { id: "Hasil Pemeriksaan", en: "Inspection Results" },
  areasPhotographed: {
    id: "{count} dari 10 area difoto",
    en: "{count} of 10 areas photographed",
  },
  limitedCoverage: {
    id: "Cakupan terbatas: hasil ini belum lengkap.",
    en: "Limited coverage: these results are incomplete.",
  },
  noIssues: {
    id: "Tidak ada hal yang mengkhawatirkan terlihat pada foto yang dikirim.",
    en: "No obvious visual concern identified in the submitted photo.",
  },
  retakePhoto: { id: "Ambil ulang foto", en: "Retake photo" },
  notAssessed: { id: "Tidak dinilai", en: "Not assessed" },
  startOver: { id: "Mulai ulang", en: "Start over" },
  startOverConfirm: {
    id: "Apakah Anda yakin ingin memulai ulang? Semua data akan dihapus.",
    en: "Are you sure you want to start over? All data will be cleared.",
  },

  // Severity labels
  severityHigh: { id: "Prioritas tinggi", en: "High priority" },
  severityMedium: { id: "Perlu diperiksa", en: "Worth investigating" },
  severityLow: { id: "Rendah", en: "Low" },
  severityUnable: { id: "Tidak dapat dinilai", en: "Unable to assess" },

  // Confidence
  confidenceLow: { id: "Keyakinan rendah", en: "Low confidence" },
  confidenceMedium: { id: "Keyakinan sedang", en: "Medium confidence" },
  confidenceHigh: { id: "Keyakinan tinggi", en: "High confidence" },

  // Misc
  observations: { id: "Pengamatan", en: "Observations" },
  potentialIssues: { id: "Potensi masalah", en: "Potential issues" },
  explanation: { id: "Penjelasan", en: "Explanation" },
  recommendedAction: { id: "Tindakan yang disarankan", en: "Recommended action" },
  missingEvidence: { id: "Bukti yang belum ada", en: "Missing evidence" },
  skippedSteps: { id: "Langkah yang dilewati", en: "Skipped steps" },

  // Safety
  safetyNote: { id: "Jangan menyentuh kabel.", en: "Do not touch any wiring." },

  // Errors
  networkError: {
    id: "Gagal terhubung ke server. Silakan coba lagi.",
    en: "Failed to connect to the server. Please try again.",
  },
  rateLimitError: {
    id: "Terlalu banyak permintaan. Silakan tunggu beberapa saat.",
    en: "Too many requests. Please wait a moment.",
  },
  serverError: {
    id: "Terjadi kesalahan pada server. Silakan coba lagi.",
    en: "A server error occurred. Please try again.",
  },

  // Privacy page
  privacyTitle: { id: "Kebijakan Privasi", en: "Privacy Policy" },
} as const;

export type StringKey = keyof typeof strings;

export function t(key: StringKey, lang: Language, replacements?: Record<string, string | number>): string {
  const str: string = strings[key]?.[lang] ?? strings[key]?.["en"] ?? key;
  if (!replacements) return str;
  return Object.entries(replacements).reduce<string>(
    (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
    str
  );
}

export default strings;
