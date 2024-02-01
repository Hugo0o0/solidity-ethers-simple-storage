import { ethers } from "ethers"
import * as fs from "fs"
import "dotenv/config"

const main = async () => {
  const wallet = new ethers.Wallet(process.env.ACCOUNT_1_PRIVATE_KEY!)
  const encryptedWallet = await wallet.encrypt(
    process.env.ENCRYPTION_PASSWORD!,
    process.env.ACCOUNT_1_PRIVATE_KEY!
  )

  fs.writeFileSync("./wallet.json", encryptedWallet)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
