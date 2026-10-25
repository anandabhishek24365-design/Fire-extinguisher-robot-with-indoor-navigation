export interface Point {
  x: number;
  y: number;
}

export interface WallSegment {
  p1: Point;
  p2: Point;
  name: string;
}

export interface NavNode {
  id: string;
  name: string;
  x: number;
  y: number;
  floor: number;
  neighbors: string[];
}

export interface MoveResult {
  blocked: boolean;
  safePos: Point;
  distanceMoved: number;
  wallName?: string;
  warning?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// FLOOR WALLS GEOMETRY (with real door openings left clear)
// ═══════════════════════════════════════════════════════════════════════

export const FLOOR_WALLS: Record<number, WallSegment[]> = {
  // ── FLOOR 1: GROUND FLOOR ──
  1: [
    // Exterior Perimeter (with Main Entrance and Patio Exits)
    { p1: { x: 14, y: 14 }, p2: { x: 306, y: 14 }, name: 'North Exterior Wall' },
    { p1: { x: 306, y: 14 }, p2: { x: 306, y: 148 }, name: 'East Exterior Wall (Upper)' },
    // Patio Exit gap at y: 148..172
    { p1: { x: 306, y: 172 }, p2: { x: 306, y: 206 }, name: 'East Exterior Wall (Lower)' },
    { p1: { x: 14, y: 206 }, p2: { x: 306, y: 206 }, name: 'South Exterior Wall' },
    { p1: { x: 14, y: 14 }, p2: { x: 14, y: 96 }, name: 'West Exterior Wall (Upper)' },
    // Main Entrance Door gap at y: 96..116
    { p1: { x: 14, y: 116 }, p2: { x: 14, y: 206 }, name: 'West Exterior Wall (Lower)' },

    // Interior Dividers
    // Foyer/Garage vs Living/Hall (Vertical x = 70)
    { p1: { x: 70, y: 14 }, p2: { x: 70, y: 76 }, name: 'Foyer-Living Divider Wall' },
    // Open passage into Central Hall at y: 76..110
    // Garage-to-Hall Door gap at y: 134..156
    { p1: { x: 70, y: 156 }, p2: { x: 70, y: 206 }, name: 'Garage-Utility Divider Wall' },

    // Foyer vs Garage (Horizontal y = 134)
    { p1: { x: 14, y: 134 }, p2: { x: 68, y: 134 }, name: 'Foyer-Garage Partition' },

    // Living vs Kitchen (Vertical x = 200)
    { p1: { x: 200, y: 14 }, p2: { x: 200, y: 72 }, name: 'Living-Kitchen Upper Divider' },
    // Wide open arch at y: 72..110

    // Living/Kitchen vs Central Hall/Patio (Horizontal y = 110)
    { p1: { x: 70, y: 110 }, p2: { x: 115, y: 110 }, name: 'Living-Hall Wall (West)' },
    // Main Living Grand Arch at x: 115..160
    { p1: { x: 160, y: 110 }, p2: { x: 190, y: 110 }, name: 'Living-Hall Wall (East)' },
    // Kitchen corridor access at x: 190..222
    // Kitchen-to-Patio sliding door gap at x: 222..250
    { p1: { x: 250, y: 110 }, p2: { x: 306, y: 110 }, name: 'Kitchen-Patio Partition' },

    // Central Hall vs Powder Room (Vertical x = 176)
    { p1: { x: 176, y: 110 }, p2: { x: 176, y: 125 }, name: 'Powder Room Door Jamb (Top)' },
    // Powder Room door at y: 125..150
    { p1: { x: 176, y: 150 }, p2: { x: 176, y: 206 }, name: 'Utility-Powder Divider Wall' },

    // Central Hall vs Utility/Laundry (Horizontal y = 156)
    { p1: { x: 70, y: 156 }, p2: { x: 125, y: 156 }, name: 'Utility-Hall Wall (West)' },
    // Utility Room door at x: 125..155
    { p1: { x: 155, y: 156 }, p2: { x: 176, y: 156 }, name: 'Utility-Hall Wall (East)' },

    // Powder Room vs Garden Patio (Vertical x = 222)
    { p1: { x: 222, y: 110 }, p2: { x: 222, y: 206 }, name: 'Powder-Patio Solid Partition' },
  ],

  // ── FLOOR 2: FIRST FLOOR ──
  2: [
    // Exterior Perimeter
    { p1: { x: 14, y: 14 }, p2: { x: 306, y: 14 }, name: 'Floor 2 North Wall' },
    { p1: { x: 306, y: 14 }, p2: { x: 306, y: 180 }, name: 'Floor 2 East Wall (Upper)' },
    // Balcony Emergency Ladder gap at y: 180..204
    { p1: { x: 306, y: 204 }, p2: { x: 306, y: 206 }, name: 'Floor 2 East Wall (Lower)' },
    { p1: { x: 14, y: 206 }, p2: { x: 306, y: 206 }, name: 'Floor 2 South Wall' },
    { p1: { x: 14, y: 14 }, p2: { x: 14, y: 98 }, name: 'Floor 2 West Wall (Upper)' },
    // West Fire Stairway exit gap at y: 98..122
    { p1: { x: 14, y: 122 }, p2: { x: 14, y: 206 }, name: 'Floor 2 West Wall (Lower)' },

    // Interior Dividers
    // Master Suite vs Cyber Study (Vertical x = 126)
    { p1: { x: 126, y: 14 }, p2: { x: 126, y: 110 }, name: 'Master-Study Partition Wall' },

    // Master Bedroom vs Ensuite & Closet (Horizontal y = 110)
    { p1: { x: 14, y: 110 }, p2: { x: 96, y: 110 }, name: 'Master-Ensuite Wall' },
    // Master Door to Family Hall gap at x: 96..126

    // Cyber Study vs Family Hall (Horizontal y = 82)
    { p1: { x: 126, y: 82 }, p2: { x: 145, y: 82 }, name: 'Study Wall (West)' },
    // Study door to Family Hall at x: 145..175
    { p1: { x: 175, y: 82 }, p2: { x: 214, y: 82 }, name: 'Study Wall (East)' },

    // Study & Family Hall vs Bedroom 2 & 3 (Vertical x = 214)
    { p1: { x: 214, y: 14 }, p2: { x: 214, y: 65 }, name: 'Bed 2 Wall (Top)' },
    // Bed 2 Door to Hall at y: 65..95
    // Bed 2 vs Bed 3 divider at y = 98
    { p1: { x: 214, y: 98 }, p2: { x: 306, y: 98 }, name: 'Bedroom 2-3 Party Wall' },
    // Bed 3 Door to Hall at y: 105..135
    { p1: { x: 214, y: 135 }, p2: { x: 214, y: 174 }, name: 'Bed 3 Wall (Bottom)' },

    // Family Hall vs Bathrooms (Horizontal y = 154)
    { p1: { x: 96, y: 154 }, p2: { x: 110, y: 154 }, name: 'Hall-Bath 2 Wall (West)' },
    // Bathroom 2 door at x: 110..135
    { p1: { x: 135, y: 154 }, p2: { x: 150, y: 154 }, name: 'Hall-Bath 2 Wall (East)' },
    // Smart Hub door at x: 150..176
    { p1: { x: 146, y: 154 }, p2: { x: 146, y: 206 }, name: 'Bath 2 vs Smart Hub Wall' },
    { p1: { x: 176, y: 154 }, p2: { x: 176, y: 206 }, name: 'Smart Hub vs Balcony Corridor' },

    // Hallway to Sun Balcony (Horizontal y = 174)
    { p1: { x: 176, y: 174 }, p2: { x: 215, y: 174 }, name: 'Balcony Boundary Wall (West)' },
    // Balcony sliding door at x: 215..255
    { p1: { x: 255, y: 174 }, p2: { x: 306, y: 174 }, name: 'Balcony Boundary Wall (East)' },
  ],

  // ── FLOOR 3: PENTHOUSE LOFT ──
  3: [
    // Exterior Perimeter
    { p1: { x: 30, y: 20 }, p2: { x: 290, y: 20 }, name: 'Penthouse North Wall' },
    { p1: { x: 290, y: 20 }, p2: { x: 290, y: 165 }, name: 'Penthouse East Wall (Upper)' },
    // Rooftop Fire Gantry gap at y: 165..190
    { p1: { x: 290, y: 190 }, p2: { x: 290, y: 208 }, name: 'Penthouse East Wall (Lower)' },
    { p1: { x: 30, y: 208 }, p2: { x: 290, y: 208 }, name: 'Penthouse South Wall' },
    { p1: { x: 30, y: 20 }, p2: { x: 30, y: 208 }, name: 'Penthouse West Wall' },

    // Interior Dividers
    // Sky Lounge vs Solar BESS & HVAC (Vertical x = 168)
    { p1: { x: 168, y: 20 }, p2: { x: 168, y: 40 }, name: 'Lounge-Solar Wall (Top)' },
    // Solar BESS door at y: 40..65
    { p1: { x: 168, y: 65 }, p2: { x: 168, y: 100 }, name: 'Lounge-Plant Divider (Mid)' },
    // HVAC Pump Room door at y: 100..125
    { p1: { x: 168, y: 125 }, p2: { x: 168, y: 148 }, name: 'Lounge-HVAC Wall (Bottom)' },

    // Solar BESS vs HVAC Divider (Horizontal y = 80)
    { p1: { x: 168, y: 80 }, p2: { x: 290, y: 80 }, name: 'Solar vs HVAC Equipment Divider' },

    // Sky Lounge vs Attic Loft Vault (Horizontal y = 130)
    { p1: { x: 30, y: 130 }, p2: { x: 65, y: 130 }, name: 'Lounge-Attic Wall (West)' },
    // Attic Vault door at x: 65..95
    { p1: { x: 95, y: 130 }, p2: { x: 128, y: 130 }, name: 'Lounge-Attic Wall (East)' },

    // Attic Loft vs Rooftop Sky Terrace (Vertical x = 128)
    { p1: { x: 128, y: 130 }, p2: { x: 128, y: 208 }, name: 'Attic-Terrace Firewall' },
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// WAYPOINT NAVIGATION GRAPH (Corridors, Doors, and Room Waypoints)
// ═══════════════════════════════════════════════════════════════════════

export const NAV_NODES: Record<number, Record<string, NavNode>> = {
  // ── FLOOR 1 ──
  1: {
    garage_center: {
      id: 'garage_center',
      name: 'GARAGE & DOCK',
      x: 57,
      y: 171,
      floor: 1,
      neighbors: ['garage_door'],
    },
    garage_door: {
      id: 'garage_door',
      name: 'Garage Door Threshold',
      x: 70,
      y: 145,
      floor: 1,
      neighbors: ['garage_center', 'hall_south', 'hall_center'],
    },
    foyer_center: {
      id: 'foyer_center',
      name: 'ENTRANCE FOYER',
      x: 42,
      y: 106,
      floor: 1,
      neighbors: ['foyer_door', 'front_exit'],
    },
    front_exit: {
      id: 'front_exit',
      name: 'Main Front Door Exit',
      x: 14,
      y: 106,
      floor: 1,
      neighbors: ['foyer_center'],
    },
    foyer_door: {
      id: 'foyer_door',
      name: 'Foyer Hallway Junction',
      x: 72,
      y: 95,
      floor: 1,
      neighbors: ['foyer_center', 'hall_center', 'living_arch'],
    },
    hall_center: {
      id: 'hall_center',
      name: 'CENTRAL HALL',
      x: 140,
      y: 135,
      floor: 1,
      neighbors: ['garage_door', 'foyer_door', 'living_arch', 'utility_door', 'powder_door', 'hall_east'],
    },
    hall_south: {
      id: 'hall_south',
      name: 'Central Hall South',
      x: 100,
      y: 145,
      floor: 1,
      neighbors: ['garage_door', 'hall_center'],
    },
    hall_east: {
      id: 'hall_east',
      name: 'East Corridor Archway',
      x: 205,
      y: 125,
      floor: 1,
      neighbors: ['hall_center', 'kitchen_arch', 'patio_door'],
    },
    living_center: {
      id: 'living_center',
      name: 'LIVING ROOM',
      x: 137,
      y: 62,
      floor: 1,
      neighbors: ['living_arch', 'living_kitchen_arch'],
    },
    living_arch: {
      id: 'living_arch',
      name: 'Living Room Grand Arch',
      x: 138,
      y: 95,
      floor: 1,
      neighbors: ['hall_center', 'foyer_door', 'living_center'],
    },
    living_kitchen_arch: {
      id: 'living_kitchen_arch',
      name: 'Kitchen Open Archway',
      x: 200,
      y: 85,
      floor: 1,
      neighbors: ['living_center', 'kitchen_center', 'kitchen_arch'],
    },
    kitchen_center: {
      id: 'kitchen_center',
      name: 'KITCHEN & DINING',
      x: 255,
      y: 62,
      floor: 1,
      neighbors: ['living_kitchen_arch', 'kitchen_arch'],
    },
    kitchen_arch: {
      id: 'kitchen_arch',
      name: 'Kitchen Hall Junction',
      x: 215,
      y: 95,
      floor: 1,
      neighbors: ['kitchen_center', 'living_kitchen_arch', 'hall_east', 'patio_door'],
    },
    utility_door: {
      id: 'utility_door',
      name: 'Utility Room Door',
      x: 140,
      y: 156,
      floor: 1,
      neighbors: ['hall_center', 'utility_center'],
    },
    utility_center: {
      id: 'utility_center',
      name: 'UTILITY / LAUNDRY',
      x: 140,
      y: 183,
      floor: 1,
      neighbors: ['utility_door'],
    },
    powder_door: {
      id: 'powder_door',
      name: 'Powder Room Door',
      x: 176,
      y: 138,
      floor: 1,
      neighbors: ['hall_center', 'powder_center'],
    },
    powder_center: {
      id: 'powder_center',
      name: 'POWDER ROOM',
      x: 199,
      y: 135,
      floor: 1,
      neighbors: ['powder_door'],
    },
    patio_door: {
      id: 'patio_door',
      name: 'Patio Sliding Door Threshold',
      x: 236,
      y: 115,
      floor: 1,
      neighbors: ['hall_east', 'kitchen_arch', 'patio_center'],
    },
    patio_center: {
      id: 'patio_center',
      name: 'GARDEN PATIO',
      x: 266,
      y: 160,
      floor: 1,
      neighbors: ['patio_door', 'patio_exit'],
    },
    patio_exit: {
      id: 'patio_exit',
      name: 'Garden Patio Evacuation Gate',
      x: 298,
      y: 160,
      floor: 1,
      neighbors: ['patio_center'],
    },
  },

  // ── FLOOR 2 ──
  2: {
    master_center: {
      id: 'master_center',
      name: 'MASTER SUITE',
      x: 70,
      y: 62,
      floor: 2,
      neighbors: ['master_door', 'ensuite_door'],
    },
    master_door: {
      id: 'master_door',
      name: 'Master Suite Door',
      x: 110,
      y: 110,
      floor: 2,
      neighbors: ['master_center', 'family_hall', 'west_exit'],
    },
    west_exit: {
      id: 'west_exit',
      name: 'West Fire Stairway Exit',
      x: 14,
      y: 110,
      floor: 2,
      neighbors: ['master_door', 'ensuite_center'],
    },
    ensuite_door: {
      id: 'ensuite_door',
      name: 'Master Ensuite Opening',
      x: 55,
      y: 110,
      floor: 2,
      neighbors: ['master_center', 'ensuite_center'],
    },
    ensuite_center: {
      id: 'ensuite_center',
      name: 'ENSUITE & CLOSET',
      x: 55,
      y: 160,
      floor: 2,
      neighbors: ['ensuite_door', 'west_exit'],
    },
    study_center: {
      id: 'study_center',
      name: 'CYBER STUDY',
      x: 172,
      y: 48,
      floor: 2,
      neighbors: ['study_door'],
    },
    study_door: {
      id: 'study_door',
      name: 'Study Door Threshold',
      x: 160,
      y: 82,
      floor: 2,
      neighbors: ['study_center', 'family_hall'],
    },
    family_hall: {
      id: 'family_hall',
      name: 'FAMILY HALL',
      x: 138,
      y: 120,
      floor: 2,
      neighbors: ['master_door', 'study_door', 'bed2_door', 'bed3_door', 'bath2_door', 'smarthub_door', 'balcony_hall'],
    },
    bed2_door: {
      id: 'bed2_door',
      name: 'Bedroom 2 Door',
      x: 214,
      y: 80,
      floor: 2,
      neighbors: ['family_hall', 'bed2_center'],
    },
    bed2_center: {
      id: 'bed2_center',
      name: 'BEDROOM 2 (GUEST)',
      x: 262,
      y: 56,
      floor: 2,
      neighbors: ['bed2_door'],
    },
    bed3_door: {
      id: 'bed3_door',
      name: 'Bedroom 3 Door',
      x: 214,
      y: 120,
      floor: 2,
      neighbors: ['family_hall', 'bed3_center'],
    },
    bed3_center: {
      id: 'bed3_center',
      name: 'BEDROOM 3 (KIDS)',
      x: 262,
      y: 138,
      floor: 2,
      neighbors: ['bed3_door'],
    },
    bath2_door: {
      id: 'bath2_door',
      name: 'Bathroom 2 Door',
      x: 123,
      y: 154,
      floor: 2,
      neighbors: ['family_hall', 'bath2_center'],
    },
    bath2_center: {
      id: 'bath2_center',
      name: 'BATHROOM 2',
      x: 123,
      y: 182,
      floor: 2,
      neighbors: ['bath2_door'],
    },
    smarthub_door: {
      id: 'smarthub_door',
      name: 'Smart Hub Door',
      x: 163,
      y: 154,
      floor: 2,
      neighbors: ['family_hall', 'smarthub_center'],
    },
    smarthub_center: {
      id: 'smarthub_center',
      name: 'SMART HUB',
      x: 163,
      y: 182,
      floor: 2,
      neighbors: ['smarthub_door'],
    },
    balcony_hall: {
      id: 'balcony_hall',
      name: 'Balcony Antechamber',
      x: 195,
      y: 154,
      floor: 2,
      neighbors: ['family_hall', 'balcony_door'],
    },
    balcony_door: {
      id: 'balcony_door',
      name: 'Balcony Glass Slider',
      x: 235,
      y: 174,
      floor: 2,
      neighbors: ['balcony_hall', 'balcony_center'],
    },
    balcony_center: {
      id: 'balcony_center',
      name: 'SUN BALCONY',
      x: 243,
      y: 192,
      floor: 2,
      neighbors: ['balcony_door', 'balcony_exit'],
    },
    balcony_exit: {
      id: 'balcony_exit',
      name: 'Balcony Emergency Ladder',
      x: 300,
      y: 192,
      floor: 2,
      neighbors: ['balcony_center'],
    },
  },

  // ── FLOOR 3 ──
  3: {
    lounge_center: {
      id: 'lounge_center',
      name: 'SKY LOUNGE & CINEMA',
      x: 100,
      y: 76,
      floor: 3,
      neighbors: ['solar_door', 'hvac_door', 'attic_door', 'terrace_door'],
    },
    solar_door: {
      id: 'solar_door',
      name: 'Solar BESS Room Door',
      x: 168,
      y: 52,
      floor: 3,
      neighbors: ['lounge_center', 'solar_center'],
    },
    solar_center: {
      id: 'solar_center',
      name: 'SOLAR BESS & POWER',
      x: 229,
      y: 51,
      floor: 3,
      neighbors: ['solar_door'],
    },
    hvac_door: {
      id: 'hvac_door',
      name: 'HVAC Plant Door',
      x: 168,
      y: 112,
      floor: 3,
      neighbors: ['lounge_center', 'hvac_center'],
    },
    hvac_center: {
      id: 'hvac_center',
      name: 'HVAC & WATER PUMP',
      x: 229,
      y: 115,
      floor: 3,
      neighbors: ['hvac_door'],
    },
    attic_door: {
      id: 'attic_door',
      name: 'Attic Vault Door',
      x: 80,
      y: 130,
      floor: 3,
      neighbors: ['lounge_center', 'attic_center'],
    },
    attic_center: {
      id: 'attic_center',
      name: 'ATTIC VAULT STORAGE',
      x: 80,
      y: 170,
      floor: 3,
      neighbors: ['attic_door'],
    },
    terrace_door: {
      id: 'terrace_door',
      name: 'Rooftop Terrace Portal',
      x: 150,
      y: 130,
      floor: 3,
      neighbors: ['lounge_center', 'terrace_center'],
    },
    terrace_center: {
      id: 'terrace_center',
      name: 'ROOFTOP SKY TERRACE',
      x: 209,
      y: 178,
      floor: 3,
      neighbors: ['terrace_door', 'terrace_exit'],
    },
    terrace_exit: {
      id: 'terrace_exit',
      name: 'Rooftop Fire Gantry',
      x: 280,
      y: 178,
      floor: 3,
      neighbors: ['terrace_center'],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// PATROL PATHS (Strictly corridor & doorway traversals)
// ═══════════════════════════════════════════════════════════════════════

export const PATROL_LOOPS: Record<number, Point[]> = {
  1: [
    { x: 57, y: 171 }, // Garage Dock
    { x: 70, y: 145 }, // Garage Door
    { x: 140, y: 135 }, // Central Hall
    { x: 138, y: 95 },  // Living Arch
    { x: 137, y: 62 },  // Living Room
    { x: 200, y: 85 },  // Kitchen Arch
    { x: 255, y: 62 },  // Kitchen
    { x: 215, y: 95 },  // Kitchen Hall Junction
    { x: 236, y: 115 }, // Patio Door
    { x: 266, y: 160 }, // Patio
    { x: 236, y: 115 }, // Back through Patio Door
    { x: 140, y: 135 }, // Central Hall
    { x: 72, y: 95 },   // Foyer Door
    { x: 42, y: 106 },  // Entrance Foyer
    { x: 72, y: 95 },   // Foyer Door
    { x: 70, y: 145 },  // Garage Door
  ],
  2: [
    { x: 138, y: 120 }, // Family Hall
    { x: 110, y: 110 }, // Master Door
    { x: 70, y: 62 },   // Master Suite
    { x: 110, y: 110 }, // Master Door
    { x: 138, y: 120 }, // Family Hall
    { x: 160, y: 82 },  // Study Door
    { x: 172, y: 48 },  // Cyber Study
    { x: 160, y: 82 },  // Study Door
    { x: 138, y: 120 }, // Family Hall
    { x: 214, y: 80 },  // Bed 2 Door
    { x: 262, y: 56 },  // Bedroom 2
    { x: 214, y: 80 },  // Bed 2 Door
    { x: 138, y: 120 }, // Family Hall
    { x: 214, y: 120 }, // Bed 3 Door
    { x: 262, y: 138 }, // Bedroom 3
    { x: 214, y: 120 }, // Bed 3 Door
    { x: 195, y: 154 }, // Balcony Antechamber
    { x: 235, y: 174 }, // Balcony Door
    { x: 243, y: 192 }, // Sun Balcony
    { x: 235, y: 174 }, // Balcony Door
  ],
  3: [
    { x: 100, y: 76 },  // Sky Lounge
    { x: 168, y: 52 },  // Solar Door
    { x: 229, y: 51 },  // Solar BESS
    { x: 168, y: 52 },  // Solar Door
    { x: 100, y: 76 },  // Sky Lounge
    { x: 168, y: 112 }, // HVAC Door
    { x: 229, y: 115 }, // HVAC Pump
    { x: 168, y: 112 }, // HVAC Door
    { x: 100, y: 76 },  // Sky Lounge
    { x: 80, y: 130 },  // Attic Door
    { x: 80, y: 170 },  // Attic Vault
    { x: 80, y: 130 },  // Attic Door
    { x: 100, y: 76 },  // Sky Lounge
    { x: 150, y: 130 }, // Terrace Door
    { x: 209, y: 178 }, // Sky Terrace
    { x: 150, y: 130 }, // Terrace Door
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// MATHEMATICAL COLLISION DETECTION & WALL GEOMETRY
// ═══════════════════════════════════════════════════════════════════════

function ccw(p1: Point, p2: Point, p3: Point): number {
  return (p3.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p3.x - p1.x);
}

/**
 * Tests whether line segment p1->p2 intersects line segment q1->q2
 */
export function segmentsIntersect(p1: Point, p2: Point, q1: Point, q2: Point): boolean {
  const d1 = ccw(p1, p2, q1);
  const d2 = ccw(p1, p2, q2);
  const d3 = ccw(q1, q2, p1);
  const d4 = ccw(q1, q2, p2);

  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }

  // Exact on-segment boundary check
  function onSegment(p: Point, a: Point, b: Point): boolean {
    return (
      p.x <= Math.max(a.x, b.x) + 0.01 &&
      p.x >= Math.min(a.x, b.x) - 0.01 &&
      p.y <= Math.max(a.y, b.y) + 0.01 &&
      p.y >= Math.min(a.y, b.y) - 0.01
    );
  }

  if (Math.abs(d1) < 0.001 && onSegment(q1, p1, p2)) return true;
  if (Math.abs(d2) < 0.001 && onSegment(q2, p1, p2)) return true;
  if (Math.abs(d3) < 0.001 && onSegment(p1, q1, q2)) return true;
  if (Math.abs(d4) < 0.001 && onSegment(p2, q1, q2)) return true;

  return false;
}

/**
 * Calculates shortest distance from point p to line segment a->b
 */
export function distToSegment(p: Point, a: Point, b: Point): { dist: number; proj: Point } {
  const l2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  if (l2 === 0) {
    return { dist: Math.hypot(p.x - a.x, p.y - a.y), proj: { ...a } };
  }
  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const proj = {
    x: a.x + t * (b.x - a.x),
    y: a.y + t * (b.y - a.y),
  };
  return { dist: Math.hypot(p.x - proj.x, p.y - proj.y), proj };
}

/**
 * Calculates precise intersection point of two intersecting line segments
 */
export function getLineIntersection(p1: Point, p2: Point, q1: Point, q2: Point): Point | null {
  const denom = (q2.y - q1.y) * (p2.x - p1.x) - (q2.x - q1.x) * (p2.y - p1.y);
  if (Math.abs(denom) < 0.0001) return null; // Parallel or collinear

  const ua = ((q2.x - q1.x) * (p1.y - q1.y) - (q2.y - q1.y) * (p1.x - q1.x)) / denom;
  const ub = ((p2.x - p1.x) * (p1.y - q1.y) - (p2.y - p1.y) * (p1.x - q1.x)) / denom;

  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    return {
      x: p1.x + ua * (p2.x - p1.x),
      y: p1.y + ua * (p2.y - p1.y),
    };
  }
  return null;
}

/**
 * Checks if a movement segment (from -> to) collides with any solid wall on the given floor.
 * Returns the collided wall if any, otherwise null.
 */
export function checkCollision(from: Point, to: Point, floor = 1, robotRadius = 5): WallSegment | null {
  const walls = FLOOR_WALLS[floor] || FLOOR_WALLS[1];
  for (const wall of walls) {
    // 1. Direct line intersection with wall segment
    if (segmentsIntersect(from, to, wall.p1, wall.p2)) {
      return wall;
    }
    // 2. Robot body radius proximity check at destination
    const { dist } = distToSegment(to, wall.p1, wall.p2);
    if (dist < robotRadius) {
      return wall;
    }
  }
  return null;
}

/**
 * Calculates a safe move from startPos towards candidate direction.
 * If a wall is encountered, the robot halts at a safe standoff distance before the wall.
 */
export function calculateSafeStep(
  startPos: Point,
  headingDeg: number,
  stepDist: number,
  floor = 1,
  robotRadius = 5.5
): MoveResult {
  const rad = (headingDeg * Math.PI) / 180;
  const targetX = startPos.x + Math.cos(rad) * stepDist;
  const targetY = startPos.y + Math.sin(rad) * stepDist;
  const targetPos = { x: targetX, y: targetY };

  const walls = FLOOR_WALLS[floor] || FLOOR_WALLS[1];
  let earliestCollisionT = 1.0;
  let collidingWall: WallSegment | null = null;
  let collisionPoint: Point | null = null;

  for (const wall of walls) {
    // Check line intersection
    const inter = getLineIntersection(startPos, targetPos, wall.p1, wall.p2);
    if (inter) {
      const d = Math.hypot(inter.x - startPos.x, inter.y - startPos.y);
      const t = d / Math.max(0.1, stepDist);
      if (t < earliestCollisionT) {
        earliestCollisionT = t;
        collidingWall = wall;
        collisionPoint = inter;
      }
    }

    // Check proximity to wall segment
    const { dist, proj } = distToSegment(targetPos, wall.p1, wall.p2);
    if (dist < robotRadius) {
      const d = Math.hypot(proj.x - startPos.x, proj.y - startPos.y);
      const safeT = Math.max(0, (d - robotRadius) / Math.max(0.1, stepDist));
      if (safeT < earliestCollisionT) {
        earliestCollisionT = safeT;
        collidingWall = wall;
        collisionPoint = proj;
      }
    }
  }

  if (collidingWall) {
    // Clamp movement right before the wall
    const clampFraction = Math.max(0, earliestCollisionT - robotRadius / Math.max(0.1, stepDist));
    const safeX = startPos.x + Math.cos(rad) * (stepDist * clampFraction);
    const safeY = startPos.y + Math.sin(rad) * (stepDist * clampFraction);

    return {
      blocked: true,
      safePos: { x: Number(safeX.toFixed(2)), y: Number(safeY.toFixed(2)) },
      distanceMoved: Number((stepDist * clampFraction).toFixed(2)),
      wallName: collidingWall.name,
      warning: `[COLLISION AVOIDED] Solid obstacle "${collidingWall.name}" detected! Drive halted ${robotRadius}m clear of wall.`,
    };
  }

  return {
    blocked: false,
    safePos: targetPos,
    distanceMoved: stepDist,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// INDOOR WAYPOINT PATHFINDER (A* / Breadth-First on Doorway NavMesh)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Finds the nearest visible navigation node that does NOT have a wall in between
 */
export function findNearestVisibleNode(pos: Point, floor = 1): NavNode {
  const nodes = Object.values(NAV_NODES[floor] || NAV_NODES[1]);
  let bestNode: NavNode = nodes[0];
  let minCost = Infinity;

  for (const node of nodes) {
    const dist = Math.hypot(node.x - pos.x, node.y - pos.y);
    const blocked = checkCollision(pos, { x: node.x, y: node.y }, floor, 3);
    const cost = dist + (blocked ? 1000 : 0);

    if (cost < minCost) {
      minCost = cost;
      bestNode = node;
    }
  }

  return bestNode;
}

/**
 * Computes an indoor, obstacle-free path of waypoints from `start` to `target`.
 * If direct path is unobstructed by walls, returns [target].
 * Otherwise, routes through hallway doorways and junctions.
 */
export function findIndoorPath(start: Point, target: Point, floor = 1): Point[] {
  // 1. Direct path check: If line of sight is clear, drive straight
  if (!checkCollision(start, target, floor, 5.5)) {
    return [target];
  }

  const floorNodes = NAV_NODES[floor] || NAV_NODES[1];
  const startNode = findNearestVisibleNode(start, floor);
  const targetNode = findNearestVisibleNode(target, floor);

  if (startNode.id === targetNode.id) {
    // Both connect to the same door/junction
    return [{ x: startNode.x, y: startNode.y }, target];
  }

  // 2. Dijkstra / BFS shortest path on waypoint graph
  const queue: { id: string; path: string[]; cost: number }[] = [
    { id: startNode.id, path: [startNode.id], cost: 0 },
  ];
  const visited = new Set<string>();
  let shortestPathNodeIds: string[] | null = null;

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift()!;

    if (current.id === targetNode.id) {
      shortestPathNodeIds = current.path;
      break;
    }

    if (visited.has(current.id)) continue;
    visited.add(current.id);

    const node = floorNodes[current.id];
    if (!node) continue;

    for (const neighborId of node.neighbors) {
      if (visited.has(neighborId)) continue;
      const neighbor = floorNodes[neighborId];
      if (!neighbor) continue;

      const edgeDist = Math.hypot(neighbor.x - node.x, neighbor.y - node.y);
      queue.push({
        id: neighborId,
        path: [...current.path, neighborId],
        cost: current.cost + edgeDist,
      });
    }
  }

  if (!shortestPathNodeIds) {
    // Fallback if graph is partitioned: return target
    return [target];
  }

  const resultPoints: Point[] = [];

  // Add intermediate waypoint coordinates
  for (const nodeId of shortestPathNodeIds) {
    const node = floorNodes[nodeId];
    if (node) {
      resultPoints.push({ x: node.x, y: node.y });
    }
  }

  // Finally append destination point
  resultPoints.push(target);

  return resultPoints;
}
