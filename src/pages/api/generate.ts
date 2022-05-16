import type { NextApiRequest, NextApiResponse } from 'next'
import { compileFromJson } from "../../utils/solidity_helper"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const content = compileFromJson(req.body)
    res.status(200).json({ success: true, content })
}