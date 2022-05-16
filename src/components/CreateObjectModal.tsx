import { Box, Button, FormControl, Select, FormLabel, Input, Modal, ModalBody, ModalCloseButton, useToast, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { addFieldsToObject, createObject } from "../utils/application"

export const CreateObjectModal = ({ appData, applicationId, isOpen, onClose }: { appData: any, applicationId: number, isOpen: boolean, onClose: () => any }) => {
    const toast = useToast()
    const [appName, setAppName] = useState(null)
    const [fields, setFields] = useState([])

    const addField = () => {
        setFields(fields.concat([{
            name: "",
            type: ""
        }]))
    }

    const updateFieldName = (i: number, name: HTMLInputElement["value"]) => {
        let _fields = [...fields]
        let field = { ..._fields[i] }
        field.name = name
        _fields[i] = field
        setFields(_fields)
    }

    const updateFieldType = (i: number, typeOfField: HTMLInputElement["value"]) => {
        let _fields = [...fields]
        let field = { ..._fields[i] }
        field.type = typeOfField
        _fields[i] = field
        setFields(_fields)
    }

    const saveToBlockchain = async () => {
        const res = await createObject(applicationId, appName)
        if (res.receipt.status._code === 22) {
            const _res = await addFieldsToObject(applicationId, appData.objects.length, fields)
            if (res.receipt.status._code === 22) {
                toast({
                    title: 'Object created.',
                    description: "A new object is created for this application.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a new object</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={appName} onChange={e => setAppName(e.target.value)} placeholder='Name' />
                    </FormControl>

                    <Button onClick={() => addField()} mt={4}>+ Add Field</Button>
                    {fields.map((f, i) => (
                        <Box mt={4}>
                            <FormControl>
                                <FormLabel>Field Name</FormLabel>
                                <Input value={fields[i].name} onChange={e => updateFieldName(i, e.target.value)} placeholder='Field Name' />
                            </FormControl>
                            <Select mt={4} onChange={e => updateFieldType(i, e.target.value)} placeholder='Type'>
                                <option value="string">String</option>
                                <option value="uint256">Number</option>
                                <option value="address">Address</option>
                                <option value="boolean">True / False</option>
                            </Select>
                        </Box>
                    ))}
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