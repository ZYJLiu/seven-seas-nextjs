import { useState } from "react"
import { Button } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useProgram } from "@/contexts/ProgramContext"
import { PublicKey } from "@solana/web3.js"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"

interface MoveButtonProps {
  direction: number
}

const directions = ["Up", "Right", "Down", "Left"]

const MoveButton = ({ direction }: MoveButtonProps) => {
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

    const goldTokenMint = new PublicKey(
      "goLdQwNaZToyavwkbuPJzTt5XPNR3H7WQBGenWtzPH3"
    )

    const [token_vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("token_vault"), goldTokenMint.toBuffer()],
      program!.programId
    )

    const playerTokenAccount = getAssociatedTokenAddressSync(
      goldTokenMint,
      publicKey!
    )

    try {
      const tx = await program!.methods
        .movePlayerV2(direction, 2)
        .accounts({
          player: publicKey!,
          gameDataAccount: level,
          chestVault: chestVault,
          tokenAccountOwner: publicKey!,
          // systemProgram: anchor.web3.SystemProgram.programId,
          tokenAccountOwnerPda: tokenAccountOwnerPda,
          vaultTokenAccount: token_vault,
          playerTokenAccount: playerTokenAccount,
          mintOfTokenBeingSent: goldTokenMint,
          // tokenProgram: TOKEN_PROGRAM_ID,
          // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          gameActions: gameActions,
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
      Move {directions[direction]}
    </Button>
  )
}

export default MoveButton
