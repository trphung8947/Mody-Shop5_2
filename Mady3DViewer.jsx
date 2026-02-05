import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Stage, 
  Html, 
  useProgress,
  PerspectiveCamera
} from '@react-three/drei';

// --- 0. Error Boundary (Bắt lỗi để không crash app) ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("3D Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500 flex-col">
          <span className="text-4xl mb-2">⚠️</span>
          <p>Không thể tải mô hình 3D</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- 1. Loading Component (Thanh tiến trình) ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-white/90 p-4 rounded-xl shadow-lg backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-sm font-bold text-gray-700">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

// --- 2. Model Component (Xử lý hiển thị file GLTF/GLB) ---
function Model({ url, autoRotate }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  // Tự động xoay nhẹ nếu được bật
  useFrame((state) => {
    if (autoRotate && ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={ref} object={scene} />;
}

// --- 3. Main Component: Mady3DViewer ---
export default function Mady3DViewer({ 
  productId,          // ID sản phẩm (để gọi API)
  modelUrl: propUrl,  // URL trực tiếp (nếu có)
  autoRotate = true, 
  backgroundColor = '#f9fafb' // bg-gray-50
}) {
  const [url, setUrl] = useState(propUrl);
  const [isLoading, setIsLoading] = useState(false);

  // Giả lập gọi API lấy modelUrl từ MongoDB dựa trên productId
  useEffect(() => {
    if (!propUrl && productId) {
      setIsLoading(true);
      // Trong thực tế: await axios.get(`/api/products/${productId}`)
      console.log(`📡 Fetching model for Product ID: ${productId}...`);
      
      // Giả lập delay mạng
      setTimeout(() => {
        // Trả về URL mẫu (Macbook) cho demo
        setUrl("https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf");
        setIsLoading(false);
      }, 1500);
    } else if (propUrl) {
      setUrl(propUrl);
    }
  }, [productId, propUrl]);

  // Nếu đang fetch API URL
  if (isLoading) return <div className="w-full h-[500px] flex items-center justify-center bg-gray-50"><Loader /></div>;

  return (
    <div className="w-full h-[500px] md:h-[600px] relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
      {/* Nút hướng dẫn hoặc Overlay UI có thể đặt ở đây */}
      <div className="absolute top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 backdrop-blur-md">
        🖱️ Xoay & Phóng to để xem chi tiết
      </div>

      <ErrorBoundary>
        <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
          {/* Màu nền Canvas */}
          <color attach="background" args={[backgroundColor]} />

          {/* Camera mặc định */}
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

          <Suspense fallback={<Loader />}>
            {/* Stage: Tự động căn chỉnh ánh sáng (Lighting) và môi trường studio */}
            {url && (
              <Stage 
                environment="city" 
                intensity={0.6} 
                contactShadow={{ resolution: 1024, scale: 10, blur: 2, opacity: 0.5, color: '#202020' }}
                shadows
                adjustCamera={1.2} // Zoom camera vừa vặn với model
              >
                <Model url={url} autoRotate={false} />
              </Stage>
            )}
          </Suspense>

          {/* Camera Control: Cho phép người dùng tương tác */}
          <OrbitControls 
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            enablePan={true}
            enableZoom={true}
            minPolarAngle={Math.PI / 4} // Giới hạn góc nhìn dọc
            maxPolarAngle={Math.PI / 1.5}
            makeDefault
          />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

// Preload model để tăng tốc độ tải lần sau (Optional)
// useGLTF.preload('https://path-to-your-cloudinary-model.glb');