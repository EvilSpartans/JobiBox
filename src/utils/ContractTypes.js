export const ContractTypes = {
    France: [
      { value: "CDI", label: "CDI" },
      { value: "CDD", label: "CDD" },
      { value: "Alternance", label: "Alternance" },
      { value: "Stage", label: "Stage" },
      { value: "Freelance", label: "Freelance" },
      { value: "Intérim", label: "Intérim" },
      { value: "Vie", label: "Volontariat International en Entreprise (VIE)" },
      { value: "Statutaire", label: "Contrat Statutaire" },
      { value: "Franchise", label: "Franchise" },
      { value: "Saisonnier", label: "Contrat Saisonnier" },
      { value: "Volontaire", label: "Volontaire" },
      { value: "Formation", label: "Formation" }
    ],
    Belgique: [
      { value: "CDI", label: "CDI" },
      { value: "CDD", label: "CDD" },
      { value: "Intérim", label: "Contrat Intérimaire" },
      { value: "Freelance", label: "Freelance" },
      { value: "Stage", label: "Stage" },
      { value: "Alternance", label: "Contrat d'Alternance" },
      { value: "Contrat de remplacement", label: "Contrat de Remplacement" },
      { value: "Contrat étudiant", label: "Contrat Étudiant" },
      { value: "Contrat saisonnier", label: "Contrat Saisonnier" }
    ],
    Suisse: [
      { value: "CDI", label: "Contrat de Travail à Durée Indéterminée" },
      { value: "CDD", label: "Contrat de Travail à Durée Déterminée" },
      { value: "Freelance", label: "Freelance" },
      { value: "Stage", label: "Stage" },
      { value: "Intérim", label: "Contrat Temporaire" },
      { value: "Contrat d'apprentissage", label: "Contrat d'Apprentissage" },
      { value: "Contrat étudiant", label: "Contrat Étudiant" },
      { value: "Contrat saisonnier", label: "Contrat Saisonnier" }
    ],
    Allemagne: [
      { value: "Unbefristeter Vertrag", label: "Unbefristeter Arbeitsvertrag" },
      { value: "Befristeter Vertrag", label: "Befristeter Arbeitsvertrag" },
      { value: "Freelance", label: "Freiberuflich/Freelance" },
      { value: "Praktikum", label: "Praktikum" },
      { value: "Zeitarbeit", label: "Zeitarbeitsvertrag" },
      { value: "Ausbildungsvertrag", label: "Ausbildungsvertrag" },
      { value: "Werkstudentenvertrag", label: "Werkstudentenvertrag" },
      { value: "Saisonarbeit", label: "Saisonarbeitsvertrag" }
    ],
    Luxembourg: [
      { value: "CDI", label: "CDI" },
      { value: "CDD", label: "CDD" },
      { value: "Intérim", label: "Contrat Intérimaire" },
      { value: "Freelance", label: "Freelance" },
      { value: "Stage", label: "Stage" },
      { value: "Contrat d'apprentissage", label: "Contrat d'Apprentissage" },
      { value: "Contrat étudiant", label: "Contrat Étudiant" },
      { value: "Contrat saisonnier", label: "Contrat Saisonnier" }
    ],
    "Pays-Bas": [
      { value: "Vast contract", label: "Vast contract" },
      { value: "Tijdelijk contract", label: "Tijdelijk contract" },
      { value: "Freelance", label: "Freelance (ZZP)" },
      { value: "Stage", label: "Stage" },
      { value: "Uitzendcontract", label: "Uitzendcontract" },
      { value: "Leerwerkcontract", label: "Leerwerkcontract" },
      { value: "Bijbaan", label: "Bijbaan" },
      { value: "Seizoenswerk", label: "Seizoenswerk" }
    ],
    Italie: [
      { value: "Contratto a tempo indeterminato", label: "Contratto a Tempo Indeterminato" },
      { value: "Contratto a tempo determinato", label: "Contratto a Tempo Determinato" },
      { value: "Freelance", label: "Lavoro Autonomo/Freelance" },
      { value: "Stage", label: "Tirocinio" },
      { value: "Lavoro interinale", label: "Lavoro Interinale" },
      { value: "Apprendistato", label: "Contratto di Apprendistato" },
      { value: "Contratto stagionale", label: "Contratto Stagionale" },
      { value: "Contratto a progetto", label: "Contratto a Progetto" }
    ],
    Espagne: [
      { value: "Contrato indefinido", label: "Contrato Indefinido" },
      { value: "Contrato temporal", label: "Contrato Temporal" },
      { value: "Freelance", label: "Autónomo/Freelance" },
      { value: "Prácticas", label: "Prácticas" },
      { value: "Contrato de interinidad", label: "Contrato de Interinidad" },
      { value: "Contrato de formación", label: "Contrato de Formación" },
      { value: "Contrato de obra o servicio", label: "Contrato de Obra o Servicio" },
      { value: "Contrato a tiempo parcial", label: "Contrato a Tiempo Parcial" },
      { value: "Contrato de trabajo fijo discontinuo", label: "Contrato de Trabajo Fijo Discontinuo" }
    ]
  };
  
  export const getContractTypesByCountry = (country) => {
    return ContractTypes[country] || [];
  };
  