import {
    Box,
    Heading,
    Button,
    Input,
    Flex,
    useColorModeValue,
    Text,
    FormLabel,
    FormControl,
    InputGroup,
    InputLeftAddon,
    FormHelperText,
    useToast
} from "@chakra-ui/react"
import { useState } from "react"
import { Navbar } from '../../components/Navbar'
import { createApplication } from "../../utils/application"

const Blank = () => {
    const [applicationName, setApplicationName] = useState(null)
    const toast = useToast()

    const newApplication = async () => {
        const res = await createApplication(applicationName)
        if (res.receipt.status._code === 22) {
            toast({
                title: 'Application created.',
                description: "We've created your application for you.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <>
            <Navbar />
            <Box pos="relative" overflow="hidden">
                <Box maxW="7xl" mx="auto">
                    <Box
                        maxW={{ base: "7xl" }}
                        px={{ base: 4, sm: 6, lg: 8 }}
                        mt={{ base: 6, md: 8, lg: 10, xl: 14 }}
                    >
                        <Heading mb={10}>New blank application</Heading>

                        <Flex flexDirection="column" width="60%">
                            <FormControl>
                                <FormLabel htmlFor='name'>Name</FormLabel>
                                <Input value={applicationName} onChange={e => setApplicationName(e.target.value)} focusBorderColor={useColorModeValue("purple.400", "purple.500")} id='name' type='text' />
                                <FormHelperText>Your application name.</FormHelperText>
                            </FormControl>
                            <Button onClick={() => newApplication()} _hover={{ bg: "purple.500" }} bg="purple.400" color="white" mt={12} width="30%">Create Application</Button>
                        </Flex>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Blank
