import { useState } from "react"
import { Button } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useProgram } from "@/contexts/ProgramContext"
import { PublicKey } from "@solana/web3.js"

// Not used by player, only called once by the game creator to initialize the game accounts
const InitializeButton = () => {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [isLoading, setIsLoading] = useState(false)

  // Program from context
  const { program } = useProgram()

  const handleClick = async () => {
    setIsLoading(true)

    const [level] = PublicKey.findProgramAddressSync(
      [Buffer.from("level")],
      program!.programId
    )

    const [chestVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("chestVault")],
      program!.programId
    )

    const [gameActions] = PublicKey.findProgramAddressSync(
      [Buffer.from("gameActions")],
      program!.programId
    )

    const [tokenAccountOwnerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("token_account_owner_pda")],
      program!.programId
    )

    const gold_mint = new PublicKey(
      "goLdQwNaZToyavwkbuPJzTt5XPNR3H7WQBGenWtzPH3"
    )

    const [token_vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("token_vault"), gold_mint.toBuffer()],
      program!.programId
    )

    try {
      const tx = await program!.methods
        .initialize()
        .accounts({
          signer: publicKey!,
          newGameDataAccount: level,
          chestVault: chestVault,
          gameActions: gameActions,
          tokenAccountOwnerPda: tokenAccountOwnerPda,
          vaultTokenAccount: token_vault,
          mintOfTokenBeingSent: gold_mint,
        })
        .transaction()
      const txSig = await sendTransaction(tx, connection)
      console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      w="150px"
      onClick={handleClick}
      isLoading={isLoading}
      isDisabled={!publicKey}
    >
      Initialize Accounts
    </Button>
  )
}

export default InitializeButton
