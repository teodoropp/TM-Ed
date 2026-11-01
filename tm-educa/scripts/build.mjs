// Executa `next build` sempre com NODE_ENV=production.
// Um NODE_ENV não-standard (ex.: "development" herdado das variáveis do
// alojamento) faz o Next carregar o React de desenvolvimento durante o
// prerender e causa: "Cannot read properties of null (reading 'useContext')"
// em /_global-error.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const filho = spawn(process.execPath, [nextBin, "build", "--webpack"], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});

filho.on("exit", (codigo) => process.exit(codigo ?? 1));

