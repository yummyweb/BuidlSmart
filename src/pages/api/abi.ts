import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import { spawnSync } from  'child_process';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const app = req.body.applicationName

    const solcJs = spawnSync('solcjs', ['--abi', app.replace(/\s/g, '') + ".sol"]);

    console.log(`stderr: ${solcJs.stderr.toString()}`)
    console.log(`stdout: ${solcJs.stdout.toString()}`)

    res.status(200).json({ success: true, abi: fs.readFileSync(app.replace(/\s/g, '') + "_sol_" + app.replace(/\s/g, '') + ".abi", "utf-8") });
}