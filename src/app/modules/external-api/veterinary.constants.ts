// @ts-nocheck
// external-api/veterinary.constants.ts
export type Species = "Canine" | "Feline" | "Equine" | "All Species";

export interface DosingRule {
    species: Species;
    minDoseMgPerKg: number;
    maxDoseMgPerKg: number;
    frequency: string;
    route: string;
    form: string;
    instructions: string;
}

// Internal KB - NOT exported directly
export const VET_CLINICAL_KB: Record<string, DosingRule[]> = {
    "ALLOPURINOL": [
        {
            species: "Canine",
            minDoseMgPerKg: 10,
            maxDoseMgPerKg: 15,
            frequency: "BID",
            route: "PO",
            form: "Tablet",
            instructions: "Used for Leishmaniasis and urate urolithiasis in dogs"
        }
    ],
    "DOXYCYCLINE": [
        {
            species: "Canine",
            minDoseMgPerKg: 5,
            maxDoseMgPerKg: 10,
            frequency: "BID",
            route: "PO",
            form: "Tablet",
            instructions: "Tetracycline antibiotic for tick-borne diseases and respiratory infections"
        },
        {
            species: "Feline",
            minDoseMgPerKg: 5,
            maxDoseMgPerKg: 10,
            frequency: "BID",
            route: "PO",
            form: "Tablet",
            instructions: "Ensure to follow with water to prevent esophageal strictures in cats"
        }
    ],
    "PREDNISONE": [
        {
            species: "Canine",
            minDoseMgPerKg: 0.5,
            maxDoseMgPerKg: 1.0,
            frequency: "BID",
            route: "PO",
            form: "Tablet",
            instructions: "Glucocorticoid for inflammation and immune suppression"
        }
    ],
    "AMOXICILLIN": [
        {
            species: "Canine",
            minDoseMgPerKg: 10,
            maxDoseMgPerKg: 20,
            frequency: "BID",
            route: "PO",
            form: "Tablet",
            instructions: "Standard broad-spectrum antibiotic for dogs"
        },
        {
            species: "Feline",
            minDoseMgPerKg: 10,
            maxDoseMgPerKg: 20,
            frequency: "BID",
            route: "PO",
            form: "Tablet",
            instructions: "Standard broad-spectrum antibiotic for cats"
        }
    ],
    "CARPROFEN": [
        {
            species: "Canine",
            minDoseMgPerKg: 2.2,
            maxDoseMgPerKg: 4.4,
            frequency: "BID",
            route: "PO",
            form: "Tablet",
            instructions: "NSAID for pain and inflammation in dogs"
        }
    ],
    "GABAPENTIN": [
        {
            species: "Canine",
            minDoseMgPerKg: 5,
            maxDoseMgPerKg: 10,
            frequency: "TID",
            route: "PO",
            form: "Capsule",
            instructions: "Neuropathic pain and sedation in dogs"
        },
        {
            species: "Feline",
            minDoseMgPerKg: 5,
            maxDoseMgPerKg: 10,
            frequency: "TID",
            route: "PO",
            form: "Capsule",
            instructions: "Neuropathic pain in cats"
        }
    ],
    "ENROFLOXACIN": [
        {
            species: "Canine",
            minDoseMgPerKg: 5,
            maxDoseMgPerKg: 20,
            frequency: "SID",
            route: "PO",
            form: "Tablet",
            instructions: "Broad-spectrum antibiotic (Baytril) for dogs"
        },
        {
            species: "Feline",
            minDoseMgPerKg: 5,
            maxDoseMgPerKg: 5,
            frequency: "SID",
            route: "PO",
            form: "Tablet",
            instructions: "Broad-spectrum antibiotic for cats. Dose cap at 5mg/kg"
        }
    ],
    "MELOXICAM": [
        {
            species: "Canine",
            minDoseMgPerKg: 0.1,
            maxDoseMgPerKg: 0.2,
            frequency: "SID",
            route: "PO",
            form: "Suspension",
            instructions: "NSAID (Metacam). 0.2mg/kg loading, then 0.1mg/kg"
        },
        {
            species: "Feline",
            minDoseMgPerKg: 0.05,
            maxDoseMgPerKg: 0.05,
            frequency: "SID",
            route: "PO",
            form: "Suspension",
            instructions: "NSAID for cats. Off-label use"
        }
    ],
    "METRONIDAZOLE": [
        {
            species: "Canine",
            minDoseMgPerKg: 10,
            maxDoseMgPerKg: 25,
            frequency: "BID",
            route: "PO",
            form: "Tablet",
            instructions: "Antiprotozoal/Antibiotic for dogs"
        },
        {
            species: "Feline",
            minDoseMgPerKg: 10,
            maxDoseMgPerKg: 25,
            frequency: "BID",
            route: "PO",
            form: "Tablet",
            instructions: "Antiprotozoal/Antibiotic for cats"
        }
    ],
    "CLINDAMYCIN": [
        {
            species: "Canine",
            minDoseMgPerKg: 5.5,
            maxDoseMgPerKg: 11,
            frequency: "BID",
            route: "PO",
            form: "Capsule",
            instructions: "Antibiotic (Antirobe) for dogs"
        },
        {
            species: "Feline",
            minDoseMgPerKg: 5.5,
            maxDoseMgPerKg: 11,
            frequency: "BID",
            route: "PO",
            form: "Capsule",
            instructions: "Antibiotic for cats"
        }
    ],
    "CEFOXITIN": [
        {
            species: "Canine",
            minDoseMgPerKg: 22,
            maxDoseMgPerKg: 30,
            frequency: "TID",
            route: "IV/IM",
            form: "Injection",
            instructions: "Second-generation cephalosporin for surgical prophylaxis or sepsis"
        },
        {
            species: "Feline",
            minDoseMgPerKg: 22,
            maxDoseMgPerKg: 30,
            frequency: "TID",
            route: "IV/IM",
            form: "Injection",
            instructions: "Second-generation cephalosporin for surgical prophylaxis or sepsis"
        }
    ]
};

// Salt suffixes to remove during normalization
export const SALT_SUFFIXES = [
    'HYDROCHLORIDE',
    'SODIUM',
    'POTASSIUM',
    'MONOHYDRATE',
    'TRIHYDRATE',
    'ACID',
    'ANHYDROUS',
    'CALCIUM',
    'MAGNESIUM',
    'PHOSPHATE',
    'SULFATE',
    'CHLORIDE',
    'BENZOATE',
    'CITRATE',
    'LACTATE',
    'ACETATE',
    'SUCCINATE',
    'FUMARATE',
    'MALEATE',
    'TARTRATE',
    'METHANESULFONATE',
    'MESYLATE',
    'MALEATE',
    'HYDROBROMIDE',
    'NITRATE',
    'SULFITE',
    'BISULFITE',
    'CARBONATE',
    'BICARBONATE',
    'GLUCONATE',
    'GLYCOLATE',
    'STEARATE',
    'PALMITATE',
    'OLEATE',
    'PROPIONATE',
    'VALERATE',
    'BUTYRATE',
    'ISOBUTYRATE',
    'FORMATE',
    'CETOSTEARYL SULFATE',
    'LAURYL SULFATE',
    'LAURYLSULFATE',
    'STEAROYL POLYOXYLGLYCERIDES',
    'POLYSTYRENE SULFONATE',
    'POLYETHYLENE GLYCOL',
    'PEG',
    'DIMETHANESULFONATE',
    'DIMALEATE',
    'DIPROPIONATE',
    'DIHYDROCHLORIDE',
    'DICHLORHYDRATE'
];
