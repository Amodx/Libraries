export class FuzzySearch {
  private static _process(input: string): string[] {
    input = input.trim().toLowerCase().replace(/[_#]/g, " ");
    return input.split(/\s+/);
  }

  private static _processStrings(strings: string[]): string[] {
    return strings.flatMap((s) => this._process(s));
  }

  private static _levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];

    // If one of the strings is empty
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    // Initialize the first row and column of the matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // Substitution
            matrix[i][j - 1] + 1,     // Insertion
            matrix[i - 1][j] + 1      // Deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  private static _similarity(a: string, b: string): number {
    const distance = this._levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1; // Both strings are empty
    return 1 - distance / maxLen;
  }

  private static _compareBool(
    string: string,
    compare: string,
    threshold = 0.5
  ): boolean {
    const similarity = this._similarity(string, compare);
    return similarity >= threshold;
  }

  private static _compareNumber(string: string, compare: string): number {
    return this._similarity(string, compare);
  }

  static fuzzyHas(
    haystack: string[],
    needle: string[],
    threshold = 0.5
  ): boolean {
    haystack = this._processStrings(haystack);
    needle = this._processStrings(needle);

    for (let node of haystack) {
      for (let search of needle) {
        if (this._compareBool(node, search, threshold)) {
          return true;
        }
      }
    }
    return false;
  }

  static fuzzySearch(
    haystack: string[],
    needle: string[],
    threshold = 0.5
  ): string[] {
    haystack = this._processStrings(haystack);
    needle = this._processStrings(needle);

    const matches: string[] = [];
    for (let node of haystack) {
      for (let search of needle) {
        if (this._compareBool(node, search, threshold)) {
          matches.push(node);
          break; // No need to check other needles if one matches
        }
      }
    }
    return matches;
  }

  static fuzzyCloseMatch(
    haystack: string[],
    needle: string[],
    overallThreshold = 0.5
  ): boolean {
    haystack = this._processStrings(haystack);
    needle = this._processStrings(needle);

    let totalScore = 0;
    let comparisons = 0;

    for (let node of haystack) {
      for (let search of needle) {
        const score = this._compareNumber(node, search);
        totalScore += score;
        comparisons += 1;
      }
    }

    if (comparisons === 0) return false; // Avoid division by zero

    // Calculate the average score and compare with the threshold
    const averageScore = totalScore / comparisons;
    return averageScore >= overallThreshold;
  }
}
