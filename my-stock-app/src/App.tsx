import { useState, useEffect } from 'react'
// 📊 Recharts වලට අවශ්‍ය කරන දේවල් import කිරීම
// ✅ මේ විදියට වෙනස් කරන්න:
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Stock {
  symbol: string;
  lastPrice: number;
  changePercentage: number;
}

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form data state (පරණ code එකමයි)
  const [formData, setFormData] = useState({ symbol: '', price: '', change: '' });
  const [isEditing, setIsEditing] = useState(false); // දැනට Edit කරනවාද නැද්ද කියලා බලන්න

  const fetchStocks = () => {
    fetch('http://localhost:3000/api/stocks')
      .then(res => res.json())
      .then(data => {
        setStocks(data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchStocks(); }, []);

	const startEdit = (stock: Stock) => {
	  setFormData({ 
		symbol: stock.symbol, 
		price: stock.lastPrice.toString(), 
		change: stock.changePercentage.toString() 
	  });
	  setIsEditing(true); // Edit mode එක Active කරනවා
	};

  
	const handleDelete = async (symbol: string) => {
	  // C# වල MessageBox.Show වගේ Confirm එකක් ගමු
	  if (window.confirm(`${symbol} මකා දැමීමට ඔබට අවශ්‍යද?`)) {
		try {
		  const response = await fetch(`http://localhost:3000/api/stocks/${symbol}`, {
			method: 'DELETE',
		  });
		  
		  if (response.ok) {
			alert("සාර්ථකව මකා දැමුවා!");
			fetchStocks(); // 🔄 Table එක සහ Chart එක Refresh කරන්න
		  }
		} catch (error) {
		  console.error("Delete error:", error);
		}
	  }
	};  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
	
	const method = isEditing ? 'PUT' : 'POST';
	  const url = isEditing 
		? `http://localhost:3000/api/stocks/${formData.symbol}` 
		: 'http://localhost:3000/api/stocks';	
	
    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: formData.symbol,
        lastPrice: formData.price,
        changePercentage: formData.change
      })
    });
    setFormData({ symbol: '', price: '', change: '' });
	setIsEditing(false); // ආපහු සාමාන්‍ය තත්ත්වයට	
    fetchStocks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* 📝 Stock Add Form (පරණ code එකමයි) */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">අලුත් Stock එකක් එක් කරන්න</h2>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input className="border p-2 rounded w-full" placeholder="Symbol (JKH.N0000)" value={formData.symbol} onChange={e => setFormData({...formData, symbol: e.target.value})} required />
            <input type="number" step="0.01" className="border p-2 rounded w-full" placeholder="Price (Rs.)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            <input type="number" step="0.01" className="border p-2 rounded w-full" placeholder="Change %" value={formData.change} onChange={e => setFormData({...formData, change: e.target.value})} required />
			
			<button className={`${isEditing ? 'bg-orange-600' : 'bg-green-600'} text-white px-6 py-2 rounded font-bold`}>
			  {isEditing ? 'Update Stock' : 'Add Stock'}
			</button>
			
          </form>
        </div>

        {/* 📊 Stock Price Comparison Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-800">📊 සියලුම Stocks වල මිල සැසඳීම (Rs.)</h2>
          
          {loading ? (
            <div className="text-center py-10 text-gray-500">Charts ලෝඩ් වෙමින් පවතිනවා...</div>
          ) : stocks.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Graph එක පෙන්වීමට දත්ත කිසිවක් නැහැ.</div>
          ) : (
            // Recharts ResponsiveContainer එක හරහා Chart එක resize වෙනවා
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={stocks} // SQL Server එකෙන් ආපු stocks array එක මෙතනට දෙනවා
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" angle={-45} textAnchor="end" interval={0} /> // X axis එකේ Stock Symbol එක
                <YAxis label={{ value: 'මිල (Rs.)', angle: -90, position: 'insideLeft' }} /> // Y axis එකේ මිල
                <Tooltip /> // Mouse එක ගෙනියද්දී විස්තර පෙන්වන්න
                <Legend /> // 'lastPrice' කියන එකේ පාට පෙන්වන්න
                {/* 🎨 මෙතන අපි Bar එකේ පාට තීරණය කරනවා */}
                <Bar dataKey="lastPrice">
				  {
					stocks.map((entry, index) => (
					  <Cell 
						key={`Cell-${index}`} 
						fill={entry.changePercentage >= 0 ? '#10b981' : '#ef4444'} // කොළ හෝ රතු
					  />
					))
				  }
				</Bar> // lastPrice එක Towers විදියට පෙන්වනවා
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 📊 Stock Table (පරණ code එකමයි) */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white font-bold text-center text-xl">
            Live Stock Watchlist
          </div>
          {/* Table කොටස මම කලින් දුන්න table එකම පාවිච්චි කරන්න... */
		              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 font-semibold text-gray-700">Stock Symbol</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Last Price (Rs.)</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Change (%)</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-4 font-bold text-blue-800">{stock.symbol}</td>
                    <td className="py-4 px-4 font-mono">{stock.lastPrice.toFixed(2)}</td>
                    <td className={`py-4 px-4 font-bold ${stock.changePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.changePercentage > 0 ? `+${stock.changePercentage}` : stock.changePercentage}%
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {stock.changePercentage >= 0 ? (
                        <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full">Bullish</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full">Bearish</span>
                      )}
                    </td>
					<td className="py-4 px-4">
					<button 
					  onClick={() => startEdit(stock)}
					  className="bg-blue-100 text-blue-600 px-3 py-1 rounded mr-2 hover:bg-blue-600 hover:text-white"
					>
					  Edit
					</button>					
					  <button 
						onClick={() => handleDelete(stock.symbol)}
						className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition font-medium"
					  >
						Delete
					  </button>
					</td>
                  </tr>
                ))}
              </tbody>
            </table>
		  }
        </div>
      </div>
    </div>
  )
}

export default App