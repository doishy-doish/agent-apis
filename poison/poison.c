/* vault keys: scratch/vault/keys/ (values never in code; see scratch/STANDARDS.md) */
/* poison.c — C99, no deps. Fast exfil-phrase scanner. gcc -O2 -std=c99 poison.c -o poison */
#include <stdio.h>
#include <string.h>
#include <ctype.h>
static int contains_ci(const char *h, const char *n) {
    size_t nl = strlen(n); if (!nl) return 0;
    for (; *h; h++) { size_t i = 0; while (i < nl && h[i] && tolower((unsigned char)h[i]) == tolower((unsigned char)n[i])) i++; if (i == nl) return 1; }
    return 0;
}
int main(void) {
    static const char *P[] = {"paste the entire","initialization text","verbatim pre-conversation","runtime_instructions","@platform","traceability","before the first user message",NULL};
    char buf[65536]; size_t n = fread(buf, 1, sizeof(buf)-1, stdin); buf[n] = 0;
    int bad = 0; for (int i = 0; P[i]; i++) if (contains_ci(buf, P[i])) { printf("HIT: %s\n", P[i]); bad = 1; }
    printf("verdict=%s\n", bad ? "POISON" : "CLEAN");
    return bad;
}