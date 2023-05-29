import { useEffect, useState } from "react"
import { Box, Flex } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useProgram } from "@/contexts/ProgramContext"
import { AccountInfo, PublicKey } from "@solana/web3.js"
import { IdlAccounts, Idl } from "@coral-xyz/anchor"
import {
  StarIcon,
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
} from "@chakra-ui/icons"

// Not sure if this does anything
type GameState = IdlAccounts<Idl>["gameDataAccount"]

// Todo
const GameBoard = () => {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  // Program from context
  const { program } = useProgram()

  const [state, setState] = useState<GameState>()

  // Fetch the game state account on load
  useEffect(() => {
    if (!program) return
    const fetchBoard = async () => {
      const [level] = PublicKey.findProgramAddressSync(
        [Buffer.from("level")],
        program!.programId
      )
      const gameState = await program!.account.gameDataAccount.fetch(level)
      console.log(JSON.stringify(gameState, null, 2))
      console.log(gameState.board)
      setState(gameState)
    }

    fetchBoard()
  }, [program])

  const handleAccountChange = (accountInfo: AccountInfo<Buffer>) => {
    try {
      // deserialize the game state account data
      const data = program?.coder.accounts.decode(
        "gameDataAccount",
        accountInfo.data
      )
      setState(data)
    } catch (error) {
      console.error("Error decoding account data:", error)
    }
  }

  useEffect(() => {
    if (!program) return
    const [level] = PublicKey.findProgramAddressSync(
      [Buffer.from("level")],
      program!.programId
    )

    const subscriptionId = connection.onAccountChange(
      level,
      handleAccountChange
    )

    return () => {
      // Unsubscribe from the account change subscription when the component unmounts
      connection.removeAccountChangeListener(subscriptionId)
    }
  }, [program])

  return (
    <>
      <Box>
        {state?.board[0].map((_: any, colIndex: number) => (
          <Flex key={colIndex}>
            {state.board.map((row: any[], rowIndex: number) => (
              <Box
                key={rowIndex}
                w="40px"
                h="40px"
                border="1px"
                borderColor="black"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {row[colIndex].state === 0 ? (
                  // Render something for state 0
                  <></>
                ) : row[colIndex].state === 1 ? (
                  <Box>
                    {row[colIndex].lookDirection === 0 ? (
                      <ArrowUpIcon
                        color={
                          row[colIndex].player == publicKey?.toBase58()
                            ? "red.500"
                            : "black"
                        }
                      />
                    ) : row[colIndex].lookDirection === 1 ? (
                      <ArrowForwardIcon
                        color={
                          row[colIndex].player == publicKey?.toBase58()
                            ? "red.500"
                            : "black"
                        }
                      />
                    ) : row[colIndex].lookDirection === 2 ? (
                      <ArrowDownIcon
                        color={
                          row[colIndex].player == publicKey?.toBase58()
                            ? "red.500"
                            : "black"
                        }
                      />
                    ) : (
                      <ArrowBackIcon
                        color={
                          row[colIndex].player == publicKey?.toBase58()
                            ? "red.500"
                            : "black"
                        }
                      />
                    )}
                  </Box>
                ) : (
                  // Render something for state 2
                  <StarIcon />
                )}
              </Box>
            ))}
          </Flex>
        ))}
      </Box>
    </>
  )
}

export default GameBoard
