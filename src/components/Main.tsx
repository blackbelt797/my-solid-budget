import { createSignal } from 'solid-js';

export default function Main() {
 const [inputValue, setInputValue] = createSignal('');

 const handleInput = (e: any) => {
  setInputValue(e.target.value);
 };

 return (
  <main class="bg-white">
   <div class="bg-white py-8 px-6 flex flex-row gap-8">
    <div class="w-64 bg-amber-300 px-3 py-2 rounded-md flex flex-col content-center ">
     <h2 class="text-black text-center">Account Balance </h2>
     <h3 class="text-black text-center">$4,000.00</h3>
    </div>
    <div class="w-64 bg-purple-500 rounded-md  px-3 py-2">
     <h2>Balance After Bills $1,945.00</h2>
    </div>
    <div class="w-64 bg-green-700 rounded-md  px-3 py-2">
     <h2>Total Income $5,000.00</h2>
    </div>
    <div>
     <h2 class="w-64 bg-blue-600 rounded-md px-3 py-2">Total Bills</h2>
    </div>
   </div>
   <div>
    <div class="text-2xl mt-64 text-black flex justify-center">Transactions</div>
    <li>
     <input
      class="w-50 border text-black border-gray-300 px-3 py-2 rounded-lg shadow-sm outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
      type="text"
      value={inputValue()}
      onInput={handleInput}></input>
    </li>
    <li>
     {' '}
     <input
      class="w-50 border text-black border-gray-300 px-3 py-2 rounded-lg shadow-sm outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
      type="text"
      value={inputValue()}
      onInput={handleInput}></input>
    </li>
    <li>
     {' '}
     <input
      class="w-50 border text-black border-gray-300 px-3 py-2 rounded-lg shadow-sm outline-none focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1"
      type="text"
      value={inputValue()}
      onInput={handleInput}></input>
    </li>
   </div>
  </main>
 );
}
