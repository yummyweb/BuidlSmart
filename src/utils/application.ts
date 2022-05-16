import {
    AccountId,
    PrivateKey,
    Client,
    ContractFunctionParameters,
    ContractExecuteTransaction,
    ContractCallQuery,
    Hbar,
    TransactionReceipt,
    TokenId,
    TransactionId
} from "@hashgraph/sdk";
import Web3 from "web3";
import { getHashConnect } from "../HashConnectAPIProvider";

const web3 = new Web3;
const contract = "0.0.34711560"

interface Field {
    name: string
    type: string
}

interface Parameter {
    name: string
    type: string
}

interface Function {
    name: string
    type: string
}

export async function createApplication(applicationName: string) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");
    const walletId = loadLocalData()["accountIds"][0]
    const topic = loadLocalData()["topic"]
    const hashConnect = getHashConnect()

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

    const trans = new ContractExecuteTransaction()
        .setContractId(contract)
        .setGas(1000000)
        .setFunction(
            "newApplication",
            new ContractFunctionParameters().addString(applicationName)
        );

    const transactionBytes = await makeBytes(trans, walletId)
    const res = await hashConnect.sendTransaction(topic, {
        byteArray: transactionBytes,
        topic,
        metadata: {
            accountToSign: walletId,
            returnTransaction: false
        }
    })

    let responseData = {
        response: res,
        receipt: null
    }

    if (res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);
    return responseData
}

export async function getApplicationsOfUser(wallet: string) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

    const contractQueryTx = new ContractCallQuery()
        .setContractId(contract)
        .setGas(1000000)
        .setFunction("getAllApplications")
        .setQueryPayment(new Hbar("0.06"))
    const contractQuerySubmit = await contractQueryTx.execute(client);

    let userApplications = []
    let solAccoundId = AccountId.fromString(wallet).toSolidityAddress()

    for (let i = 0; i < decodeFunctionResult("getAllApplications", contractQuerySubmit.bytes)["0"].length; i++) {
        if (decodeFunctionResult("getAllApplications", contractQuerySubmit.bytes)["0"][i].creator.toLowerCase() === "0x" + solAccoundId) {
            userApplications.push(decodeFunctionResult("getAllApplications", contractQuerySubmit.bytes)["0"][i])
        }
    }

    return userApplications
}

export async function getApplicationData(applicationId: number) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

    const contractQueryTx = new ContractCallQuery()
        .setContractId(contract)
        .setGas(1000000)
        .setFunction("getAllApplications")
        .setQueryPayment(new Hbar("0.06"))
    const contractQuerySubmit = await contractQueryTx.execute(client);

    let application

    for (let i = 0; i < decodeFunctionResult("getAllApplications", contractQuerySubmit.bytes)["0"].length; i++) {
        if (parseInt(decodeFunctionResult("getAllApplications", contractQuerySubmit.bytes)["0"][i].id) === applicationId) {
            application = decodeFunctionResult("getAllApplications", contractQuerySubmit.bytes)["0"][i]
        }
    }

    return application
}

export async function createObject(id: number, objName: string) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");
    const walletId = loadLocalData()["accountIds"][0]
    const topic = loadLocalData()["topic"]
    const hashConnect = getHashConnect()

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

    const trans = new ContractExecuteTransaction()
        .setContractId(contract)
        .setGas(1000000)
        .setFunction(
            "addObjectToApplication",
            new ContractFunctionParameters().addUint256(id).addString(objName)
        );

    const transactionBytes = await makeBytes(trans, walletId)
    const res = await hashConnect.sendTransaction(topic, {
        byteArray: transactionBytes,
        topic,
        metadata: {
            accountToSign: walletId,
            returnTransaction: false
        }
    })

    let responseData = {
        response: res,
        receipt: null
    }

    if (res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);
    return responseData
}

