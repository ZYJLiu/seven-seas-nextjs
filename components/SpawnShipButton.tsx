import { useState } from "react"
import { Button } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useProgram } from "@/contexts/ProgramContext"
import { Keypair, PublicKey } from "@solana/web3.js"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"

const SpawnShipButton = () => {
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

    const [shipPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("ship"), publicKey!.toBuffer()],
      program!.programId
    )

    const cannonTokenMint = new PublicKey(
      "boomkN8rQpbgGAKcWvR3yyVVkjucNYcq7gTav78NQAG"
    )

    const playerCannonTokenAccount = getAssociatedTokenAddressSync(
      cannonTokenMint,
      publicKey!
    )

    const rumTokenMint = new PublicKey(
      "rumwqxXmjKAmSdkfkc5qDpHTpETYJRyXY22DWYUmWDt"
    )

    const playerRumTokenAccount = getAssociatedTokenAddressSync(
      rumTokenMint,
      publicKey!
    )

    const avatarPubkey = Keypair.generate()

    try {
      const tx = await program!.methods
        .spawnPlayer(avatarPubkey.publicKey)
        .accounts({
          player: publicKey!,
          tokenAccountOwner: publicKey!,
          gameDataAccount: level,
          chestVault: chestVault,
          nftAccount: publicKey!, // used to derive shipPDA
          ship: shipPDA,
          cannonTokenAccount: playerCannonTokenAccount,
          cannonMint: cannonTokenMint,
          rumTokenAccount: playerRumTokenAccount,
          rumMint: rumTokenMint,
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
      Spawn Ship
    </Button>
  )
}

export default SpawnShipButton
