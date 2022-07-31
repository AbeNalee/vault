import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const startingBalance = stdlib.parseCurrency(7000)


const accAlice = await stdlib.newTestAccount(startingBalance);
const accBob = await stdlib.newTestAccount(stdlib.parseCurrency(100));
console.log('Hello Alice and Bob!');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

const getBalance = async (who) =>  stdlib.formatCurrency(await stdlib.balanceOf(who));
const printBalances = async () => {
  console.log(`balance of Alice is: ${ await getBalance(accAlice) }`);
  console.log(`balance of Bob is: ${ await getBalance(accBob) }`);
}
await printBalances();

const choiceArray = ["I'm not here","I'm here"];

const Shared = {
  showTime: (time) => {
    console.log(`~ Time Remaining is ${parseInt(time)}`);
  }
}

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...Shared,
    inheritance: stdlib.parseCurrency(4000),
    isHere: () => {
      const choice = Math.floor(Math.random() * 2);
      console.log(`Alice's choice is ${ choiceArray[choice] }`);
      return (choice == 0 ? false : true);
    },
    
  }),
  backend.Bob(ctcBob, {
    ...Shared,
    acceptTerms: (amount) => {
      console.log(`Bob accepts the terms for ${ stdlib.formatCurrency(amount) } from Alice`)
      return  true;
    }
  }),
]);

await printBalances();
console.log('Goodbye, Alice and Bob!');
