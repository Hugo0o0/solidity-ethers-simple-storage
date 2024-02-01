import { ethers } from "ethers"
import "dotenv/config"
import * as fs from "fs"
import * as path from "path"

const loadAbiAndBytecodeAndReturn = () => {
  const abi = fs.readFileSync(
    path.resolve(__dirname, "./SimpleStorage_sol_SimpleStorage.abi"),
    "utf8"
  )

  const binary = fs.readFileSync(
    path.resolve(__dirname, "./SimpleStorage_sol_SimpleStorage.bin"),
    "utf8"
  )

  return {
    abi,
    binary
  }
}

const getEncryptedWallet = () => {
  const encryptedWallet = fs.readFileSync(
    path.resolve(__dirname, "./wallet.json"),
    "utf8"
  )

  return encryptedWallet
}

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_SERVER!)
  // let wallet = ethers.Wallet.fromEncryptedJsonSync(
  //   getEncryptedWallet(),
  //   process.env.ENCRYPTION_PASSWORD!
  // )
  // wallet = wallet.connect(provider)

  const wallet = new ethers.Wallet(process.env.ACCOUNT_PRIVATE_KEY!, provider)

  const { abi, binary } = loadAbiAndBytecodeAndReturn()

  const factory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying contract...")
  const contract = await factory.deploy()
  //? Wait for 1 block confirmation
  await contract.deployTransaction.wait(1)

  console.log("Contract deployed to: ", contract.address)

  let favNumber = await contract.retrieve()
  console.log("Fav number is: ", favNumber.toString())

  const txResponse = await contract.store("6")
  await txResponse.wait(1)

  favNumber = await contract.retrieve()

  console.log("Fav number is: ", favNumber.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

// 7:34:05
