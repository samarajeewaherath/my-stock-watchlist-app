import React from 'react';

// C# වල interface එකක් වගේමයි - මොන වගේ data ද එන්නේ කියලා මෙතන කියනවා
interface StockProps {
  symbol: string;
  price: number; // 👈 මෙතන 'price' ද තියෙන්නේ?
  change: number; // 👈 මෙතන 'change' ද තියෙන්නේ?
}

export const StockDisplay = ({ symbol, price, change }: StockProps) => {
  return (
    <div style={{ border: '1px solid #ccc', margin: '5px', padding: '10px' }}>
      <strong>{symbol}</strong>: Rs. {price} ({change}%)
    </div>
  );
};