import { EducationLevel, EducationOption } from "../models/Education";

export const EducationLevels: EducationLevel = {
    France: [
      { value: "Brevet", label: "Brevet" },
      { value: "CAP, BEP", label: "CAP, BEP" },
      { value: "Baccalauréat", label: "Baccalauréat" },
      { value: "DEUG, BTS, DUT, DEUST", label: "DEUG, BTS, DUT, DEUST" },
      { value: "Licence, licence professionnelle, BUT", label: "Licence, licence professionnelle, BUT" },
      { value: "Maîtrise", label: "Maîtrise" },
      { value: "Master, diplôme d'ingénieur", label: "Master, diplôme d'ingénieur" },
      { value: "Doctorat", label: "Doctorat" }
    ],
    Suisse: [
      { value: "Certificat de fin d'études secondaires (équivalent au Brevet)", label: "Certificat de fin d'études secondaires (équivalent au Brevet)" },
      { value: "Certificat fédéral de capacité (CFC)", label: "Certificat fédéral de capacité (CFC)" },
      { value: "Maturité gymnasiale", label: "Maturité gymnasiale" },
      { value: "Maturité professionnelle", label: "Maturité professionnelle" },
      { value: "Bachelor", label: "Bachelor" },
      { value: "Master", label: "Master" },
      { value: "Doctorat", label: "Doctorat" }
    ],
    Allemagne: [
      { value: "Hauptschulabschluss", label: "Hauptschulabschluss" },
      { value: "Realschulabschluss", label: "Realschulabschluss" },
      { value: "Abitur", label: "Abitur" },
      { value: "Berufsabschluss", label: "Berufsabschluss" },
      { value: "Bachelor", label: "Bachelor" },
      { value: "Master", label: "Master" },
      { value: "Promotion (Doctorat)", label: "Promotion (Doctorat)" }
    ],
    Belgique: [
      { value: "Certificat d'enseignement secondaire inférieur (CESI)", label: "Certificat d'enseignement secondaire inférieur (CESI)" },
      { value: "Certificat d'enseignement secondaire supérieur (CESS)", label: "Certificat d'enseignement secondaire supérieur (CESS)" },
      { value: "Certificat d'enseignement secondaire technique ou professionnel", label: "Certificat d'enseignement secondaire technique ou professionnel" },
      { value: "Bachelier professionnalisant", label: "Bachelier professionnalisant" },
      { value: "Bachelier de transition", label: "Bachelier de transition" },
      { value: "Master", label: "Master" },
      { value: "Master complémentaire", label: "Master complémentaire" },
      { value: "Doctorat", label: "Doctorat" }
    ],
    Portugal: [
      { value: "Diploma do Ensino Básico", label: "Diploma do Ensino Básico" },
      { value: "Diploma do Ensino Secundário", label: "Diploma do Ensino Secundário" },
      { value: "Curso Técnico Profissional", label: "Curso Técnico Profissional" },
      { value: "Licenciatura (Bachelor)", label: "Licenciatura (Bachelor)" },
      { value: "Mestrado (Master)", label: "Mestrado (Master)" },
      { value: "Doutoramento (Doctorat)", label: "Doutoramento (Doctorat)" }
    ],
    Espagne: [
      { value: "Educación Secundaria Obligatoria (ESO)", label: "Educación Secundaria Obligatoria (ESO)" },
      { value: "Bachillerato", label: "Bachillerato" },
      { value: "Formación Profesional (FP)", label: "Formación Profesional (FP)" },
      { value: "Grado (Bachelor)", label: "Grado (Bachelor)" },
      { value: "Máster", label: "Máster" },
      { value: "Doctorado", label: "Doctorado" }
    ],
    Luxembourg: [
      { value: "Diplôme de fin d’études secondaires", label: "Diplôme de fin d’études secondaires" },
      { value: "Diplôme de technicien", label: "Diplôme de technicien" },
      { value: "Certificat de capacité professionnelle (CCP)", label: "Certificat de capacité professionnelle (CCP)" },
      { value: "Bachelor", label: "Bachelor" },
      { value: "Master", label: "Master" },
      { value: "Doctorat", label: "Doctorat" }
    ],
    "Pays-Bas": [
      { value: "Diploma Voortgezet Onderwijs (VMBO, HAVO, VWO)", label: "Diploma Voortgezet Onderwijs (VMBO, HAVO, VWO)" },
      { value: "Middelbaar Beroepsonderwijs (MBO)", label: "Middelbaar Beroepsonderwijs (MBO)" },
      { value: "Hoger Beroepsonderwijs (HBO - Bachelor)", label: "Hoger Beroepsonderwijs (HBO - Bachelor)" },
      { value: "Wetenschappelijk Onderwijs (WO - Bachelor)", label: "Wetenschappelijk Onderwijs (WO - Bachelor)" },
      { value: "Master (HBO/WO)", label: "Master (HBO/WO)" },
      { value: "Doctorat (PhD)", label: "Doctorat (PhD)" }
    ]
  };
  
  export const getEducationLevelsByCountry = (country: string): EducationOption[] => {
    return EducationLevels[country] || [];
  };
  