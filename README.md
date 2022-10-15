# Basic Sample Yul+ Hardhat

## To compile Solidity files AND yul+ files, run :

```shell
npx yul-log hardhat
```

This will compile .yulp contracts inside of a "Yul+ Contracts" Directory at the root of the project into hardhat solidity artifacts (Use sig"" to remain compatible). Command is still very much a WIP, however it will generate a partial artifact that fits with a hardhat Solidity artifact, and can be treated similarly. However this isn't fully supported at the moment so expect issues and frequent manual fixes.

## To run tests (and compile sol/yul+ before), run:

```shell
npm run test
```
