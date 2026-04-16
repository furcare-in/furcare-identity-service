import prisma from "../../../utils/prisma.js";

// Levenshtein distance for fuzzy search
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      );
    }
  }

  return matrix[a.length][b.length];
};

const getContentLibrary = async (filters: any) => {
  const { search, businessBranchId } = filters;
  const whereConditions: any = { active: true };

  if (businessBranchId) {
    whereConditions.OR = [
      { businessBranchId: businessBranchId },
      { businessBranchId: null }, // Include Global Content
    ];
  }

  // If search is applied, fetch all (filtered by branch) and do fuzzy search in memory
  if (search) {
    // 1. Fetch potential candidates (all active content for the branch)
    const contents = await prisma.content.findMany({
      where: whereConditions,
    });

    // 2. Filter and Sort by Levenshtein Distance
    const searchLower = search.toLowerCase();
    const threshold = 5; // Allow some typos

    const results = contents
      .map((item) => {
        const titleLower = item.title.toLowerCase();

        // Check for exact substring match first (distance 0 equivalent logic for ranking)
        if (titleLower.includes(searchLower)) {
          return { item, distance: 0 };
        }

        const words = titleLower.split(/\s+/);
        // Find min distance to any word in title
        const distance = Math.min(...words.map(w => levenshteinDistance(searchLower, w)));

        return { item, distance };
      })
      .filter((result) => result.distance <= threshold)
      .sort((a, b) => a.distance - b.distance)
      .map((result) => result.item)
      .slice(0, 20); // Limit results

    return results;
  }

  // If ONLY branch filter is applied (no search), return flat list? 
  // Wait, existing logic said "If search OR branch filter". 
  // But typically dropdown needs flat list if searching, or if just listing?
  // The frontend dropdown only calls with search if length > 2 via debounce.
  // So if just branch ID provided (not search), it might be the main page calling?
  // The main page calls `/api/v1/content-library` (no branch param in URL displayed in view_file earlier, but context has `selectedBranch`).
  // Actually, look at ContentDropDown.js: 
  // `/api/v1/content-library?businessBranchId=${selectedBranch.id}&search=${searchText}`
  // So it sends BOTH.
  // 
  // Main Page (ContentLibraryPage.js):
  // axiosInstance.get(`/api/v1/content-library`) -> No params!
  //
  // So:
  // IF search -> Return flat list (Fuzzy)
  // IF businessBranchId ONLY -> Return flat list ?? 
  // Warning: The main page logic `fetchContent` does NOT send parameters.
  // So `businessBranchId` being present assumes it's the Dropdown or another keyed view.
  // However, `ContentLibraryPage.js` depends on global content or logic that uses `selectedBranch` from context but the API call shown:
  // `axiosInstance.get(/api/v1/content-library)` <-- No params. 
  // So Main Page -> No Params -> Grouped Object.
  // Dropdown -> `search` AND `businessBranchId` -> Flat List.

  if (businessBranchId) {
    // If just filtering by branch but no search, return matches as list? 
    // The implementation plan said: "If search or businessBranchId is provided -> Return Flat List".
    // Let's stick to that for now, assuming Dropdown usage.
    const contents = await prisma.content.findMany({
      where: whereConditions
    });
    return contents;
  }

  // Otherwise return grouped object (for main library page)
  const contents = await prisma.content.findMany({});

  return contents.reduce(
    (acc, curr) => {
      if (acc[curr.category]) acc[curr.category].content.push(curr);
      else acc[curr.category] = { content: [curr] };
      return acc;
    },
    {} as Record<string, any>,
  );
};

const getContentById = (id: string) => {
  return prisma.content.findUnique({ where: { id } });
};

const updateContent = (id: string, data: any) => {
  return prisma.content.update({ where: { id }, data });
};

const createContent = (data: any) => {
  return prisma.content.create({ data });
};

const contentLibraryService = {
  getContentLibrary,
  getContentById,
  updateContent,
  createContent,
};
export default contentLibraryService;
