import prisma from "./src/index";

const nulls = await prisma.$queryRaw<{ n: number }[]>`
	SELECT count(*)::int AS n FROM place WHERE labels IS NULL`;

const usable = await prisma.$queryRaw<{ n: number }[]>`
	SELECT count(*)::int AS n FROM place
	WHERE NOT COALESCE('skip' = ANY(labels::text[]), false)`;

const scores = await prisma.$queryRaw<{ n: number }[]>`
	SELECT count(*) FROM place WHERE score > 0;
`;

const top = await prisma.$queryRaw<{ n: number }[]>`
	SELECT name, score FROM place ORDER BY score DESC LIMIT 5;
`;

console.log("labels NULL:", nulls[0]?.n, "(want 0)");
console.log("usable:", usable[0]?.n, "(want 4836)");
console.log("score:", scores[0]?.n);
console.log("top:", top[0]?.n);
process.exit(0);
