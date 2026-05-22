export interface Law {
  type: string;
  title: string;
}

export interface Country {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  focalPoint: string;
  email: string;
  laws: {
    femme: Law[];
    enfant: Law[];
    vbg: Law[];
  };
}

export const COUNTRIES: Country[] = [
  {
    id: "cm", name: "Cameroun", region: "Afrique", lat: 3.848, lng: 11.502,
    focalPoint: "Point focal Cameroun", email: "cameroun@hcs-m26.org",
    laws: {
      femme: [{ type: "Code pénal", title: "Code pénal - Violence conjugale" }],
      enfant: [{ type: "Loi", title: "Loi sur la protection de l'enfant" }],
      vbg: [{ type: "Décret", title: "Décret anti-VBG 2023" }]
    }
  },
  {
    id: "sn", name: "Sénégal", region: "Afrique", lat: 14.497, lng: -14.452,
    focalPoint: "Point focal Sénégal", email: "senegal@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi", title: "Loi sur l'égalité de genre" }],
      enfant: [{ type: "Code", title: "Code de l'enfant" }],
      vbg: [{ type: "Loi", title: "Loi contre les violences basées sur le genre" }]
    }
  },
  {
    id: "ci", name: "Côte d'Ivoire", region: "Afrique", lat: 7.539, lng: -5.547,
    focalPoint: "Point focal CI", email: "cotedivoire@hcs-m26.org",
    laws: {
      femme: [{ type: "Code pénal", title: "Dispositions sur les droits de la femme" }],
      enfant: [{ type: "Loi", title: "Protection de l'enfance" }],
      vbg: [{ type: "Loi", title: "Lutte contre les mutilations génitales" }]
    }
  },
  {
    id: "ma", name: "Maroc", region: "Afrique", lat: 31.791, lng: -7.092,
    focalPoint: "Point focal Maroc", email: "maroc@hcs-m26.org",
    laws: {
      femme: [{ type: "Moudawwana", title: "Code de la famille réformé" }],
      enfant: [{ type: "Loi", title: "Droits de l'enfant" }],
      vbg: [{ type: "Loi 103-13", title: "Lutte contre les violences faites aux femmes" }]
    }
  },
  {
    id: "tn", name: "Tunisie", region: "Afrique", lat: 33.886, lng: 9.537,
    focalPoint: "Point focal Tunisie", email: "tunisie@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi organique", title: "Loi 2017-58 contre les violences" }],
      enfant: [{ type: "Code", title: "Code de protection de l'enfant" }],
      vbg: [{ type: "Décret", title: "Mécanismes de protection VBG" }]
    }
  },
  {
    id: "dz", name: "Algérie", region: "Afrique", lat: 28.033, lng: 1.659,
    focalPoint: "Point focal Algérie", email: "algerie@hcs-m26.org",
    laws: {
      femme: [{ type: "Code de la famille", title: "Droits des femmes mariées" }],
      enfant: [{ type: "Loi", title: "Protection de l'enfance 2015" }],
      vbg: [{ type: "Code pénal", title: "Article 266 - violences conjugales" }]
    }
  },
  {
    id: "ga", name: "Gabon", region: "Afrique", lat: -0.803, lng: 11.609,
    focalPoint: "Point focal Gabon", email: "gabon@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi", title: "Égalité homme-femme" }],
      enfant: [{ type: "Code civil", title: "Droits de l'enfant gabonais" }],
      vbg: [{ type: "Loi", title: "Prévention et répression des VBG" }]
    }
  },
  {
    id: "bf", name: "Burkina Faso", region: "Afrique", lat: 12.364, lng: -1.533,
    focalPoint: "Point focal Burkina", email: "burkina@hcs-m26.org",
    laws: {
      femme: [{ type: "Code des personnes", title: "Droits de la femme" }],
      enfant: [{ type: "Loi", title: "Code de l'enfant burkinabè" }],
      vbg: [{ type: "Loi", title: "Lutte contre les violences" }]
    }
  },
  {
    id: "ml", name: "Mali", region: "Afrique", lat: 17.570, lng: -3.996,
    focalPoint: "Point focal Mali", email: "mali@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi", title: "Protection des droits des femmes" }],
      enfant: [{ type: "Code de protection", title: "Enfant 2002" }],
      vbg: [{ type: "Décret", title: "Stratégie nationale contre les VBG" }]
    }
  },
  {
    id: "gn", name: "Guinée", region: "Afrique", lat: 9.945, lng: -9.696,
    focalPoint: "Point focal Guinée", email: "guinee@hcs-m26.org",
    laws: {
      femme: [{ type: "Code pénal", title: "Interdiction des MGF" }],
      enfant: [{ type: "Loi", title: "Droits de l'enfant guinéen" }],
      vbg: [{ type: "Loi", title: "Violence basée sur le genre" }]
    }
  },
  {
    id: "td", name: "Tchad", region: "Afrique", lat: 15.454, lng: 18.732,
    focalPoint: "Point focal Tchad", email: "tchad@hcs-m26.org",
    laws: {
      femme: [{ type: "Code pénal", title: "Protection de la femme" }],
      enfant: [{ type: "Loi", title: "Protection enfants Tchad" }],
      vbg: [{ type: "Stratégie", title: "Plan national VBG" }]
    }
  },
  {
    id: "ne", name: "Niger", region: "Afrique", lat: 17.607, lng: 8.081,
    focalPoint: "Point focal Niger", email: "niger@hcs-m26.org",
    laws: {
      femme: [{ type: "Code civil", title: "Droits des femmes" }],
      enfant: [{ type: "Ordonnance", title: "Protection de l'enfant" }],
      vbg: [{ type: "Plan d'action", title: "VBG Niger 2022" }]
    }
  },
  {
    id: "fr", name: "France", region: "Europe", lat: 46.227, lng: 2.213,
    focalPoint: "Point focal France", email: "france@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi", title: "Loi contre les violences conjugales 2020" }],
      enfant: [{ type: "Code civil", title: "Protection de l'enfant" }],
      vbg: [{ type: "Loi Schiappa", title: "Contre les violences sexistes" }]
    }
  },
  {
    id: "be", name: "Belgique", region: "Europe", lat: 50.503, lng: 4.469,
    focalPoint: "Point focal Belgique", email: "belgique@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi", title: "Égalité des genres" }],
      enfant: [{ type: "Décret", title: "Droits de l'enfant" }],
      vbg: [{ type: "Loi", title: "Plan national VBG Belgique" }]
    }
  },
  {
    id: "ch", name: "Suisse", region: "Europe", lat: 46.818, lng: 8.228,
    focalPoint: "Point focal Suisse", email: "suisse@hcs-m26.org",
    laws: {
      femme: [{ type: "Code civil", title: "Égalité femme-homme" }],
      enfant: [{ type: "Loi fédérale", title: "Protection de l'enfance" }],
      vbg: [{ type: "Loi", title: "Lutte contre la violence domestique" }]
    }
  },
  {
    id: "ca", name: "Canada", region: "Amériques", lat: 56.130, lng: -106.346,
    focalPoint: "Point focal Canada", email: "canada@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi fédérale", title: "Loi sur l'équité en matière d'emploi" }],
      enfant: [{ type: "Loi", title: "Code criminel - enfants" }],
      vbg: [{ type: "Stratégie", title: "Stratégie fédérale VBG" }]
    }
  },
  {
    id: "br", name: "Brésil", region: "Amériques", lat: -14.235, lng: -51.925,
    focalPoint: "Point focal Brésil", email: "bresil@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi Maria da Penha", title: "Contre la violence domestique" }],
      enfant: [{ type: "ECA", title: "Statut de l'enfant et de l'adolescent" }],
      vbg: [{ type: "Loi 13.772", title: "Violation de la vie privée" }]
    }
  },
  {
    id: "lb", name: "Liban", region: "Moyen-Orient", lat: 33.854, lng: 35.862,
    focalPoint: "Point focal Liban", email: "liban@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi 293", title: "Protection des femmes de la violence" }],
      enfant: [{ type: "Code pénal", title: "Protection de l'enfant" }],
      vbg: [{ type: "Loi", title: "Violence domestique Liban" }]
    }
  },
  {
    id: "jo", name: "Jordanie", region: "Moyen-Orient", lat: 30.585, lng: 36.238,
    focalPoint: "Point focal Jordanie", email: "jordanie@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi", title: "Protection contre la violence familiale" }],
      enfant: [{ type: "Loi", title: "Droit de la famille - enfants" }],
      vbg: [{ type: "Stratégie", title: "VBG Jordanie 2021" }]
    }
  },
  {
    id: "vn", name: "Vietnam", region: "Asie", lat: 14.058, lng: 108.277,
    focalPoint: "Point focal Vietnam", email: "vietnam@hcs-m26.org",
    laws: {
      femme: [{ type: "Loi", title: "Loi sur l'égalité des genres 2006" }],
      enfant: [{ type: "Loi", title: "Enfance 2016" }],
      vbg: [{ type: "Loi", title: "Prévention violences domestiques" }]
    }
  }
];

export const REGIONS = ["Toutes les régions", "Afrique", "Europe", "Amériques", "Moyen-Orient", "Asie"];
export const THEMES = ["Toutes thématiques", "Protection de la Femme", "Droits de l'Enfant", "Lutte contre les VBG"];
