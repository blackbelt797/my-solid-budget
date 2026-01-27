import { For, createSignal } from 'solid-js';
import { format } from 'date-fns';

interface Transaction {
 id: string;
 date: Date;
 bankDescription: string;
 description: string;
 category: string;
 amount: number; // positive for income, negative for expense
 status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
 {
  id: 'tx_001',
  date: new Date('2025-12-28'),
  bankDescription: 'test',
  description: 'Salary Deposit',
  category: 'Income',
  amount: 5000,
  status: 'completed',
 },
 {
  id: 'tx_002',
  date: new Date('2025-12-27'),
  bankDescription: 'test',
  description: 'Netflix Subscription',
  category: 'Entertainment',
  amount: -12.99,
  status: 'completed',
 },
 {
  id: 'tx_003',
  date: new Date('2025-12-26'),
  bankDescription: 'test',
  description: 'Grocery Shopping',
  category: 'Food',
  amount: -89.45,
  status: 'completed',
 },
 {
  id: 'tx_004',
  date: new Date('2025-12-25'),
  bankDescription: 'test',
  description: 'Freelance Payment',
  category: 'Income',
  amount: 1200,
  status: 'pending',
 },
 {
  id: 'tx_005',
  date: new Date('2025-12-24'),
  bankDescription: 'test',
  description: 'Electricity Bill',
  category: 'Utilities',
  amount: -145.3,
  status: 'failed',
 },
];
// This is a function to sort the transactions.
export default function TransactionsList() {
 const [sortOrder, setSortOrder] = createSignal<'asc' | 'desc'>('desc');

 const sortedTransactions = () => {
  return [...mockTransactions].sort((a, b) => {
   const dateA = a.date.getTime();
   const dateB = b.date.getTime();
   return sortOrder() === 'desc' ? dateB - dateA : dateA - dateB;
  });
 };

 const toggleSort = () => {
  setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
 };

 const getStatusColor = (status: Transaction['status']) => {
  switch (status) {
   case 'completed':
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
   case 'pending':
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
   case 'failed':
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }
 };

 return (
  <div class="w-full max-w-5xl mx-auto p-6">
   <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
    <button
     onClick={toggleSort}
     class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition">
     Date
     <svg
      class={`w-4 h-4 transition-transform ${sortOrder() === 'asc' ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
     </svg>
    </button>
   </div>

   <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
    {/* Desktop Table View */}
    <div class="hidden md:block overflow-x-auto">
     <table class="w-full">
      <thead class="bg-gray-50 dark:bg-gray-700">
       <tr>
        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Description</th>
        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
        <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
       </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
       <For each={sortedTransactions()}>
        {(tx) => (
         <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
           {format(tx.date, 'MMM dd, yyyy')}
          </td>
          <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{tx.bankDescription}</td>
          <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{tx.description}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{tx.category}</td>
          <td class="px-6 py-4 whitespace-nowrap">
           <span class={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(tx.status)}`}>
            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
           </span>
          </td>
          <td
           class={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
            tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
           }`}>
           {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
          </td>
         </tr>
        )}
       </For>
      </tbody>
     </table>
    </div>

    {/* Mobile Card View */}
    <div class="md:hidden">
     <For each={sortedTransactions()}>
      {(tx) => (
       <div class="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
        <div class="flex justify-between items-start mb-2">
         <div>
          <p class="font-semibold text-gray-900 dark:text-white">{tx.description}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
           {format(tx.date, 'MMM dd, yyyy')} • {tx.category}
          </p>
         </div>
         <span class={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(tx.status)}`}>
          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
         </span>
        </div>
        <p
         class={`text-lg font-bold text-right ${
          tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
         }`}>
         {tx.amount > 0 ? '+' : '−'}${Math.abs(tx.amount).toFixed(2)}
        </p>
       </div>
      )}
     </For>
    </div>
   </div>

   {sortedTransactions().length === 0 && (
    <div class="text-center py-12 text-gray-500 dark:text-gray-400">No transactions found.</div>
   )}
  </div>
 );
}
