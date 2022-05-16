const withLatestSolVersion = soliditySrc => {
    return `pragma solidity ^0.8.13;\n\n${soliditySrc}`
}

const applyObjects = (soliditySrc, modelJson) => {
    let solSrc = ""
    for (let i = 0; i < modelJson.objects.length; i++) {
        const object = modelJson.objects[i]
        solSrc = solSrc + `\tstruct ${object[1]} {` // 0 index ---> id; 1 index ---> name;

        for (let j = 0; j < modelJson.objects[i][2].length; j++) {
            const field = modelJson.objects[i][2][j]

            let parameterType
            switch (field[2]) {
                case "boolean":
                    parameterType = "bool"
                    break;
            
                default:
                    parameterType = field[2]
                    break;
            }

            solSrc = solSrc + `\n\t\t${parameterType} ${field[1]};`
        }

        if (modelJson.objects.length - 1 === i) {
            solSrc = solSrc + "\n\t}"
        }
        else solSrc = solSrc + "\n\t}\n\n"
    }

    return `${soliditySrc}\n\n${solSrc}`
}

const applyFunctions = (soliditySrc, modelJson) => {
    let solSrc = ""
    console.log(modelJson.functions)
    for (let i = 0; i < modelJson.functions.length; i++) {
        const _function = modelJson.functions[i]
        solSrc = solSrc + `\n\tfunction ${_function[1]}(` // 0 index ---> id; 1 index ---> name;

        for (let j = 0; j < modelJson.functions[i][3].length; j++) {
            const parameter = modelJson.functions[i][3][j][1]
            const parameterType = modelJson.functions[i][3][j][2]
            let _parameterType = parameterType

            switch (parameterType) {
                case "string":
                    _parameterType = "string memory"
                    break;

                case "boolean":
                    _parameterType = "bool"
                    break;
            
                default:
                    break;
            }

            if (modelJson.functions[i][3].length - 1 === j) {
                solSrc = solSrc + `${modelJson.functions[i][2] === "create" ? `${_parameterType} ${parameter}` : ""}) public ${modelJson.functions[i][2] === "read" ? "returns(" + modelJson.functions[i][5][1] + "[] memory)" : ""} {`
            }
            else {
                solSrc = solSrc + `${modelJson.functions[i][2] === "create" ? `${_parameterType} ${parameter}, ` : ""}`
            }
        }

        if (modelJson.functions[i][2] === "create") {
            const objectName = "_" + modelJson.functions[i][5][1]
            solSrc = solSrc + `\n\t\t${objectName}.push();`
            solSrc = solSrc + `\n\t\tuint256 newIndex = ${objectName}.length - 1;\n`

            for (let k = 0; k < modelJson.functions[i][5][2].length; k++) {
                solSrc = solSrc + `\n\t\t${objectName}[newIndex].${modelJson.functions[i][5][2][k][1]} = ${modelJson.functions[i][3][k][1]};`
            }
        }
        else if (modelJson.functions[i][2] === "read") {
            const objectName = "_" + modelJson.functions[i][5][1]
            solSrc = solSrc + `\n\t\treturn ${objectName};`
        }

        solSrc = solSrc + `\n\t}\n`
    }

    return `${soliditySrc}\n${solSrc}`
}

const addObjectArrays = (soliditySrc, modelJson) => {
    let solSrc = ""
    for (let i = 0; i < modelJson.objects.length; i++) {
        const object = modelJson.objects[i]
        solSrc = solSrc + `${object[1]}[] public _${object[1]};\n`
    }

    return `${soliditySrc}\n\t${solSrc}`
}

export const compileFromJson = modelJson => {
    return `${applyFunctions(applyObjects(addObjectArrays(withLatestSolVersion(`contract ${modelJson.name.replace(/\s/g, '')} {`), modelJson), modelJson), modelJson)} \n}`
}