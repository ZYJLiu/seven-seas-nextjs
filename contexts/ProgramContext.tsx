import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor"
import { SevenSeas, IDL } from "../idl/seven_seas"
import { PublicKey } from "@solana/web3.js"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

// Define the structure of the Program context state
type ProgramContextType = {
  program: Program<SevenSeas> | null
}

// Create the context with default values
const ProgramContext = createContext<ProgramContextType>({
  program: null,
})

// Custom hook to use the Program context
export const useProgram = () => useContext(ProgramContext)

// Provider component to wrap around components that need access to the context
export const ProgramProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const wallet = useAnchorWallet()
  const { connection } = useConnection()

  // State variable to hold the program instance
  const [program, setProgram] = useState<Program<SevenSeas> | null>(null)

  // Anchor program setup
  const setup = useCallback(async () => {
    const programId = new PublicKey(
      "2a4NcnkF5zf14JQXHAv39AsRf7jMFj13wKmTL6ZcDQNd"
    )
    // const programId = new PublicKey(
    //   "4JEMY6vDxG387N7wz9Rp8GNd9BkwdHj44M2To61Remc5"
    // )

    /// @ts-ignore
    const provider = new AnchorProvider(connection, wallet, {})
    setProvider(provider)
    const program = new Program<SevenSeas>(IDL, programId, provider)

    setProgram(program)
  }, [connection, wallet])

  // Effect to fetch program when the component mounts
  useEffect(() => {
    setup()
  }, [setup])

  return (
    <ProgramContext.Provider value={{ program }}>
      {children}
    </ProgramContext.Provider>
  )
}
