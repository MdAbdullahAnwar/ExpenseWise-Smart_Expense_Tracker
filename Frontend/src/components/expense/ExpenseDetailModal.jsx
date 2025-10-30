import { X, Calendar, DollarSign, Tag, FileText } from 'lucide-react';

export default function ExpenseDetailModal({ expense, onClose }) {
  if (!expense) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="px-4 md:px-6 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-bold">Expense Details</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* Amount Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              ₹{parseFloat(expense.amount).toFixed(2)}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Description</span>
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-200 break-words">
                {expense.description}
              </p>
            </div>

            {/* Category */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Category</span>
              </div>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {expense.category}
              </span>
            </div>

            {/* Date */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Date</span>
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                {new Date(expense.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Time */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-teal-500" />
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Time</span>
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                {new Date(expense.createdAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Note Section */}
          {expense.note && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Note</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic break-words">
                "{expense.note}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 md:px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600 rounded-b-2xl flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
