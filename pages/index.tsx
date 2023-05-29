import { Box, Flex, HStack, Spacer, VStack } from "@chakra-ui/react"
import WalletMultiButton from "@/components/WalletMultiButton"
import InitializeButton from "@/components/InitializeButton"
import InitializeShipButton from "@/components/InitializeShipButton"
import UpgradeShipButton from "@/components/UpgradeShipButton"
import ResetButton from "@/components/ResetButton"
import SpawnShipButton from "@/components/SpawnShipButton"
import MoveButton from "@/components/MoveButton"
import ShootButton from "@/components/ShootButton"
import GameBoard from "@/components/GameBoard"

export default function Home() {
  const direction = [0, 1, 2, 3]
  return (
    <Box>
      <Flex px={4} py={4}>
        <Spacer />
        <WalletMultiButton />
      </Flex>

      <VStack>
        <GameBoard />
        <Box height="20px" />

        {/* <InitializeButton /> */}
        <ResetButton />

        <Box height="20px" />

        <VStack>
          <InitializeShipButton />
          <HStack>
            <UpgradeShipButton />
            <SpawnShipButton />
          </HStack>
        </VStack>

        <Box height="20px" />

        <Flex flexDirection="column" alignItems="center">
          <Box mb="2">
            <MoveButton direction={direction[0]} />
          </Box>
          <Flex>
            <Box mr="2">
              <MoveButton direction={direction[3]} />
            </Box>
            <ShootButton />
            <Box ml="2">
              <MoveButton direction={direction[1]} />
            </Box>
          </Flex>
          <Box mt="2">
            <MoveButton direction={direction[2]} />
          </Box>
        </Flex>

        {/* {direction.map((dir, index) => (
          <MoveButton key={index} direction={dir} />
        ))}
        <ShootButton /> */}
      </VStack>
    </Box>
  )
}