export async function addFieldsToObject(id: number, objId: number, fields: Field[]) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");
    const walletId = loadLocalData()["accountIds"][0]
    const topic = loadLocalData()["topic"]
    const hashConnect = getHashConnect()

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

    let fieldNames: string[] = []
    let fieldTypes: string[] = []
    for (let i = 0; i < fields.length; i++) {
        fieldNames.push(fields[i].name)
        fieldTypes.push(fields[i].type)
    }

    const trans = new ContractExecuteTransaction()
        .setContractId(contract)
        .setGas(1000000)
        .setFunction(
            "addMultipleFieldsToObject",
            new ContractFunctionParameters().addUint256(id).addUint256(objId).addStringArray(fieldNames).addStringArray(fieldTypes)
        );

    const transactionBytes = await makeBytes(trans, walletId)
    const res = await hashConnect.sendTransaction(topic, {
        byteArray: transactionBytes,
        topic,
        metadata: {
            accountToSign: walletId,
            returnTransaction: false
        }
    })

    let responseData = {
        response: res,
        receipt: null
    }

    if (res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);
    return responseData
}

export async function createFunction(id: number, funcName: string, action: string, targetId: number, parameters: Parameter[], targetParams: string[]) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");
    const walletId = loadLocalData()["accountIds"][0]
    const topic = loadLocalData()["topic"]
    const hashConnect = getHashConnect()

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

    let paramNames: string[] = []
    let paramTypes: string[] = []
    for (let i = 0; i < parameters.length; i++) {
        paramNames.push(parameters[i].name)
        paramTypes.push(parameters[i].type)
    }

    if (parameters.length === 0) {
        paramNames.push("null")
        paramTypes.push("null")
    }

    if (targetParams.length === 0) {
        targetParams.push("null")
    }

    const trans = new ContractExecuteTransaction()
        .setContractId(contract)
        .setGas(1000000)
        .setFunction(
            "addFunctionToApplication",
            new ContractFunctionParameters().addUint256(id).addString(funcName).addString(action).addUint256(targetId).addStringArray(paramNames).addStringArray(paramTypes).addStringArray(targetParams)
        );

    const transactionBytes = await makeBytes(trans, walletId)
    const res = await hashConnect.sendTransaction(topic, {
        byteArray: transactionBytes,
        topic,
        metadata: {
            accountToSign: walletId,
            returnTransaction: false
        }
    })

    let responseData = {
        response: res,
        receipt: null
    }

    if (res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);
    return responseData
}

export async function updateContractId(id: number, contractId: string) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");
    const walletId = loadLocalData()["accountIds"][0]
    const topic = loadLocalData()["topic"]
    const hashConnect = getHashConnect()

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

    const trans = new ContractExecuteTransaction()
        .setContractId(contract)
        .setGas(1000000)
        .setFunction(
            "updateContract",
            new ContractFunctionParameters().addUint256(id).addString(contractId)
        );

    const transactionBytes = await makeBytes(trans, walletId)
    const res = await hashConnect.sendTransaction(topic, {
        byteArray: transactionBytes,
        topic,
        metadata: {
            accountToSign: walletId,
            returnTransaction: false
        }
    })

    let responseData = {
        response: res,
        receipt: null
    }

    if (res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);
    return responseData
}

export async function executeFunction(contractId: string, functionToExec: Function, abi: string, funcParameters: {}) {
    const operatorId = AccountId.fromString("0.0.34202240");
    const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420c0bce985953422c79e7294f2fc0a704b978e9f2788e50a02fcc19ced99742a6c");
    const walletId = loadLocalData()["accountIds"][0]
    const topic = loadLocalData()["topic"]
    const hashConnect = getHashConnect()

    const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(3));
    client.setMaxQueryPayment(new Hbar(1));

    if (functionToExec.type === "create") {
        console.log(funcParameters)
        const trans = new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(1000000)
            .setFunction(
                functionToExec.name,
                buildParameters(new ContractFunctionParameters, funcParameters)
            );

        const transactionBytes = await makeBytes(trans, walletId)
        const res = await hashConnect.sendTransaction(topic, {
            byteArray: transactionBytes,
            topic,
            metadata: {
                accountToSign: walletId,
                returnTransaction: false
            }
        })

        let responseData = {
            response: res,
            receipt: null
        }

        if (res.success) responseData.receipt = TransactionReceipt.fromBytes(res.receipt as Uint8Array);
        return responseData
    }
    else {
        const contractQueryTx = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(1000000)
            .setFunction(functionToExec.name)
            .setQueryPayment(new Hbar("0.06"))
        const contractQuerySubmit = await contractQueryTx.execute(client);

        const result = decodeFunctionResult(functionToExec.name, contractQuerySubmit.bytes, abi)
        return result
    }
}

