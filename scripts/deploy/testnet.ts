import { ethers } from "hardhat";
import { deploy, deploySampleContract } from "./deploy";
import type { DeployParams } from "./deploy";
import { verifyContract } from "../verify/verify";

const deployParamsBase = {
  owner: "0xDA861C9DccFf6d1fEf7Cae71B5b538AF25063404",
  pauser: "0xDA861C9DccFf6d1fEf7Cae71B5b538AF25063404",
};

const deployParams: Record<number, DeployParams> = {
  80001: {
    ...deployParamsBase,
    axelarGateway: "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
    wormholeGateway: "0x0CBE91CF822c73C2315FB05100C2F714765d5c20",
  },
  43113: {
    ...deployParamsBase,
    axelarGateway: "0xC249632c2D40b9001FE907806902f63038B737Ab",
    wormholeGateway: "0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C",
  },
  5: {
    ...deployParamsBase,
    wormholeGateway: "0x706abc4E45D419950511e474C7B9Ed348A4a716c",
  },
  4002: {
    ...deployParamsBase,
    axelarGateway: "0x97837985Ec0494E7b9C71f5D3f9250188477ae14",
    wormholeGateway: "0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7",
  },
  97: {
    ...deployParamsBase,
    axelarGateway: "0x4D147dCb984e6affEEC47e44293DA442580A3Ec0",
    wormholeGateway: "0x68605AD7b15c732a30b1BbC62BE8F2A509D74b4D",
  },
  31337: {
    ...deployParamsBase,
    axelarGateway: "0x97837985Ec0494E7b9C71f5D3f9250188477ae14",
    wormholeGateway: "0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7",
  },
};

(async () => {
  const networkId = (await ethers.provider.getNetwork()).chainId;
  console.log(`Network: ${networkId}`);

  const params = deployParams[networkId];
  if (!params) {
    throw new Error(`No deploy params for network ${networkId}`);
  }

  const { contracts, constructorArgs } = await deploy(params, true);
  const sampleContract = await deploySampleContract(contracts.CCMPExecutor.address);

  console.log("Contracts: ");
  for (const [key, contract] of Object.entries({ ...contracts, sampleContract })) {
    if (contract) {
      console.log(`   ${key}: ${contract.address}`);
    }
  }

  for (const [key, contract] of Object.entries(contracts)) {
    const contractName = key as keyof typeof constructorArgs;
    await verifyContract(contract.address, constructorArgs[contractName] || []);
  }
})();
