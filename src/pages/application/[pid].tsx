import { Box, Input, FormLabel, FormControl, Button, Flex, Text, UnorderedList, ListItem, useToast, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { CreateFunctionModal } from '../../components/CreateFunctionModal'
import { CreateObjectModal } from '../../components/CreateObjectModal'
import { Navbar } from '../../components/Navbar'
import { PlaygroundModal } from '../../components/PlaygroundModal'
import { getApplicationData, updateContractId } from '../../utils/application'

const Application = () => {
    const router = useRouter()
    const toast = useToast()
    const [application, setApplication] = useState(null)
    const [openObjectModal, setOpenObjectModal] = useState(null)
    const [openFunctionModal, setOpenFunctionModal] = useState(null)
    const [openPlaygroundModal, setOpenPlaygroundModal] = useState(null)
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(null)
    const { pid } = router.query

    useEffect(() => {
        if (pid) {
            (async () => { setApplication(await getApplicationData(parseInt(pid.toString()))) })()
        }
    }, [pid])

    const sendGenerateRequest = async () => {
        const res = await fetch("/api/generate", {
            method: "POST",
            body: JSON.stringify({...application}),
            headers: {
                "Content-Type": "application/json"
            }
        })

        let stuff = await res.json()
        setContent(stuff.content)
    }

    const compileAndDeploy = async () => {
        setLoading(true)
        const res = await fetch("/api/compile", {
            method: "POST",
            body: JSON.stringify({ content, applicationName: application.name }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const out = await res.json()
        setLoading(!out.success)

        const _res = await updateContractId(parseInt(pid.toString()), "0.0." + out.deployedContract[0].num.low)
        console.log(_res.response)
        if (_res.response.success) {
            toast({
                title: 'Contract deployed.',
                description: "We've deployed your contract for you at 0.0." + out.deployedContract[0].num.low + ".",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    return (
        <>
            <Navbar />
            {application ? (
                <Box overflow="hidden" h="90vh">
                    <Box
                        maxW={{ base: "7xl" }}
                        px={{ base: 4, sm: 6, lg: 8 }}
                        mt={{ base: 6, md: 8, lg: 10, xl: 14 }}
                    >
                        <FormControl>
                            <FormLabel>Application Id</FormLabel>
                            <Input value={application.id} variant='filled' isDisabled />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Application Name</FormLabel>
                            <Input value={application.name} variant='filled' isDisabled />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Application Creator</FormLabel>
                            <Input value={application.creator} variant='filled' isDisabled />
                        </FormControl>

                        <Flex mt={10}>
                            <Button onClick={() => setOpenObjectModal(true)}>Add Object</Button>
                            <Button onClick={() => setOpenFunctionModal(true)} ml={5}>Add Function</Button>
                            <Button onClick={() => sendGenerateRequest()} ml={5}>Generate Solidity</Button>
                            <Button isLoading={loading} onClick={() => compileAndDeploy()} ml={5}>Compile and Deploy</Button>
                        </Flex>

                        <Box mt={8}>
                            <Text fontSize="3xl" fontWeight="bold">Objects</Text>
                            <UnorderedList>
                                {application.objects.map((obj) => (
                                    <ListItem>{ obj.name }</ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                        <CreateObjectModal appData={application} applicationId={parseInt(pid.toString())} isOpen={openObjectModal} onClose={() => setOpenObjectModal(false)} />
                        <CreateFunctionModal appData={application} applicationId={parseInt(pid.toString())} isOpen={openFunctionModal} onClose={() => setOpenFunctionModal(false)} />
                        <PlaygroundModal appData={application} applicationId={parseInt(pid.toString())} isOpen={openPlaygroundModal} onClose={() => setOpenPlaygroundModal(false)} />
                    </Box>
                    <Button shadow="lg" onClick={() => setOpenPlaygroundModal(true)} position="absolute" bottom="3%" left="3%" color="white" bg={useColorModeValue("purple.600", "purple.400")} _hover={{ bg: "purple.400" }}>Playground</Button>
                </Box>
            ) : ""}
        </>
    )
}

export default Application