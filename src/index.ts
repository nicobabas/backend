import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { buildSchema } from "type-graphql";
import db from "./db";
import { CountryResolver } from "./resolver/CountryResolver";

import { env } from "./env";

import cors from "cors";
import express from "express";
import http from "http";

export interface ContextType {
  req: express.Request;
  res: express.Response;
}

const start = async (): Promise<void> => {
  await db.initialize();

  console.log("Connected to the database.");

  const app = express();
  const httpServer = http.createServer(app);
  const allowedOrigins = env.CORS_ALLOWED_ORIGINS.split(",");

  // https://www.npmjs.com/package/cors#configuring-cors-w-dynamic-origin
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (typeof origin === "undefined" || allowedOrigins.includes(origin))
          return callback(null, true);
        callback(new Error("Not allowed by CORS"));
      },
    })
  );

  const schema = await buildSchema({
    resolvers: [CountryResolver],
  });

  // https://www.apollographql.com/docs/apollo-server/v3/integrations/middleware#apollo-server-express
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    // https://www.apollographql.com/docs/apollo-server/v3/security/authentication/#putting-authenticated-user-info-on-the-context
    context: async ({ req, res }): Promise<ContextType> => ({ req, res }),
  });

  await server.start();
  server.applyMiddleware({ app, cors: false, path: "/" });
  httpServer.listen({ port: env.SERVER_PORT }, () =>
    console.log(
      `🚀 Server ready at ${env.SERVER_HOST}:${env.SERVER_PORT}${server.graphqlPath}`
    )
  );
};

void start();
