import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { CartProvider, useCart } from './src/context/CartContext';
import ProductDetail from './src/pages/ProductDetail';

// --- Components Nhỏ (Navbar, Footer) ---
const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
            <span className="text-2xl font-bold text-gray-800">Mady</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Trang Chủ</Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">Sản Phẩm</Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-blue-600"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen, cart, totalPrice, removeFromCart } = useCart();
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col animate-slideIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Giỏ Hàng ({cart.length})</h2>
          <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">Giỏ hàng trống trơn 😢</p>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-4 border-b pb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">📦</div>
                <div className="flex-1">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-blue-600">{item.price.toLocaleString()}₫ x {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><X size={16}/></button>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Tổng cộng:</span>
            <span className="text-blue-600">{totalPrice.toLocaleString()}₫</span>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Thanh Toán</button>
        </div>
      </div>
    </div>
  );
};

// --- Trang Home Đơn Giản (Demo) ---
const Home = () => (
  <div className="text-center py-20">
    <h1 className="text-5xl font-bold mb-6">Chào mừng đến với <span className="text-blue-600">Mady</span></h1>
    <p className="text-xl text-gray-600 mb-8">Nền tảng sưu tầm thẻ bài 3D số 1 Việt Nam</p>
    <Link to="/product/1" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg">
      Xem Sản Phẩm Demo (Có 3D)
    </Link>
  </div>
);

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Navbar />
          <CartSidebar />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<div className="text-center py-20">Trang danh sách sản phẩm (Đang cập nhật...)</div>} />
              {/* Route động cho chi tiết sản phẩm */}
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </main>

          <footer className="bg-gray-800 text-white py-8 text-center mt-auto">
            <p>&copy; 2026 Mady 3D Collections</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}