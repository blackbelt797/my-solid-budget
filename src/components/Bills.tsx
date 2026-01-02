import { For, Show, createSignal } from 'solid-js';
import { format, isPast, isToday } from 'date-fns';

interface Bill {
 id: string;
 name: string;
 dueDate: string; // ISO date string (YYYY-MM-DD)
 budgeted: number;
 paid: number | null; // null if not paid yet
}

const initialBills: Bill[] = [
 {
  id: '1',
  name: 'Rent',
  dueDate: '2026-01-01',
  budgeted: 1500,
  paid: 1500,
 },
 {
  id: '2',
  name: 'Internet',
  dueDate: '2026-01-15',
  budgeted: 80,
  paid: null,
 },
 {
  id: '3',
  name: 'Electricity',
  dueDate: '2026-01-20',
  budgeted: 120,
  paid: 115.5,
 },
 {
  id: '4',
  name: 'Credit Card',
  dueDate: '2025-12-28', // overdue example
  budgeted: 350,
  paid: null,
 },
];

export default function BillsTracker() {
 const [bills, setBills] = createSignal<Bill[]>(initialBills);
 const [newName, setNewName] = createSignal('');
 const [newDueDate, setNewDueDate] = createSignal('');
 const [newBudgeted, setNewBudgeted] = createSignal('');

 const addBill = () => {
  if (!newName() || !newDueDate() || !newBudgeted()) return;

  const newBill: Bill = {
   id: Date.now().toString(),
   name: newName(),
   dueDate: newDueDate(),
   budgeted: Number(newBudgeted()),
   paid: null,
  };

  setBills([...bills(), newBill]);
  setNewName('');
  setNewDueDate('');
  setNewBudgeted('');
 };

 const updateBill = (id: string, updates: Partial<Bill>) => {
  setBills(bills().map((bill) => (bill.id === id ? { ...bill, ...updates } : bill)));
 };

 const deleteBill = (id: string) => {
  setBills(bills().filter((bill) => bill.id !== id));
 };

 const getStatus = (bill: Bill) => {
  const due = new Date(bill.dueDate);
  if (bill.paid !== null && bill.paid > 0) return 'paid';
  if (isPast(due) && !isToday(due)) return 'overdue';
  if (isToday(due)) return 'due-today';
  return 'upcoming';
 };

 const getStatusStyle = (status: string) => {
  switch (status) {
   case 'paid':
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
   case 'overdue':
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
   case 'due-today':
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
   default:
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  }
 };

 return (
  <div class="w-full max-w-4xl mx-auto p-6">
   <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Bills Tracker</h2>

   {/* Add New Bill Form */}
   <div class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-8">
    <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Add New Bill</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
     <input
      type="text"
      placeholder="Bill Name"
      value={newName()}
      onInput={(e) => setNewName(e.currentTarget.value)}
      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
     />
     <input
      type="date"
      value={newDueDate()}
      onInput={(e) => setNewDueDate(e.currentTarget.value)}
      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
     />
     <input
      type="number"
      placeholder="Budgeted Amount"
      value={newBudgeted()}
      onInput={(e) => setNewBudgeted(e.currentTarget.value)}
      step="0.01"
      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
     />
     <button
      onClick={addBill}
      class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
      Add Bill
     </button>
    </div>
   </div>

   {/* Bills List */}
   <div class="space-y-4">
    <For each={bills()}>
     {(bill) => {
      const status = () => getStatus(bill);
      return (
       <div class="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 hover:shadow-lg transition">
        <div class="flex items-center justify-between mb-4">
         <div class="flex items-center gap-4">
          <input
           type="text"
           value={bill.name}
           onInput={(e) => updateBill(bill.id, { name: e.currentTarget.value })}
           class="text-xl font-semibold bg-transparent border-b-2 border-transparent focus:border-blue-500 focus:outline-none dark:text-white w-64"
          />
          <span class={`px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(status())}`}>
           {status() === 'paid'
            ? 'Paid'
            : status() === 'overdue'
            ? 'Overdue'
            : status() === 'due-today'
            ? 'Due Today'
            : 'Upcoming'}
          </span>
         </div>
         <button
          onClick={() => deleteBill(bill.id)}
          class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
           />
          </svg>
         </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div>
          <label class="text-sm text-gray-600 dark:text-gray-400">Due Date</label>
          <input
           type="date"
           value={bill.dueDate}
           onInput={(e) => updateBill(bill.id, { dueDate: e.currentTarget.value })}
           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{format(new Date(bill.dueDate), 'MMMM d, yyyy')}</p>
         </div>

         <div>
          <label class="text-sm text-gray-600 dark:text-gray-400">Budgeted Amount</label>
          <input
           type="number"
           value={bill.budgeted}
           onInput={(e) => updateBill(bill.id, { budgeted: Number(e.currentTarget.value) })}
           step="0.01"
           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
          <p class="text-lg font-semibold mt-1">${bill.budgeted.toFixed(2)}</p>
         </div>

         <div>
          <label class="text-sm text-gray-600 dark:text-gray-400">Actually Paid</label>
          <input
           type="number"
           value={bill.paid ?? ''}
           placeholder="Not paid yet"
           onInput={(e) => {
            const val = e.currentTarget.value;
            updateBill(bill.id, { paid: val === '' ? null : Number(val) });
           }}
           step="0.01"
           class={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 ${
            bill.paid !== null ? 'border-green-500 dark:border-green-600' : 'border-gray-300 dark:border-gray-600'
           }`}
          />
          <Show when={bill.paid !== null}>
           <p class="text-lg font-semibold mt-1 text-green-600 dark:text-green-400">${bill.paid!.toFixed(2)}</p>
          </Show>
         </div>
        </div>
       </div>
      );
     }}
    </For>
   </div>

   {bills().length === 0 && (
    <div class="text-center py-12 text-gray-500 dark:text-gray-400">No bills added yet. Add one above!</div>
   )}
  </div>
 );
}
