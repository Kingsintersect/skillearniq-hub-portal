/**
 * African countries used in registration (nationality) and for country-based
 * pricing. `code` is the ISO-3166 alpha-2 (lowercase) used by flag-icons.
 * `currency` is the ISO-4217 code, handy for regional pricing/display.
 */
export interface AfricanCountry {
    name: string;
    code: string; // ISO alpha-2, lowercase (flag-icons)
    currency: string; // ISO 4217
}

// Nigeria first (home market), then alphabetical.
export const AFRICAN_COUNTRIES: AfricanCountry[] = [
    { name: "Nigeria", code: "ng", currency: "NGN" },
    { name: "Algeria", code: "dz", currency: "DZD" },
    { name: "Angola", code: "ao", currency: "AOA" },
    { name: "Benin", code: "bj", currency: "XOF" },
    { name: "Botswana", code: "bw", currency: "BWP" },
    { name: "Burkina Faso", code: "bf", currency: "XOF" },
    { name: "Burundi", code: "bi", currency: "BIF" },
    { name: "Cabo Verde", code: "cv", currency: "CVE" },
    { name: "Cameroon", code: "cm", currency: "XAF" },
    { name: "Central African Republic", code: "cf", currency: "XAF" },
    { name: "Chad", code: "td", currency: "XAF" },
    { name: "Comoros", code: "km", currency: "KMF" },
    { name: "Congo (Brazzaville)", code: "cg", currency: "XAF" },
    { name: "Congo (Kinshasa)", code: "cd", currency: "CDF" },
    { name: "Côte d'Ivoire", code: "ci", currency: "XOF" },
    { name: "Djibouti", code: "dj", currency: "DJF" },
    { name: "Egypt", code: "eg", currency: "EGP" },
    { name: "Equatorial Guinea", code: "gq", currency: "XAF" },
    { name: "Eritrea", code: "er", currency: "ERN" },
    { name: "Eswatini", code: "sz", currency: "SZL" },
    { name: "Ethiopia", code: "et", currency: "ETB" },
    { name: "Gabon", code: "ga", currency: "XAF" },
    { name: "Gambia", code: "gm", currency: "GMD" },
    { name: "Ghana", code: "gh", currency: "GHS" },
    { name: "Guinea", code: "gn", currency: "GNF" },
    { name: "Guinea-Bissau", code: "gw", currency: "XOF" },
    { name: "Kenya", code: "ke", currency: "KES" },
    { name: "Lesotho", code: "ls", currency: "LSL" },
    { name: "Liberia", code: "lr", currency: "LRD" },
    { name: "Libya", code: "ly", currency: "LYD" },
    { name: "Madagascar", code: "mg", currency: "MGA" },
    { name: "Malawi", code: "mw", currency: "MWK" },
    { name: "Mali", code: "ml", currency: "XOF" },
    { name: "Mauritania", code: "mr", currency: "MRU" },
    { name: "Mauritius", code: "mu", currency: "MUR" },
    { name: "Morocco", code: "ma", currency: "MAD" },
    { name: "Mozambique", code: "mz", currency: "MZN" },
    { name: "Namibia", code: "na", currency: "NAD" },
    { name: "Niger", code: "ne", currency: "XOF" },
    { name: "Rwanda", code: "rw", currency: "RWF" },
    { name: "São Tomé and Príncipe", code: "st", currency: "STN" },
    { name: "Senegal", code: "sn", currency: "XOF" },
    { name: "Seychelles", code: "sc", currency: "SCR" },
    { name: "Sierra Leone", code: "sl", currency: "SLE" },
    { name: "Somalia", code: "so", currency: "SOS" },
    { name: "South Africa", code: "za", currency: "ZAR" },
    { name: "South Sudan", code: "ss", currency: "SSP" },
    { name: "Sudan", code: "sd", currency: "SDG" },
    { name: "Tanzania", code: "tz", currency: "TZS" },
    { name: "Togo", code: "tg", currency: "XOF" },
    { name: "Tunisia", code: "tn", currency: "TND" },
    { name: "Uganda", code: "ug", currency: "UGX" },
    { name: "Zambia", code: "zm", currency: "ZMW" },
    { name: "Zimbabwe", code: "zw", currency: "ZWL" },
];

