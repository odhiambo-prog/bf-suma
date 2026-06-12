export interface Product {
  code: string;
  name: string;
  category: string;
}

export const CATEGORIES = [
  "Better life",
  "Bone & Joint Care",
  "Cardiovascular Health",
  "Digestive Health",
  "Immune Boosters",
  "Premium Selected",
  "Registration",
  "Smart Kids",
  "Suma Living",
  "Anti-Aging"
];

export const PRODUCTS: Product[] = [
  // Immune Boosters
  { code: "AP013C", name: "Pure & Broken Ganoderma Spores", category: "Immune Boosters" },
  { code: "AP117A", name: "Pure & Broken Ganoderma Spores", category: "Immune Boosters" },
  { code: "AP147B", name: "Pure & Broken Ganoderma Oil", category: "Immune Boosters" },
  { code: "AP014F", name: "Refined Yunzhi Essence", category: "Immune Boosters" },
  { code: "AP153A", name: "Quad Reishi", category: "Immune Boosters" },
  { code: "AP028F", name: "4-in-1 Ginseng Coffee", category: "Immune Boosters" },
  { code: "AP011F", name: "4-in-1 Reishi Coffee", category: "Immune Boosters" },
  { code: "AP039F", name: "4-in-1 Cordyceps Coffee", category: "Immune Boosters" },
  
  // Premium Selected
  { code: "AP116E", name: "YOUTHEVER", category: "Premium Selected" },
  { code: "AP144A", name: "NMN Coffee", category: "Premium Selected" },
  { code: "AP145A", name: "NMN Sharp Mind", category: "Premium Selected" },
  { code: "AP146A", name: "NMN Duo Release", category: "Premium Selected" },
  
  // Bone & Joint Care
  { code: "AP015E", name: "GluzoJoint-F™ Capsules", category: "Bone & Joint Care" },
  { code: "AP190A", name: "GluzoJoint-Ultra Pro", category: "Bone & Joint Care" },
  { code: "AP022A", name: "ArthroXtra™ Tablets", category: "Bone & Joint Care" },
  { code: "AP107E", name: "ZaminoCal™ Capsules", category: "Bone & Joint Care" },
  
  // Cardiovascular Health
  { code: "AP004E", name: "Micro2™ Cycle Tablets", category: "Cardiovascular Health" },
  { code: "AP077E", name: "CereBrain", category: "Cardiovascular Health" },
  { code: "AP081E", name: "Relivin™ Tea", category: "Cardiovascular Health" },
  { code: "AP152A", name: "GymEffect", category: "Cardiovascular Health" },
  { code: "AP169A", name: "Detoxilive Pro Oil Capsules", category: "Cardiovascular Health" },
  
  // Digestive Health
  { code: "AP006E", name: "ConstiRelax™ Solution", category: "Digestive Health" },
  { code: "AP030A", name: "NTDiarr (1 dozen)", category: "Digestive Health" },
  { code: "AP041E", name: "Novel Depile™ Capsules", category: "Digestive Health" },
  { code: "AP099E", name: "Probio3", category: "Digestive Health" },
  { code: "AP100E", name: "Veggie Veggie Bioenzyme", category: "Digestive Health" },
  { code: "AP102E", name: "Ez-Xlim™ Tablets", category: "Digestive Health" },
  { code: "AP118F", name: "Elements", category: "Digestive Health" },
  
  // Better life
  { code: "AP009F", name: "ProstatRelax™ Capsules", category: "Better life" },
  { code: "AP029E", name: "X Power Man Capsules-New", category: "Better life" },
  { code: "AP113A", name: "X Power Coffee for Men", category: "Better life" },
  { code: "AP074E", name: "Feminergy Capsules", category: "Better life" },
  { code: "AP179D", name: "FemiBiotics", category: "Better life" },
  { code: "AP192C", name: "FemiCalcium D3", category: "Better life" },
  
  // Anti-Aging
  { code: "CP201", name: "Youth Refreshing Facial Cleanser", category: "Anti-Aging" },
  { code: "CP202", name: "Youth Essence Lotion", category: "Anti-Aging" },
  { code: "CP203", name: "Youth Essence Toner", category: "Anti-Aging" },
  { code: "CP204", name: "Youth Essence Facial Mask", category: "Anti-Aging" },
  { code: "CP205", name: "Youth Essence Cream", category: "Anti-Aging" },
  
  // Suma Living
  { code: "AP024E", name: "Anatic™ Herbal Essence Soap", category: "Suma Living" },
  { code: "AP052A", name: "FemiCare (FEMININE CLEANSER)", category: "Suma Living" },
  { code: "AP101E", name: "ToothPaste", category: "Suma Living" },
  { code: "AP131A", name: "Cool Roll (1 dozen)", category: "Suma Living" },
  
  // Smart Kids
  { code: "AP024E", name: "Vitamin C Chewable Tablets", category: "Smart Kids" },
  { code: "AP101E", name: "Calcium & Vitamin D3 Milk Tablets", category: "Smart Kids" },
  { code: "AP131A", name: "Blueberry Chewable Tablets for Sharp Vision", category: "Smart Kids" },
];
