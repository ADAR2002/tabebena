// Vercel catch-all serverless function to run NestJS compiled server
// It loads the compiled handler from dist/main.js (built during `vercel-build`)
// Types are omitted to avoid requiring @vercel/node in dependencies
// eslint-disable-next-line @typescript-eslint/no-var-requires
const handler = require('../dist/main').default as (req: any, res: any) => Promise<any>;

export default async function vercelHandler(req: any, res: any) {
  return handler(req, res);
}
