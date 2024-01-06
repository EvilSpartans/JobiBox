import * as Yup from "yup";

export const signUpSchema = Yup.object({
  firstname: Yup.string()
    .required("Le prénom est requis")
    .matches(/^[a-zA-Z_ ]*$/, "Caractères spécials non autorisés.")
    .min(2, "Le prénom doit contenir entre 2 et 25 caractères")
    .max(25, "Le prénom doit contenir entre 2 et 25 caractères"),
  lastname: Yup.string()
    .required("Le nom est requis")
    .matches(/^[a-zA-Z_ ]*$/, "Caractères spécials non autorisés.")
    .min(2, "Le nom doit contenir entre 2 et 25 caractères")
    .max(25, "Le nom doit contenir entre 2 et 25 caractères"),
  email: Yup.string()
    .required("L'adresse e-mail est requise.")
    .email("Adresse e-mail non valide."),
  password: Yup.string()
    .required("Le mot de passe est requis")
    .matches(
      /^[A-Za-z\d@!$%*?&]{4,}$/,
      "Le mot de passe doit contenir au moins 4 caractères."
    ),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe ne correspondent pas."
    )
    .required("La confirmation du mot de passe est requise"),
  terms: Yup.boolean().oneOf(
    [true],
    "Tu dois accepter les conditions d'utilisation."
  ),
});

export const signInSchema = Yup.object({
  email: Yup.string()
    .required("L'adresse e-mail est requise.")
    .email("Adresse e-mail non valide."),
  password: Yup.string().required("Le mot de passe est requis"),
});

export const PostSchema = Yup.object().shape(
  {
    title: Yup.string().required("Le titre est requis."),
    category: Yup.string().required("La catégorie est requise."),
    subCategory: Yup.string().when("portal", {
      is: (portal) => portal != true,
      then: () => Yup.string().required("La classification est requise."),
      otherwise: () => Yup.string().notRequired(),
    }),
    portal: Yup.boolean().when("subCategory", {
      is: (subCategory) => subCategory == "",
      then: () =>
        Yup.boolean().oneOf(
          [true],
          "Tu dois choisir une classification ou un portail."
        ),
      otherwise: () => Yup.boolean().notRequired(),
    }),
    description: Yup.string(),
    city: Yup.string(),
    salary: Yup.string().matches(
      /^[0-9, ]*$/,
      "Ce champ doit contenir uniquement des chiffres et des virgules."
    ),
    date: Yup.string().matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "La date doit être au format jj/mm/aaaa"
    ),
    contracts: Yup.string(),
    hmy: Yup.string(),
    activateComments: Yup.string(),
    remote: Yup.boolean(),
    video: Yup.string(),
    image: Yup.string(),
    cpf: Yup.boolean(),
    compagny: Yup.string(),
    formation: Yup.string(),
    businessId: Yup.boolean(),
  },
  ["subCategory", "portal"]
);

export const portalSchema = Yup.object({
  business: Yup.string().required("Le portail est requis."),
  password: Yup.string().required("Le mot de passe est requis"),
});
