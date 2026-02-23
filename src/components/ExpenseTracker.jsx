import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, X, TrendingUp, TrendingDown, PieChart, Calendar, Download, Edit2, Trash2, Languages } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { translations } from '../data/translations';

function ExpenseTracker({ language, setLanguage }) {
  const t = translations[language] || translations.en;
  const [expenses, setExpenses] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [expenseForm, setExpenseForm] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [revenueForm, setRevenueForm] = useState({
    crop: '',
    quantity: '',
    pricePerUnit: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('farmExpenses');
    const savedRevenue = localStorage.getItem('farmRevenue');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedRevenue) setRevenue(JSON.parse(savedRevenue));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('farmExpenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('farmRevenue', JSON.stringify(revenue));
  }, [revenue]);

  const expenseCategories = [
    'Seeds',
    'Fertilizers',
    'Pesticides',
    'Labor',
    'Equipment',
    'Irrigation',
    'Transportation',
    'Other'
  ];

  const handleAddExpense = () => {
    if (!expenseForm.category || !expenseForm.amount) {
      alert('Please fill required fields');
      return;
    }

    const newExpense = {
      id: Date.now(),
      ...expenseForm,
      amount: parseFloat(expenseForm.amount)
    };

    if (editingItem) {
      setExpenses(expenses.map(exp => exp.id === editingItem.id ? newExpense : exp));
      setEditingItem(null);
    } else {
      setExpenses([...expenses, newExpense]);
    }

    setExpenseForm({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    setShowExpenseModal(false);
  };

  const handleAddRevenue = () => {
    if (!revenueForm.crop || !revenueForm.quantity || !revenueForm.pricePerUnit) {
      alert('Please fill all fields');
      return;
    }

    const totalAmount = parseFloat(revenueForm.quantity) * parseFloat(revenueForm.pricePerUnit);
    const newRevenue = {
      id: Date.now(),
      ...revenueForm,
      quantity: parseFloat(revenueForm.quantity),
      pricePerUnit: parseFloat(revenueForm.pricePerUnit),
      totalAmount
    };

    if (editingItem) {
      setRevenue(revenue.map(rev => rev.id === editingItem.id ? newRevenue : rev));
      setEditingItem(null);
    } else {
      setRevenue([...revenue, newRevenue]);
    }

    setRevenueForm({ crop: '', quantity: '', pricePerUnit: '', date: new Date().toISOString().split('T')[0] });
    setShowRevenueModal(false);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Delete this expense?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const handleDeleteRevenue = (id) => {
    if (window.confirm('Delete this revenue?')) {
      setRevenue(revenue.filter(rev => rev.id !== id));
    }
  };

  const handleEditExpense = (expense) => {
    setEditingItem(expense);
    setExpenseForm({
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      date: expense.date
    });
    setShowExpenseModal(true);
  };

  const handleEditRevenue = (rev) => {
    setEditingItem(rev);
    setRevenueForm({
      crop: rev.crop,
      quantity: rev.quantity,
      pricePerUnit: rev.pricePerUnit,
      date: rev.date
    });
    setShowRevenueModal(true);
  };

  // Calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalRevenue = revenue.reduce((sum, rev) => sum + rev.totalAmount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  // Expense by category
  const expenseByCategory = expenseCategories.map(category => ({
    name: category,
    value: expenses.filter(exp => exp.category === category).reduce((sum, exp) => sum + exp.amount, 0)
  })).filter(item => item.value > 0);

  // Monthly trends
  const getMonthlyData = () => {
    const months = {};

    expenses.forEach(exp => {
      const month = new Date(exp.date).toLocaleDateString('default', { month: 'short' });
      if (!months[month]) months[month] = { month, expense: 0, revenue: 0 };
      months[month].expense += exp.amount;
    });

    revenue.forEach(rev => {
      const month = new Date(rev.date).toLocaleDateString('default', { month: 'short' });
      if (!months[month]) months[month] = { month, expense: 0, revenue: 0 };
      months[month].revenue += rev.totalAmount;
    });

    return Object.values(months);
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const downloadReport = () => {
    const report = `
FARM FINANCIAL REPORT
=====================

SUMMARY:
--------
Total Revenue: ₹${totalRevenue.toFixed(2)}
Total Expenses: ₹${totalExpenses.toFixed(2)}
Net Profit: ₹${netProfit.toFixed(2)}
Profit Margin: ${profitMargin}%

EXPENSES:
---------
${expenses.map(exp => `${exp.date} | ${exp.category} | ₹${exp.amount} | ${exp.description}`).join('\n')}

REVENUE:
--------
${revenue.map(rev => `${rev.date} | ${rev.crop} | ${rev.quantity} units @ ₹${rev.pricePerUnit} = ₹${rev.totalAmount}`).join('\n')}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <DollarSign className="w-8 h-8 mr-3" />
              {t.tracker?.title || 'Farm Financial Tracker'}
            </h2>
            <p className="text-green-100">{t.tracker?.subtitle || 'Manage expenses, track revenue, and maximize profits'}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-xl border border-white/30 backdrop-blur-sm">
              <Languages className="w-5 h-5 text-white" />
              <select
                value={language || 'en'}
                onChange={(e) => setLanguage && setLanguage(e.target.value)}
                className="bg-transparent focus:outline-none text-white font-medium cursor-pointer [&>option]:text-gray-800"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="od">ଓଡ଼ିଆ</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>
            <button
              onClick={downloadReport}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-xl flex items-center space-x-2 transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Revenue</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">₹{totalRevenue.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">{revenue.length} transactions</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Expenses</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">₹{totalExpenses.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">{expenses.length} transactions</p>
        </div>

        <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${netProfit >= 0 ? 'border-green-500' : 'border-orange-500'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Net Profit</span>
            {netProfit >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-orange-500" />
            )}
          </div>
          <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
            ₹{netProfit.toFixed(0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{netProfit >= 0 ? 'Profit' : 'Loss'}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Profit Margin</span>
            <PieChart className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{profitMargin}%</p>
          <p className="text-xs text-gray-500 mt-1">Return on investment</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setEditingItem(null);
            setExpenseForm({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
            setShowExpenseModal(true);
          }}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>

        <button
          onClick={() => {
            setEditingItem(null);
            setRevenueForm({ crop: '', quantity: '', pricePerUnit: '', date: new Date().toISOString().split('T')[0] });
            setShowRevenueModal(true);
          }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Add Revenue</span>
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        {expenseByCategory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        )}

        {/* Monthly Trends */}
        {getMonthlyData().length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getMonthlyData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                <Bar dataKey="expense" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Transactions Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingDown className="w-6 h-6 mr-2 text-red-500" />
            Recent Expenses
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No expenses added yet</p>
            ) : (
              expenses.slice().reverse().map(exp => (
                <div key={exp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800">{exp.category}</span>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        {new Date(exp.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{exp.description}</p>
                    <p className="text-lg font-bold text-red-600">₹{exp.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditExpense(exp)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Revenue List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
            Recent Revenue
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {revenue.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No revenue added yet</p>
            ) : (
              revenue.slice().reverse().map(rev => (
                <div key={rev.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800">{rev.crop}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {new Date(rev.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{rev.quantity} units @ ₹{rev.pricePerUnit}/unit</p>
                    <p className="text-lg font-bold text-green-600">₹{rev.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditRevenue(rev)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteRevenue(rev.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingItem ? 'Edit Expense' : 'Add Expense'}
              </h3>
              <button
                onClick={() => {
                  setShowExpenseModal(false);
                  setEditingItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                >
                  <option value="">Select category</option>
                  {expenseCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹) *</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="Brief description"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>

              <button
                onClick={handleAddExpense}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                {editingItem ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Modal */}
      {showRevenueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingItem ? 'Edit Revenue' : 'Add Revenue'}
              </h3>
              <button
                onClick={() => {
                  setShowRevenueModal(false);
                  setEditingItem(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Name *</label>
                <input
                  type="text"
                  value={revenueForm.crop}
                  onChange={(e) => setRevenueForm({ ...revenueForm, crop: e.target.value })}
                  placeholder="e.g., Rice, Wheat"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity (units) *</label>
                <input
                  type="number"
                  value={revenueForm.quantity}
                  onChange={(e) => setRevenueForm({ ...revenueForm, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Unit (₹) *</label>
                <input
                  type="number"
                  value={revenueForm.pricePerUnit}
                  onChange={(e) => setRevenueForm({ ...revenueForm, pricePerUnit: e.target.value })}
                  placeholder="Enter price"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>

              {revenueForm.quantity && revenueForm.pricePerUnit && (
                <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                  <p className="text-sm text-gray-600">Total Amount:</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{(parseFloat(revenueForm.quantity) * parseFloat(revenueForm.pricePerUnit)).toFixed(2)}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={revenueForm.date}
                  onChange={(e) => setRevenueForm({ ...revenueForm, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>

              <button
                onClick={handleAddRevenue}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                {editingItem ? 'Update Revenue' : 'Add Revenue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseTracker;