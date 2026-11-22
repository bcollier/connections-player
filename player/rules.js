/*
  The rules of the Connections game: no DOM, no storage, no timers.

  Moved out of player/player.js so they can be tested in Node. Every function
  takes arguments and returns a value; player.js does the drawing and calls
  these for every decision. The bodies are the original code, moved, not
  rewritten.
*/

export const COLORS = ['Yellow', 'Green', 'Blue', 'Purple'];
export const EMOJI = { Yellow: '\u{1F7E8}', Green: '\u{1F7E9}', Blue: '\u{1F7E6}', Purple: '\u{1F7EA}' };
export const MAX_MISTAKES = 4;

/** A word reduced to capital letters and digits, used to compare guesses. */
export const canon = w => String(w).toUpperCase().replace(/[^A-Z0-9]/g, '');

/** A shuffled copy of arr (Fisher-Yates). random is injectable for tests. */
export function shuffled(arr, random = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * A puzzle as the game uses it: words in capitals, a known color on every
 * group (a missing or unknown color falls back by position), groups sorted
 * Yellow to Purple, and story/definitions kept only when well formed.
 */
export function normalizePuzzle(p) {
  const cats = (p.categories || []).map((c, i) => ({
    label: String(c.label),
    words: c.words.map(w => String(w).toUpperCase()),
    explanation: c.explanation || '',
    color: COLORS.includes(c.color) ? c.color : COLORS[i % 4],
    story: c.story && c.story.url ? c.story : null,
    definitions: Array.isArray(c.definitions) && c.definitions.length === 4 ? c.definitions.map(String) : null,
  }));
  cats.sort((a, b) => COLORS.indexOf(a.color) - COLORS.indexOf(b.color));
  return { ...p, categories: cats };
}

/** The key that spots a repeated guess: the same four words in any order or case. */
export function guessKey(words) {
  return words.map(canon).sort().join('|');
}

/** The group a word belongs to, or undefined. */
export function categoryOf(word, categories) {
  return categories.find(c => c.words.includes(word));
}

/** The color of each picked word's group, in the order picked: one row of the share grid. */
export function guessColors(picked, categories) {
  return picked.map(w => categoryOf(w, categories).color);
}

/**
 * Score a guess of four words. Returns the group most of them belong to, how
 * many of the four are in it, and the verdict: 'correct' (4), 'away' (3,
 * "One away...") or 'miss'.
 */
export function scoreGuess(picked, categories) {
  const counts = new Map();
  for (const w of picked) counts.set(categoryOf(w, categories), (counts.get(categoryOf(w, categories)) || 0) + 1);
  const [best, n] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return { best, n, verdict: n === 4 ? 'correct' : n >= 2 ? 'away' : 'miss' };
}

/**
 * Saved progress, checked before it is trusted. Returns the fields to resume
 * from, or null when the save does not match this puzzle's words (a different
 * puzzle under the same key, or a damaged save).
 */
export function restoreProgress(progress, order, maxMistakes = MAX_MISTAKES) {
  const words = new Set(order);
  const resume = progress && Array.isArray(progress.order) && progress.order.length === order.length && progress.order.every(w => words.has(w)) ? progress : null;
  if (!resume) return null;
  return {
    order: resume.order.slice(),
    mistakes: Math.min(maxMistakes, Number(resume.mistakes) || 0),
    guesses: Array.isArray(resume.guesses) ? resume.guesses : [],
    guessed: new Set(Array.isArray(resume.guessed) ? resume.guessed : []),
    over: Boolean(resume.over),
    won: Boolean(resume.won),
    solved: resume.solved || [],
  };
}

/** All saved games, keeping the newest `keep` by their `at` time. */
export function trimProgress(all, keep = 40) {
  const keys = Object.keys(all).sort((a, b) => (all[b].at || 0) - (all[a].at || 0)).slice(0, keep);
  return Object.fromEntries(keys.map(k => [k, all[k]]));
}

/** The guesses as rows of colored squares, one row per guess. */
export function shareGrid(guesses) {
  return guesses.map(g => g.map(c => EMOJI[c]).join('')).join('\n');
}

/** The line under the end-of-game title. */
export function endSummary({ won, guesses, mistakes, solved }) {
  return won
    ? `${guesses.length} guesses, ${mistakes} ${mistakes === 1 ? 'mistake' : 'mistakes'}.`
    : `${solved.filter(c => !c.missed).length} groups found before the mistakes ran out.`;
}

/** The ?theme=&puzzle= in a URL's query string, as [packId, zero-based index], or null. */
export function parseUrl(search, packIds) {
  const q = new URLSearchParams(search);
  const pack = q.get('theme');
  const n = parseInt(q.get('puzzle') || '1', 10);
  return pack && packIds.includes(pack) ? [pack, Number.isFinite(n) ? n - 1 : 0] : null;
}
