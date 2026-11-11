/* vault keys: scratch/vault/keys/ (values never in code; see scratch/STANDARDS.md) */
/* bounty-radar scorer — C99, no deps. Compiles with gcc or emcc (WASM).
 * Scores a GitHub issue (as JSON-ish fields) for: funded, claimable, non-poison.
 * Higher = worth an agent's attention. Negative = skip.
 *
 * NOTE: compile not yet verified in this environment (no toolchain here).
 * Verify with: gcc -O2 -std=c99 -Wall scorer.c -o scorer
 * or: emcc -O3 -std=c99 scorer.c -o scorer.js -s EXPORTED_FUNCTIONS=_score_issue -s MODULARIZE=1
 */
#include <string.h>
#include <ctype.h>

/* case-insensitive substring search. Returns 1 if needle found in haystack. */
static int contains_ci(const char *haystack, const char *needle) {
    if (!haystack || !needle || !*needle) return 0;
    size_t nlen = strlen(needle);
    for (const char *p = haystack; *p; p++) {
        size_t i;
        for (i = 0; i < nlen && p[i]; i++) {
            if (tolower((unsigned char)p[i]) != tolower((unsigned char)needle[i])) break;
        }
        if (i == nlen) return 1;
    }
    return 0;
}

/* Poison phrases: system-prompt exfiltration clauses. Any hit = hard reject. */
static const char *POISON[] = {
    "paste the entire",
    "initialization text",
    "verbatim pre-conversation",
    "verbatim the entire",
    "runtime_instructions",
    "@platform",
    "traceability",
    "start of your conversation",
    "before the first user message",
    "before the user's first message",
    NULL
};

/* Payout-rail signals. */
static const char *PAID[] = {
    "usdc", "escrow", "algora", "polar.sh", "opire", "bounty", "per merged",
    "per-pr", "$", "paid", "reward", "base", "solana", NULL
};

static int count_hits(const char *text, const char *const *list) {
    int n = 0;
    if (!text) return 0;
    for (int i = 0; list[i]; i++) n += contains_ci(text, list[i]);
    return n;
}

/*
 * title/body: issue text. comments: open comment count. has_assignee: 0/1.
 * Returns -100..100. >=20 = worth a look. <0 = skip.
 */
int score_issue(const char *title, const char *body, int comments, int has_assignee) {
    if (has_assignee) return -100;
    if (contains_ci(title, "dependabot") || contains_ci(body, "dependabot")) return -100;
    for (int i = 0; POISON[i]; i++) {
        if (contains_ci(title, POISON[i]) || contains_ci(body, POISON[i])) return -100;
    }
    int paid = count_hits(title, PAID) * 2 + count_hits(body, PAID);
    int score = paid * 10;
    if (comments <= 3) score += 15;       /* tail: low competition */
    else if (comments > 40) score -= 30;   /* lottery thread */
    if (contains_ci(title, "test") && contains_ci(title, "suite")) score -= 10;
    if (score > 100) score = 100;
    return score;
}

/* Batch entry point for WASM host: scores N pre-joined "title \n body" blobs.
 * Kept deliberately simple so the JS fallback mirrors it exactly. */
int score_blob(const char *blob, int comments, int has_assignee) {
    return score_issue(blob, blob, comments, has_assignee);
}