function buildParameters(contractFunctionParameters, funcParams): ContractFunctionParameters {
    let builtFunctionParams = contractFunctionParameters
    for (let param of Object.keys(funcParams)) {
        if (typeof funcParams[param] === "string") {
            builtFunctionParams = builtFunctionParams.addString(funcParams[param])
        }
        else if (typeof funcParams[param] === "boolean") {
            builtFunctionParams = builtFunctionParams.addBool(funcParams[param])
        }
    }

    console.log(builtFunctionParams)
    return builtFunctionParams    
}

function decodeFunctionResult(functionName, resultAsBytes, _abi = null) {
    const abi = JSON.parse('[{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"funcName","type":"string"},{"internalType":"string","name":"action","type":"string"},{"internalType":"uint256","name":"targetId","type":"uint256"},{"internalType":"string[]","name":"paramNames","type":"string[]"},{"internalType":"string[]","name":"paramTypes","type":"string[]"},{"internalType":"string[]","name":"targetParams","type":"string[]"}],"name":"addFunctionToApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"applicationId","type":"uint256"},{"internalType":"uint256","name":"objId","type":"uint256"},{"internalType":"string[]","name":"fieldNames","type":"string[]"},{"internalType":"string[]","name":"fieldTypes","type":"string[]"}],"name":"addMultipleFieldsToObject","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"objName","type":"string"}],"name":"addObjectToApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"applications","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"string","name":"contractId","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllApplications","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"string","name":"contractId","type":"string"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"fieldType","type":"string"}],"internalType":"struct Application.FieldType[]","name":"fields","type":"tuple[]"}],"internalType":"struct Application.ObjectType[]","name":"objects","type":"tuple[]"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"action","type":"string"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"paramType","type":"string"}],"internalType":"struct Application.ParamType[]","name":"parameters","type":"tuple[]"},{"internalType":"string[]","name":"targetParams","type":"string[]"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"fieldType","type":"string"}],"internalType":"struct Application.FieldType[]","name":"fields","type":"tuple[]"}],"internalType":"struct Application.ObjectType","name":"target","type":"tuple"}],"internalType":"struct Application.FunctionType[]","name":"functions","type":"tuple[]"}],"internalType":"struct Application.ApplicationType[]","name":"","type":"tuple[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"appName","type":"string"}],"name":"newApplication","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"newContract","type":"string"}],"name":"updateContract","outputs":[],"stateMutability":"nonpayable","type":"function"}]')
    let abiToUse = abi

    if (_abi) {
        abiToUse = JSON.parse(_abi)
    }

    const functionAbi = abiToUse.find(func => func.name === functionName)
    const functionParameters = functionAbi.outputs;
    const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));
    const result = web3.eth.abi.decodeParameters(functionParameters, resultHex);
    return result;
}

async function makeBytes(trans: ContractExecuteTransaction, signingAcctId): Promise<Uint8Array> {
    let transId = TransactionId.generate(signingAcctId)
    trans.setTransactionId(transId);
    trans.setNodeAccountIds([new AccountId(3)]);

    await trans.freeze();

    let transBytes = trans.toBytes();

    return transBytes;
}

const loadLocalData = () => {
    let foundData = localStorage.getItem("hashconnectData");

    if (foundData) {
        const saveData = JSON.parse(foundData);
        // setSaveData(saveData);
        return saveData;
    } else return null;
}