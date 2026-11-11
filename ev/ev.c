/* vault keys: scratch/vault/keys/ (values never in code; see scratch/STANDARDS.md) */
/* ev.c — C99, no deps. Lottery-or-not math. gcc -O2 -std=c99 -Wall ev.c -o ev */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(int argc, char **argv) {
    double prize = argc > 1 ? atof(argv[1]) : 1.0;
    double fee = argc > 2 ? atof(argv[2]) : 0.0;
    long subs = argc > 3 ? atol(argv[3]) : 1;
    if (subs < 1) subs = 1;
    double ev = prize / (double)subs - fee;
    printf("ev=%.6f\n", ev);
    if (fee > 0.0) printf("breakeven=%.2f\n", prize / fee);
    printf("verdict=%s\n", ev >= 0 ? (fee == 0 ? "FREE-PLAYABLE" : "FAIR+") : "LOTTERY-TRAP");
    return 0;
}