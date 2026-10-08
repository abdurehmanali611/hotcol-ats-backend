import { gql } from "apollo-server-express";
import {
  atsMutationFields,
  atsQueryFields,
  atsTypeDefs,
} from "./atsGraphql.js";

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  ${atsTypeDefs}

  type Query {
    _health: String
    ${atsQueryFields}
  }

  type Mutation {
    _noop: Boolean
    ${atsMutationFields}
  }
`;
