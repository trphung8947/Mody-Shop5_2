import React from 'react';
import { useParams } from 'react-router-dom';
import Mady3DViewer from '../../Mady3DViewer'; // Import component 3D cũ của bạn
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  // Giả lập dữ liệu từ Database
  const product = {
    id: id || '1',
    name: "Mô Hình Robot Gundam RX-78",
    price: 1200000,
    description: "Phiên bản giới hạn với chi tiết cơ khí chính xác. Được in 3D bằng nhựa Resin cao cấp, sơn thủ công tỉ mỉ. Tương thích hoàn hảo với hệ sinh thái Mady.",
    rating: 5.0,
    reviews: 128,
    modelUrl: "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf" // Demo URL
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Cột Trái: 3D Viewer */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-lg border border-gray-200">
            <Mady3DViewer productId={product.id} modelUrl={product.modelUrl} />
          </div>
          <p className="text-center text-sm text-gray-500">👆 Xoay, phóng to để xem chi tiết 360 độ</p>
        </div>

        {/* Cột Phải: Thông tin */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">ĐỘC BẢN</span>
            <div className="flex items-center text-yellow-400 text-sm">
              <Star fill="currentColor" size={16} />
              <span className="ml-1 text-gray-600">{product.rating} ({product.reviews} đánh giá)</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-6">{product.price.toLocaleString('vi-VN')}₫</p>
          
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <ShieldCheck className="text-green-500" size={24} />
              <span className="text-sm font-medium">Bảo hành 12 tháng</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <Truck className="text-blue-500" size={24} />
              <span className="text-sm font-medium">Freeship toàn quốc</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={24} />
              <span>Thêm Vào Giỏ</span>
            </button>
            <button className="px-6 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
              ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}