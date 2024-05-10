// scripts/deploy.js

// async function main() {
//     const [deployer] = await ethers.getSigners();

//     console.log("Deploying contracts with the account:", deployer.address);

//     const MyERC1155Token = await ethers.getContractFactory("MyERC1155Token");
//     const myToken = await MyERC1155Token.deploy("https://yourapi.com/api/token/");

//     console.log("MyERC1155Token deployed to:", myToken.address);
// }

// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });

const main = async () => {
  const [owner, ...student] = await hre.ethers.getSigners();
  const myFactory = await hre.ethers.getContractFactory("MyERC1155Token");
  const myContract = await myFactory.deploy("https://white-fascinating-cardinal-894.mypinata.cloud/ipfs/");
  const address = await myContract.getAddress();
  console.log("\n**************Contract deployed to:", address);
  console.log("\n**************Contract deployed by:", owner.address);
  console.log("\n**************Getting all metadata");
  console.log(await myContract.connect(owner).getAllMetadata());
  
console.log("\ttokenCount: " + await myContract.connect(student[0]).getTokenCount());
console.log("******************mint")
console.log(await myContract.connect(student[0]).mint(1,30,"little ape","ape family Robinson","somewhere"));//amount, price , imgURL
console.log("\n**************Getting all metadata");
console.log(await myContract.connect(student[5]).getAllMetadata());
console.log("changing metadata URI")
console.log(await myContract.connect(owner).setMetadataLocation("https://www.towson.edu") )
console.log("\n**************Getting all metadata");
console.log(await myContract.connect(owner).getAllMetadata());
console.log("get URI")
console.log(await myContract.connect(student[5]).getMetadataLocation())
// console.log(await myContract.connect(student[0]).mint(1,1,"somewhere1"));
// console.log(await myContract.connect(student[0]).mint(1,1,"somewhere2"));
// console.log(await myContract.connect(student[0]).mint(1,1,"somewhere3"));
// console.log(await myContract.connect(student[0]).mint(1,1,"somewhere4"));
//   console.log("Getting all metadata");
//   console.log(await myContract.connect(owner).getAllMetadata());
//   console.log("tokenCount: " + await myContract.connect(student[1]).getTokenCount());
//   console.log("************   buying");
//   // let amt = ethers.utils.value
//   let amt = 30;
//   let  options = {value: amt};
//   console.log(await myContract.connect(student[3]).buyToken(1,1,options).then((transaction) => {console.log(transaction)}))
// console.log("end buying +++++++++++++++++++++++++++++++++++++++++++++++++++++++")
//   console.log("Getting all metadata");
//   console.log(await myContract.connect(owner).getAllMetadata());
  // console.log(await myContract.connect(student[2]).buyToken(1,1));
  // console.log("Getting all metadata");
  // console.log(await myContract.connect(owner).getAllMetadata());
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();