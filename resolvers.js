import { DateTimeResolver, GraphQLJSON } from "graphql-scalars";
import { createAtsResolvers } from "./atsGraphql.js";
import { prisma } from "./lib/prisma.js";

const atsResolvers = createAtsResolvers({ prisma });

export const resolvers = {
  DateTime: DateTimeResolver,
  JSON: GraphQLJSON,
  AtsVacancy: atsResolvers.AtsVacancy,
  AtsApplication: atsResolvers.AtsApplication,
  Query: {
    _health: () => "HotCol ATS GraphQL API is running",
    ...atsResolvers.Query,
  },
  Mutation: {
    _noop: () => true,
    ...atsResolvers.Mutation,
  },
};
