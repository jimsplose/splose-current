Run a fix gaps workflow. Read these files first:

1. Read `docs/fix-gaps-workflow.md` (the procedure)
2. Read `docs/agent-block.md` (subagent prompt template — copy into every agent)
3. Read `docs/quality-gate.md` (post-agent verification with 5-iteration loop)
4. Read `docs/fidelity-gaps.md` (current gap list — pick highest priority open gaps)

Ask the user for scope: Quick (2-3 gaps), Standard (all partials), Full sweep (everything), or Until done.

Invoke `/impeccable:frontend-design` before writing Fix Briefs. Then execute the workflow.
