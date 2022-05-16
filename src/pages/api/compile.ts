import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import { spawnSync } from  'child_process';
import {
	AccountId,
	PrivateKey,
	Client,
	FileCreateTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	ContractCallQuery,
	Hbar,
    FileAppendTransaction,
    FileId
} from "@hashgraph/sdk";

let id = 0

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);
client.setDefaultMaxTransactionFee(new Hbar(8));
client.setMaxQueryPayment(new Hbar(1));

function splitChunks(string) {
    var regex = RegExp(".{1,"+Math.ceil(string.length/4)+"}", 'g');
    return string.match(regex);
}

const deployToHTS = async (id, app): Promise<FileId> => {
    const contractBytecode = fs.readFileSync(app.replace(/\s/g, '') + "_sol_" + app.replace(/\s/g, '') + ".bin");

    // Create a file on Hedera and store the bytecode
	const fileCreateTx = new FileCreateTransaction()
        .setContents(splitChunks(contractBytecode.toString())[0])
        .setKeys([operatorKey])
        .freezeWith(client)

    const fileCreateSign = await fileCreateTx.sign(operatorKey);
    const fileCreateSubmit = await fileCreateSign.execute(client);
    const fileCreateRx = await fileCreateSubmit.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;

    const appendedFile = await new FileAppendTransaction()
        .setFileId(bytecodeFileId)
        .setContents(Buffer.from(splitChunks(contractBytecode.toString())[1], "utf-8"))
        .setMaxTransactionFee(new Hbar(5))
        .freezeWith(client);

    const appendedFileSign = await appendedFile.sign(operatorKey);
    const appendedFileSubmit = await appendedFileSign.execute(client);
    const appendedFileRx = await appendedFileSubmit.getReceipt(client);

    const moreAppendedFile = await new FileAppendTransaction()
        .setFileId(bytecodeFileId)
        .setContents(Buffer.from(splitChunks(contractBytecode.toString())[2], "utf-8"))
        .setMaxTransactionFee(new Hbar(5))
        .freezeWith(client);

    const moreAppendedFileSign = await moreAppendedFile.sign(operatorKey);
    const moreAppendedFileSubmit = await moreAppendedFileSign.execute(client);
    const moreAppendedFileRx = await moreAppendedFileSubmit.getReceipt(client);

    const evenMoreAppendedFile = await new FileAppendTransaction()
        .setFileId(bytecodeFileId)
        .setContents(Buffer.from(splitChunks(contractBytecode.toString())[3], "utf-8"))
        .setMaxTransactionFee(new Hbar(5))
        .freezeWith(client);

    const evenMoreAppendedFileSign = await evenMoreAppendedFile.sign(operatorKey);
    const evenMoreAppendedFileSubmit = await evenMoreAppendedFileSign.execute(client);
    const evenMoreAppendedFileRx = await evenMoreAppendedFileSubmit.getReceipt(client);

    return bytecodeFileId
}

const createSmartContract = async (bytecodeFileId) => {
    // Instantiate the smart contract
	const contractInstantiateTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(5000000)

    const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
    const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
    const contractId = contractInstantiateRx.contractId;
    const contractAddress = contractId.toSolidityAddress();
    console.log(`- The smart contract ID is: ${contractId} \n`);
    console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

    return [contractId, contractAddress]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const content = req.body.content
    const app = req.body.applicationName

    fs.writeFileSync(app.replace(/\s/g, '') + ".sol", content);
    const solcJs = spawnSync('solcjs', ['--bin', app.replace(/\s/g, '') + ".sol"]);

    console.log(`stderr: ${solcJs.stderr.toString()}`)
    console.log(`stdout: ${solcJs.stdout.toString()}`)

    const bytecodeFileId = await deployToHTS(id, app)
    const deployedContract = await createSmartContract(bytecodeFileId)

    res.status(200).json({ success: true, deployedContract });
}