/** @typedef {'all' | 'beginner' | 'confirmed' | 'experienced' | 'skills' | 'no_photo'} CvTemplateCategoryId */

/** @type {readonly CvTemplateCategoryId[]} */
export const CV_TEMPLATE_CATEGORY_IDS = [
  "all",
  "beginner",
  "confirmed",
  "experienced",
  "skills",
  "no_photo",
];

/** @type {Record<Exclude<CvTemplateCategoryId, 'all'>, readonly string[]>} */
export const CV_TEMPLATE_CATEGORY_SLUGS = {
  beginner: [
    "template3",
    "template8",
    "template9",
    "template11",
    "template13",
    "template14",
    "template16",
  ],
  confirmed: [
    "template1",
    "template5",
    "template6",
    "template10",
    "template12",
  ],
  experienced: ["template2", "template4", "template7", "template15"],
  skills: ["template9", "template15"],
  no_photo: ["template6", "template8", "template9"],
};

/**
 * @template {{ key: string }} T
 * @param {T[]} templates
 * @param {CvTemplateCategoryId} categoryId
 * @returns {T[]}
 */
export function filterTemplatesByCategory(templates, categoryId) {
  if (categoryId === "all") return [...templates];
  const slugs = new Set(CV_TEMPLATE_CATEGORY_SLUGS[categoryId]);
  return templates.filter((t) => slugs.has(t.key));
}

/**
 * @template {{ key: string }} T
 * @param {T[]} allowedTemplates
 * @returns {CvTemplateCategoryId[]}
 */
export function getVisibleCategoryIds(allowedTemplates) {
  /** @type {CvTemplateCategoryId[]} */
  const ids = ["all"];
  for (const cat of CV_TEMPLATE_CATEGORY_IDS) {
    if (cat === "all") continue;
    if (filterTemplatesByCategory(allowedTemplates, cat).length > 0) {
      ids.push(cat);
    }
  }
  return ids;
}

/**
 * @template {{ key: string }} T
 * @param {T[]} allowedTemplates
 * @param {CvTemplateCategoryId} categoryId
 * @returns {T[]}
 */
export function buildDisplayTemplates(allowedTemplates, categoryId) {
  return filterTemplatesByCategory(allowedTemplates, categoryId);
}
