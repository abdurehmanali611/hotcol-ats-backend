import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import "dotenv/config";
import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";
import { authenticateRequest } from "./lib/auth.js";
import { prisma } from "./lib/prisma.js";

function assertPrismaAtsModels() {
  if (
    !prisma.ats_vacancy?.findMany ||
    !prisma.ats_application?.findMany ||
    !prisma.ats_access_otp?.findFirst
  ) {
    throw new Error(
      "[HotCol ATS API] Prisma client is out of date — expected ATS models are missing. Run `npm run prisma:generate` in BackEnd.",
    );
  }
}

assertPrismaAtsModels();

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    user: authenticateRequest(req),
    prisma,
    req,
  }),
});

await server.start();
server.applyMiddleware({
  app,
  path: "/graphql",
  bodyParserConfig: { limit: "2mb" },
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "HotCol ATS GraphQL API",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "HotCol ATS GraphQL API",
    graphql: "/graphql",
    health: "/health",
  });
});

export default app;

if (!process.env.VERCEL) {
  const port = process.env.PORT || 4006;
  app.listen(port, () => {
    console.log(`ATS API ready at http://localhost:${port}/graphql`);
    console.log(
      "Candidate: atsTenantPublic / atsOpenVacancies / applyAtsApplication",
    );
    console.log(
      "Admin: atsAdminUnlock / vacancies / applications / hireAtsApplication",
    );
  });
}