/** Look up a country by its stored name. */
export const getAfricanCountry = (name?: string): AfricanCountry | undefined =>
    AFRICAN_COUNTRIES.find((c) => c.name === name);

/** ISO-4217 code → human-readable currency name (for labels/selectors). */
export const CURRENCY_NAMES: Record<string, string> = {
    NGN: "Nigerian Naira",
    USD: "US Dollar",
    DZD: "Algerian Dinar",
    AOA: "Angolan Kwanza",
    XOF: "West African CFA Franc",
    XAF: "Central African CFA Franc",
    BWP: "Botswana Pula",
    BIF: "Burundian Franc",
    CVE: "Cape Verdean Escudo",
    KMF: "Comorian Franc",
    CDF: "Congolese Franc",
    DJF: "Djiboutian Franc",
    EGP: "Egyptian Pound",
    ERN: "Eritrean Nakfa",
    SZL: "Swazi Lilangeni",
    ETB: "Ethiopian Birr",
    GMD: "Gambian Dalasi",
    GHS: "Ghanaian Cedi",
    GNF: "Guinean Franc",
    KES: "Kenyan Shilling",
    LSL: "Lesotho Loti",
    LRD: "Liberian Dollar",
    LYD: "Libyan Dinar",
    MGA: "Malagasy Ariary",
    MWK: "Malawian Kwacha",
    MRU: "Mauritanian Ouguiya",
    MUR: "Mauritian Rupee",
    MAD: "Moroccan Dirham",
    MZN: "Mozambican Metical",
    NAD: "Namibian Dollar",
    RWF: "Rwandan Franc",
    STN: "São Tomé and Príncipe Dobra",
    SCR: "Seychellois Rupee",
    SLE: "Sierra Leonean Leone",
    SOS: "Somali Shilling",
    ZAR: "South African Rand",
    SSP: "South Sudanese Pound",
    SDG: "Sudanese Pound",
    TZS: "Tanzanian Shilling",
    TND: "Tunisian Dinar",
    UGX: "Ugandan Shilling",
    ZMW: "Zambian Kwacha",
    ZWL: "Zimbabwean Dollar",
};

/** "NGN — Nigerian Naira" style label, falling back to the bare code. */
export const getCurrencyLabel = (code: string): string =>
    CURRENCY_NAMES[code] ? `${code} — ${CURRENCY_NAMES[code]}` : code;

/**
 * ISO-4217 code → display symbol. Used to render a real symbol for currencies
 * that Intl.NumberFormat has no symbol for (it otherwise shows the bare code).
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
    NGN: "₦",
    USD: "$",
    DZD: "د.ج",
    AOA: "Kz",
    XOF: "CFA",
    XAF: "FCFA",
    BWP: "P",
    BIF: "FBu",
    CVE: "Esc",
    KMF: "CF",
    CDF: "FC",
    DJF: "Fdj",
    EGP: "ج.م",
    ERN: "Nfk",
    SZL: "E",
    ETB: "Br",
    GMD: "D",
    GHS: "₵",
    GNF: "FG",
    KES: "KSh",
    LSL: "L",
    LRD: "L$",
    LYD: "ل.د",
    MGA: "Ar",
    MWK: "MK",
    MRU: "UM",
    MUR: "₨",
    MAD: "د.م.",
    MZN: "MT",
    NAD: "N$",
    RWF: "FRw",
    STN: "Db",
    SCR: "₨",
    SLE: "Le",
    SOS: "Sh",
    ZAR: "R",
    SSP: "£",
    SDG: "ج.س",
    TZS: "TSh",
    TND: "د.ت",
    UGX: "USh",
    ZMW: "ZK",
    ZWL: "Z$",
};

/** The display symbol for a currency, or the code itself if none is known. */
export const getCurrencySymbol = (code: string): string =>
    CURRENCY_SYMBOLS[code] ?? code;
