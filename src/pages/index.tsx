import {
  Box,
  chakra,
  Stack,
  useColorModeValue
} from "@chakra-ui/react"
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { Navbar } from '../components/Navbar'

const Index = () => (
  <>
    <Navbar />
    <Box pos="relative" overflow="hidden">
      <Box maxW="7xl" mx="auto">
        <Box
          pos="relative"
          pb={{ base: 8, sm: 16, md: 20, lg: 28, xl: 32 }}
          w="full"
          border="solid 1px transparent"
        >
          <Box
            maxW={{ base: "7xl" }}
            px={{ base: 4, sm: 6, lg: 8 }}
            mt={{ base: 12, md: 16, lg: 20, xl: 28 }}
          >
            <Box
              textAlign="center"
              w={{ base: "full", md: 11 / 12, xl: 8 / 12 }}
              mx="auto"
            >
              <chakra.h1
                fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
                letterSpacing="tight"
                lineHeight="short"
                fontWeight="extrabold"
                color={useColorModeValue("gray.900", "white")}
              >
                <chakra.span display={{ base: "block", xl: "inline" }}>
                  Build your{" "}
                </chakra.span>
                <chakra.span
                  display={{ base: "block", xl: "inline" }}
                  color={useColorModeValue("purple.600", "purple.400")}
                >
                  dream application
                </chakra.span>
                <chakra.span display={{ base: "block", xl: "inline" }}>
                  {" "}easily
                </chakra.span>
              </chakra.h1>
              <chakra.p
                mt={{ base: 3, sm: 5, md: 5 }}
                mx={{ sm: "auto", lg: 0 }}
                mb={6}
                fontSize={{ base: "lg", md: "xl" }}
                color="gray.500"
                lineHeight="base"
              >
                With BuidlSmart, you can build a blockchain application in
                minutes with no code and deploy it to the Hedera blockchain
                in just seconds.
              </chakra.p>
              <Stack
                direction={{ base: "column", sm: "column", md: "row" }}
                mb={{ base: 4, md: 8 }}
                spacing={{ base: 4, md: 2 }}
                justifyContent="center"
              >
                <Box rounded="full" shadow="md">
                  <chakra.a
                    w="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="solid 1px transparent"
                    fontSize={{ base: "md", md: "lg" }}
                    rounded="md"
                    color="white"
                    bg="purple.600"
                    _hover={{ bg: "purple.700" }}
                    px={{ base: 8, md: 10 }}
                    py={{ base: 3, md: 4 }}
                    cursor="pointer"
                  >
                    Get started
                  </chakra.a>
                </Box>
                <Box mt={[3, 0]} ml={[null, 3]}>
                  <chakra.a
                    w="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    px={{ base: 8, md: 10 }}
                    py={{ base: 3, md: 4 }}
                    border="solid 1px transparent"
                    fontSize={{ base: "md", md: "lg" }}
                    rounded="md"
                    color="purple.700"
                    bg="purple.100"
                    _hover={{ bg: "purple.200" }}
                    cursor="pointer"
                  >
                    Live demo
                  </chakra.a>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  </>
)

export default Index
