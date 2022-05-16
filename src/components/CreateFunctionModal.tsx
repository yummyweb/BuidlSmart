import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, useToast, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { addFieldsToObject, createFunction, createObject } from "../utils/application"

export const CreateFunctionModal = ({ appData, applicationId, isOpen, onClose }: { appData: any, applicationId: number, isOpen: boolean, onClose: () => any }) => {
    const toast = useToast()
    const [functionName, setFunctionName] = useState(null)
    const [action, setAction] = useState(null)
    const [target, setTarget] = useState(null)
    const [targetParams, setTargetParams] = useState([])
    const [parameters, setParameters] = useState([])

    const addParameter = () => {
        setParameters(parameters.concat([{
            name: "",
            type: ""
        }]))
    }

    const updateParameterName = (i: number, name: HTMLInputElement["value"]) => {
        let _parameters = [...parameters]
        let parameter = { ..._parameters[i] }
        parameter.name = name
        _parameters[i] = parameter
        setParameters(_parameters)
    }

    const updateParameterType = (i: number, typeOfField: HTMLInputElement["value"]) => {
        let _parameters = [...parameters]
        let parameter = { ..._parameters[i] }
        parameter.type = typeOfField
        _parameters[i] = parameter
        setParameters(_parameters)
    }

    const updateTargetParams = (i: number, param: HTMLInputElement["value"]) => {
        let _parameters = [...targetParams]
        _parameters[i] = param
        setTargetParams(_parameters)
    }

    const saveToBlockchain = async () => {
        const res = await createFunction(applicationId, functionName, action, target, parameters, targetParams)
        if (res.receipt.status._code === 22) {
            toast({
                title: 'Function created.',
                description: "A new function is created for this application.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a new function</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={functionName} onChange={e => setFunctionName(e.target.value)} placeholder='Name' />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Action</FormLabel>
                        <Select onChange={e => setAction(e.target.value)} placeholder='Action'>
                            <option value="create">Create</option>
                            <option value="read">Read</option>
                        </Select>
                    </FormControl>
                    
                    <Button onClick={() => addParameter()} mt={4}>+ Add Function Parameter</Button>
                    {parameters.map((f, i) => (
                        <Box mt={4}>
                            <FormControl>
                                <FormLabel>Parameter Name</FormLabel>
                                <Input value={parameters[i].name} onChange={e => updateParameterName(i, e.target.value)} placeholder='Parameter Name' />
                            </FormControl>
                            <Select mt={4} onChange={e => updateParameterType(i, e.target.value)} placeholder='Type'>
                                <option value="string">String</option>
                                <option value="uint256">Number</option>
                                <option value="address">Address</option>
                                <option value="boolean">True / False</option>
                            </Select>
                        </Box>
                    ))}

                    <FormControl mt={4}>
                        <FormLabel>Target</FormLabel>
                        <Select value={target} onChange={e => setTarget(e.target.value)} placeholder='Target'>
                            {appData.objects.map(obj => (
                                <option value={obj.id}>{ obj.name }</option>
                            ))}
                        </Select>
                    </FormControl>
                    {target !== null && appData.objects[target] !== undefined ? (
                        appData.objects[target].fields.map((field, i) => (
                            <FormControl mt={4}>
                                <FormLabel>{ field.name }</FormLabel>
                                <Select onChange={e => updateTargetParams(i, e.target.value)} placeholder="Select parameter">
                                    {parameters.map(param => (
                                        <option value={param.name}>{ param.name }</option>
                                    ))}
                                </Select>
                            </FormControl>
                        ))
                    ) : null}
                </ModalBody>

                <ModalFooter>
                    <Button onClick={() => saveToBlockchain()} _hover={{ background: "purple.300" }} background='purple.500' color="white" mr={3}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}