import { useState } from "react"
import { Button } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useProgram } from "@/contexts/ProgramContext"
import { PublicKey } from "@solana/web3.js"

const InitializeShipButton = () => {
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

    try {
      const tx = await program!.methods
        .initializeShip()
        .accounts({
          newShip: shipPDA,
          signer: publicKey!,
          nftAccount: publicKey!, // unused account
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
      Initialize Ship
    </Button>
  )
}

export default InitializeShipButton
