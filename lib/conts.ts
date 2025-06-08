export const SECTION_TYPE_RIVER_SECTION = 1
export const SECTION_TYPE_SLALOM_SECTION = 2
export const SECTION_TYPE_FREESTYLE_SPOT = 3
export const SECTION_TYPE_WATERFALL = 4

export interface SectionType {
  id: number
  name: string
  needsOverpass: boolean
}

export const SECTION_TYPES: SectionType[] = [
  {
    id: SECTION_TYPE_RIVER_SECTION,
    name: 'River Section',
    needsOverpass: true,
  },
  {
    id: SECTION_TYPE_SLALOM_SECTION,
    name: 'Slalom Section',
    needsOverpass: true,
  },
  {
    id: SECTION_TYPE_FREESTYLE_SPOT,
    name: 'Freestyle Spot',
    needsOverpass: false,
  },
  { id: SECTION_TYPE_WATERFALL, name: 'Waterfall', needsOverpass: false },
]

export function getSectionTypeDetails(typeId: number): SectionType | undefined {
  return SECTION_TYPES.find(type => type.id === typeId)
}
