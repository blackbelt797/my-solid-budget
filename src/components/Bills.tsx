import { For, Show, createEffect, createMemo, createSignal } from 'solid-js';
import { format, isPast, isToday } from 'date-fns';

interface Bill {
 id: string;
 name: string;
 dueDate: string; // YYYY-MM-DD
 budgeted: number;
 paid: number | null;
}
// Created an object of Bills that has an array of different list of bills
const initialBills: Bill[] = [
 { id: '1', name: 'Rent', dueDate: '2026-01-01', budgeted: 1500, paid: 1500 },
 { id: '2', name: 'Internet', dueDate: '2026-01-15', budgeted: 80, paid: null },
 { id: '3', name: 'Electricity', dueDate: '2026-01-20', budgeted: 120, paid: 115.5 },
 { id: '4', name: 'Credit Card', dueDate: '2025-12-28', budgeted: 350, paid: null },
];

export default function SlimBillsTracker() {
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
  setBills(bills().map((b) => (b.id === id ? { ...b, ...updates } : b)));
 };

 const deleteBill = (id: string) => {
  setBills(bills().filter((b) => b.id !== id));
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
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
   case 'overdue':
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
   case 'due-today':
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
   default:
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
 };

 // Computed totals — reactive and efficient
 const totals = createMemo(() => {
  const list = bills();
  const totalBudgeted = list.reduce((sum, b) => sum + b.budgeted, 0);
  const totalPaid = list.reduce((sum, b) => sum + (b.paid ?? 0), 0);
  const remaining = totalBudgeted - totalPaid;

  return { totalBudgeted, totalPaid, remaining };
 });

 return (
  <div class="w-full max-w-3xl mx-auto p-4">
   {/* Totals Summary */}
   <Show when={bills().length > 0}>
    <div class="mt-8 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-inner">
     <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Totals</h3>
     <div class="grid grid-cols-3 gap-6 text-center">
      <div>
       <p class="text-sm text-gray-600 dark:text-gray-400">Total Budgeted</p>
       <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${totals().totalBudgeted.toFixed(2)}</p>
      </div>
      <div>
       <p class="text-sm text-gray-600 dark:text-gray-400">Total Paid</p>
       <p class="text-2xl font-bold text-green-600 dark:text-green-400">${totals().totalPaid.toFixed(2)}</p>
      </div>
      <div>
       <p class="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
       <p
        class={`text-2xl font-bold ${
         totals().remaining > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
        }`}>
        ${Math.abs(totals().remaining).toFixed(2)}
        {totals().remaining < 0 && ' (Overpaid)'}
       </p>
      </div>
     </div>
    </div>
   </Show>
   <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bills</h2>

   {/* Bills List */}
   <div class="w-full my-4">
    <For each={bills()}>
     {(bill) => {
      const status = () => getStatus(bill);
      return (
       <div class="bg-white dark:bg-gray-800 rounded-lg border-green-500 shadow hover:shadow-md transition my-2 flex items-center">
        <span class={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyle(status())}`}>
         {status() === 'paid'
          ? 'Paid'
          : status() === 'overdue'
          ? 'Overdue'
          : status() === 'due-today'
          ? 'Due Today'
          : 'Upcoming'}
        </span>

        <input
         type="text"
         value={bill.name}
         onInput={(e) => updateBill(bill.id, { name: e.currentTarget.value })}
         class="text-lg font-medium bg-transparent border-b-2 border-transparent focus:border-blue-500 focus:outline-none dark:text-white w-full"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">{format(new Date(bill.dueDate), 'MMM d')}</span>

        {/*Input for the budgeted bill amount */}
        <div class="text-right">
         <label class="text-xs text-gray-500 dark:text-gray-400">Budgeted</label>
         <input
          type="number"
          value={bill.budgeted}
          onInput={(e) => updateBill(bill.id, { budgeted: Number(e.currentTarget.value) })}
          step="0.01"
          class="w-24 text-right font-medium bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none dark:text-white"
         />
        </div>
        {/* Input for the Paid amount of Bill */}
        <div class="text-right">
         <label class="text-xs text-gray-500 dark:text-gray-400">Paid</label>
         <input
          type="number"
          value={bill.paid ?? ''}
          placeholder="—"
          onInput={(e) => {
           const val = e.currentTarget.value;
           updateBill(bill.id, { paid: val === '' ? null : Number(val) });
          }}
          step="0.01"
          class={`w-24 text-right font-medium bg-transparent border-b ${
           bill.paid !== null ? 'text-green-600 dark:text-green-400 border-green-500' : 'border-transparent'
          } focus:border-blue-500 focus:outline-none`}
         />
        </div>
        {/* Due Date of Bill */}
        <input
         type="date"
         value={bill.dueDate}
         onInput={(e) => updateBill(bill.id, { dueDate: e.currentTarget.value })}
         class="text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
        {/* End of Date Input */}
        {/* Delete Bill */}
        <button
         onClick={() => deleteBill(bill.id)}
         class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-4">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
         </svg>
        </button>
       </div>
      );
     }}
    </For>
   </div>

   {/* Add New Bill */}

   <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
    <div class="grid grid-cols-3 gap-3 text-sm">
     <input
      type="text"
      placeholder="Bill name"
      value={newName()}
      onInput={(e) => setNewName(e.currentTarget.value)}
      class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
     />
     <input
      type="date"
      value={newDueDate()}
      onInput={(e) => setNewDueDate(e.currentTarget.value)}
      class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
     />
     <div class="flex gap-2">
      <input
       type="number"
       placeholder="Budgeted"
       value={newBudgeted()}
       onInput={(e) => setNewBudgeted(e.currentTarget.value)}
       step="0.01"
       class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
      />
      <button
       onClick={addBill}
       class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition font-medium">
       Add
      </button>
     </div>
    </div>
   </div>

   {bills().length === 0 && (
    <p class="text-center text-gray-500 dark:text-gray-400 py-8">No bills yet. Add one above!</p>
   )}
  </div>
 );
}
