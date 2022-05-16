import {
    Box,
    Tr,
    Thead,
    Table,
    TableContainer,
    Tbody,
    Heading,
    Td,
    Tfoot,
    Th,
} from "@chakra-ui/react"
import { formatDistance } from "date-fns"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Navbar } from '../components/Navbar'
import { useHashConnect } from "../hooks/useHashConnext"
import { getApplicationsOfUser } from "../utils/application"

const Dashboard = () => {
    const [userApplications, setUserApplications] = useState(null)
    const { walletData } = useHashConnect()
    const { accountIds } = walletData

    const router = useRouter()

    useEffect(() => {
        if (accountIds) {
            (async () => {setUserApplications(await getApplicationsOfUser(accountIds[0]))})()
        }
    }, [accountIds])

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
                        <Heading mb={10}>Your applications</Heading>
                        <TableContainer borderRadius={10} border="1px solid" borderColor="lightgrey">
                            <Table variant='simple'>
                                <Thead>
                                    <Tr>
                                        <Th>Id</Th>
                                        <Th>Name</Th>
                                        <Th>Creator</Th>
                                        <Th>Timestamp</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {userApplications ? userApplications.map(app => (
                                        <Tr onClick={() => router.push("/application/" + app.id)} _hover={{ backgroundColor: "gray.50" }}>
                                            <Td>{ app.id }</Td>
                                            <Td>{ app.name }</Td>
                                            <Td>{ app.creator.slice(0, 5) }...{ app.creator.slice(33) }</Td>
                                            <Td>{ formatDistance(new Date(parseInt(app.timestamp) * 1000), new Date(), { addSuffix: true }) }</Td>
                                        </Tr>
                                    )) : <p>Loading applications...</p>}
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                        <Th>Id</Th>
                                        <Th>Name</Th>
                                        <Th>Creator</Th>
                                        <Th>Timestamp</Th>
                                    </Tr>
                                </Tfoot>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Dashboard
