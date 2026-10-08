export interface StepDefinition {
  id: string;
  titleEN: string;
  titleID: string;
  tipEN: string;
  tipID: string;
  expectedArea: string;
  skippable: boolean;
  safetyNoteEN?: string;
  safetyNoteID?: string;
  exampleImage?: string;
}

export const STEPS: StepDefinition[] = [
  {
    id: "front_exterior",
    titleEN: "Front exterior",
    titleID: "Eksterior depan",
    tipEN: "Stand back far enough to show the whole facade and roof edge.",
    tipID: "Mundur cukup jauh agar seluruh tampak depan dan tepi atap terlihat.",
    expectedArea: "Front exterior of the property including facade and roof edge",
    skippable: true,
    exampleImage: "/images/hero-property.jpg",
  },
  {
    id: "side_back_exterior",
    titleEN: "Side/back exterior and drainage",
    titleID: "Eksterior samping/belakang dan drainase",
    tipEN: "Show the side or back wall and the ground beside it, including drains or ditches.",
    tipID: "Tampilkan dinding samping atau belakang beserta tanah di sekitarnya, termasuk saluran air atau selokan.",
    expectedArea: "Side or back exterior wall and ground drainage",
    skippable: true,
    exampleImage: "/images/foundation-drainage.jpg",
  },
  {
    id: "roofline",
    titleEN: "Roofline / eaves",
    titleID: "Garis atap / teritisan",
    tipEN: "Look up at the roof edge and ceiling overhang. Note sagging, missing tiles, or stains under the eaves.",
    tipID: "Lihat ke atas pada tepi atap dan langit-langit yang menjorok. Perhatikan bagian yang melorot, genteng hilang, atau noda di bawah teritisan.",
    expectedArea: "Roofline, eaves and ceiling overhang",
    skippable: true,
  },
  {
    id: "lower_wall",
    titleEN: "Lower exterior wall and foundation",
    titleID: "Dinding luar bagian bawah dan fondasi",
    tipEN: "Crouch and photograph the bottom of the wall. Look for cracks, damp marks, peeling paint, or mud trails (termites).",
    tipID: "Jongkok dan foto bagian bawah dinding. Cari retakan, bekas lembap, cat mengelupas, atau jalur lumpur (rayap).",
    expectedArea: "Lower exterior wall and foundation area",
    skippable: true,
    exampleImage: "/images/foundation-drainage.jpg",
  },
  {
    id: "living_ceiling",
    titleEN: "Living room ceiling",
    titleID: "Plafon ruang tamu",
    tipEN: "Point the camera up so the full ceiling is visible, including corners.",
    tipID: "Arahkan kamera ke atas agar seluruh plafon terlihat, termasuk sudut-sudutnya.",
    expectedArea: "Living room ceiling including corners",
    skippable: true,
    exampleImage: "/images/living-ceiling.jpg",
  },
  {
    id: "walls_corners",
    titleEN: "Walls and corners",
    titleID: "Dinding dan sudut",
    tipEN: "Photograph a wall including the corner where two walls and the ceiling meet. Include any cracks or marks.",
    tipID: "Foto dinding termasuk sudut pertemuan dua dinding dan plafon. Sertakan retakan atau tanda apapun.",
    expectedArea: "Interior walls and corner joints where walls meet ceiling",
    skippable: true,
  },
  {
    id: "windows_doors",
    titleEN: "Windows and door frames",
    titleID: "Jendela dan kusen pintu",
    tipEN: "Show the frame edges. For wooden frames, include the bottom corners.",
    tipID: "Tampilkan tepi kusen. Untuk kusen kayu, sertakan sudut bawahnya.",
    expectedArea: "Window and door frames including edges and bottom corners",
    skippable: true,
  },
  {
    id: "bathroom",
    titleEN: "Bathroom ceiling and shower area",
    titleID: "Plafon kamar mandi dan area shower",
    tipEN: "Show the ceiling above the shower and the wall/tile joints.",
    tipID: "Tampilkan plafon di atas shower dan sambungan dinding/ubin.",
    expectedArea: "Bathroom ceiling above shower area and wall/tile joints",
    skippable: true,
    exampleImage: "/images/bathroom-tiles.jpg",
  },
  {
    id: "under_sink",
    titleEN: "Under-sink plumbing",
    titleID: "Pipa di bawah wastafel",
    tipEN: "Open the cabinet under the sink and show the pipes and the cabinet floor.",
    tipID: "Buka kabinet di bawah wastafel dan tampilkan pipa serta lantai kabinet.",
    expectedArea: "Under-sink plumbing pipes and cabinet floor",
    skippable: true,
  },
  {
    id: "electrical_panel",
    titleEN: "Electrical panel (MCB box)",
    titleID: "Panel listrik (kotak MCB)",
    tipEN: "Open the panel cover if safe to do so and photograph the whole box. Do not touch any wiring.",
    tipID: "Buka penutup panel jika aman dan foto seluruh kotak. Jangan menyentuh kabel apapun.",
    expectedArea: "Electrical panel / MCB box",
    skippable: true,
    safetyNoteEN: "Do not touch any wiring.",
    safetyNoteID: "Jangan menyentuh kabel.",
    exampleImage: "/images/electrical-panel.jpg",
  },
];

export const EXTRA_STEP = {
  id: "extra",
  titleEN: "Anything that looks damaged or unusual",
  titleID: "Hal apapun yang terlihat rusak atau tidak biasa",
  tipEN: "Add photos of anything that looks damaged or unusual.",
  tipID: "Tambahkan foto area yang terlihat rusak atau tidak biasa.",
  expectedArea: "Area that appears damaged or unusual as identified by the buyer",
  skippable: true,
};

export const VALID_STEP_IDS = [...STEPS.map((s) => s.id), "extra"];
