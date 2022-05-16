require("dotenv").config();
const {
	AccountId,
	PrivateKey,
	Client,
	FileCreateTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	ContractCallQuery,
	Hbar,
    FileAppendTransaction
} = require("@hashgraph/sdk");
const fs = require("fs");
const Web3 = require("web3");

const web3 = new Web3;

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

let abi;
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
client.setDefaultMaxTransactionFee(new Hbar(8));
client.setMaxQueryPayment(new Hbar(1));

async function main() {
	// Import the compiled contract bytecode
	const contractBytecode = fs.readFileSync("contract.bin");
    abi = JSON.parse(fs.readFileSync('contract.abi', 'utf8'));

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

	console.log(`- The bytecode file ID is: ${bytecodeFileId} \n`);

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

	// Create a new application
	const contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(5000000)
		.setFunction(
            "newApplication",
            new ContractFunctionParameters().addString("User Authentication") 
        );
	const contractExecuteSubmit = await contractExecuteTx.execute(client);
    const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
    console.log(`- Application creation status: ${contractExecuteRx.status} \n`);

    // Add object to created application
	const _contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(1000000)
        .setFunction(
            "addObjectToApplication",
            new ContractFunctionParameters().addUint256(0).addString("User")
        );
    const _contractExecuteSubmit = await _contractExecuteTx.execute(client);
    const _contractExecuteRx = await _contractExecuteSubmit.getReceipt(client);
    console.log(`- Object creation status: ${_contractExecuteRx.status} \n`);

    // Add field to created object
	const __contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(1000000)
        .setFunction(
            "addMultipleFieldsToObject",
            new ContractFunctionParameters().addUint256(0).addUint256(0).addStringArray(["name", "wow"]).addStringArray(["string", "uint"])
        );
    const __contractExecuteSubmit = await __contractExecuteTx.execute(client);
    const __contractExecuteRx = await __contractExecuteSubmit.getReceipt(client);
    console.log(`- Field creation status: ${__contractExecuteRx.status} \n`);

    // Add field to created object
	const ___contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(1000000)
        .setFunction(
            "addFunctionToApplication",
            new ContractFunctionParameters().addUint256(0).addString("createUser").addString("create").addUint256(0).addStringArray(["name", "email"]).addStringArray(["string", "string"]).addStringArray(["superb", "whooooo"])
        );
    const ___contractExecuteSubmit = await ___contractExecuteTx.execute(client);
    const ___contractExecuteRx = await ___contractExecuteSubmit.getReceipt(client);
    console.log(`- Function creation status: ${___contractExecuteRx.status} \n`);

    // Change contract ID
	const ____contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(1000000)
        .setFunction(
            "updateContract",
            new ContractFunctionParameters().addUint256(0).addString("1.0.0.0")
        );
    const ____contractExecuteSubmit = await ____contractExecuteTx.execute(client);
    const ____contractExecuteRx = await ____contractExecuteSubmit.getReceipt(client);
    console.log(`- Update contract status: ${____contractExecuteRx.status} \n`);

    const contractQueryTx = new ContractCallQuery()
		.setContractId(contractId)
        .setQueryPayment(new Hbar("0.06")) 
		.setGas(1000000)
		.setFunction("getAllApplications")
	const contractQuerySubmit = await contractQueryTx.execute(client);
    console.log(decodeFunctionResult("getAllApplications", contractQuerySubmit.bytes)["0"][0]);
    console.log(decodeFunctionResult("getAllApplications", contractQuerySubmit.bytes)["0"][0].objects[0].fields);
}

function decodeFunctionResult(functionName, resultAsBytes) {
    const functionAbi = abi.find(func => func.name === functionName);
    const functionParameters = functionAbi.outputs;
    const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));
    const result = web3.eth.abi.decodeParameters(functionParameters, resultHex);
    return result;
}

function splitChunks(string) {
    var regex = RegExp(".{1,"+Math.ceil(string.length/4)+"}", 'g');
    return string.match(regex);
}

main();