import { useState } from "react"
import { Button } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useProgram } from "@/contexts/ProgramContext"
import { PublicKey } from "@solana/web3.js"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"

const UpgradeShipButton = () => {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [isLoading, setIsLoading] = useState(false)

  // Program from context
  const { program } = useProgram()

  const handleClick = async () => {
    setIsLoading(true)

    const [shipPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("ship"), publicKey!.toBuffer()],
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
        .upgradeShip()
        .accounts({
          newShip: shipPDA,
          signer: publicKey!,
          nftAccount: publicKey!,
          // systemProgram: anchor.web3.SystemProgram.programId,
          vaultTokenAccount: token_vault,
          mintOfTokenBeingSent: goldTokenMint,
          // tokenProgram: TOKEN_PROGRAM_ID,
          playerTokenAccount: playerTokenAccount,
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
      Upgrade Ship
    </Button>
  )
}

export default UpgradeShipButton
