import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, useToast, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Textarea } from "@chakra-ui/react"
import { ChangeEvent, useEffect, useState } from "react"
import { addFieldsToObject, createFunction, createObject, executeFunction } from "../utils/application"

export const PlaygroundModal = ({ appData, applicationId, isOpen, onClose }: { appData: any, applicationId: number, isOpen: boolean, onClose: () => any }) => {
    const toast = useToast()
    const [functionToExec, setFunctionToExec] = useState({ name: null, type: null })
    const [functionResult, setFunctionResult] = useState("")
    const [functionParams, setFunctionParams] = useState({})
    const [loading, setLoading] = useState(false)

    const testFunction = async () => {
        setLoading(true)
        const res = await fetch("/api/abi", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ applicationName: appData.name })
        })
        const abi = await res.json()
        const _functionResult = await executeFunction(appData.contractId, functionToExec, abi.abi, functionParams)
        setLoading(false)
        setFunctionResult(JSON.stringify(_functionResult))
    }

    const updateParameter = (e: any, paramName: string) => {
        const val = {}
        val[paramName] = e
        setFunctionParams({
            ...functionParams,
            ...val
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Playground</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl mt={4}>
                        <FormLabel>Function</FormLabel>
                        <Select placeholder='Function' onChange={e => setFunctionToExec({ name: e.target.value.split(" ")[0], type:  e.target.value.split(" ")[1]})}>
                            {appData.functions.map(f => (
                                <option value={f.name + " " + f.action}>{ f.name }</option>
                            ))}
                        </Select>
                    </FormControl>

                    {appData.functions.filter(f => functionToExec.name === f.name).length !== 0 && appData.functions.filter(f => functionToExec.name === f.name)[0].action !== "read" ? appData.functions.filter(f => functionToExec.name === f.name)[0][3].map(p => (
                        <FormControl mt={4}>
                            <FormLabel>{ p.name }</FormLabel>
                            {p.paramType === "boolean" ? (
                                <Select onChange={e => updateParameter((e.target.value === 'true'), p.name)} placeholder="Choose option">
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </Select>
                            ) : <Input onChange={e => updateParameter(e.target.value, p.name)} placeholder={p.name} />}
                        </FormControl>
                    )) : null}

                    <FormControl mt={4}>
                        <FormLabel>Result</FormLabel>
                        <Textarea isDisabled value={"" + functionResult + ""} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button isLoading={loading} onClick={() => testFunction()} _hover={{ background: "purple.300" }} background='purple.500' color="white" mr={3}>
                        Test
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}