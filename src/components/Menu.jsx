import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Plus, Minus, Clock, MapPin, 
  Flame, Phone, Check, ArrowRight, X, Sparkles, AlertCircle 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'mais-pedidos', name: 'OS MAIS PEDIDOS', icon: '🔥' },
  { id: 'hamburguer-artesanal', name: 'HAMBÚRGUER ARTESANAL', icon: '🍔' },
  { id: 'sanduiches', name: 'SANDUÍCHES', icon: '🥪' },
  { id: 'caldos', name: 'CALDOS', icon: '🍲' },
  { id: 'porcoes', name: 'PORÇÕES', icon: '🍟' },
  { id: 'bebidas', name: 'BEBIDAS', icon: '🥤' },
  { id: 'bebidas-alcoolicas', name: 'ALCOÓLICAS', icon: '🍺' },
];

const PRODUCTS = {
  'mais-pedidos': [
    { id: 'mp-1', name: 'Artesanal BBQ', price: 25.90, description: 'Blend artesanal de 150g, bacon crocante, mussarela derretida, molho barbecue defumado, salada fresca, molho da casa e pão brioche.', image: '/burger_premium.png', badge: 'Mais Vendido', prepTime: '15-20 min' },
    { id: 'mp-2', name: 'Caldo de Mandioca', price: 19.90, description: 'Uma combinação de cremosidade e sabor em um caldo preparado com todo cuidado.', image: '/caldo_mandioca.png', badge: 'Quentinho', prepTime: '10 min' },
    { id: 'mp-3', name: 'Artesanal Junior', price: 19.90, description: 'Blend artesanal de 100g, queijo cheddar derretido, molho especial da casa e pão brioche macio.', image: '/burger_premium.png', badge: 'Clássico', prepTime: '12-15 min' },
    { id: 'mp-4', name: 'Artesanal Duplo', price: 37.90, description: 'Dois blends artesanais de 100g, cheddar cremoso, bacon crocante, cebola caramelizada, cream cheese e molho especial no pão brioche.', image: '/burger_premium.png', badge: 'Monstruoso', prepTime: '18-22 min' },
    { id: 'mp-5', name: 'Angu Baiana com Suã', price: 19.90, description: 'Angu cremoso servido com suã macia e saborosa, mussarela, pimenta biquinho e cheiro-verde fresco.', image: '/caldo_mandioca.png', badge: 'Destaque', prepTime: '12 min' },
    { id: 'mp-6', name: 'Artesanal Burguer', price: 33.90, description: 'Blend artesanal de 150g, cebola caramelizada, cream cheese, bacon crocante e molho especial da casa no pão brioche.', image: '/burger_premium.png', badge: 'Favorito', prepTime: '15-18 min' }
  ],
  'hamburguer-artesanal': [
    { id: 'h-1', name: 'Artesanal Junior', price: 19.90, description: 'Blend artesanal de 100g, queijo cheddar derretido, molho especial da casa e pão brioche macio.', image: '/burger_premium.png', prepTime: '12-15 min' },
    { id: 'h-2', name: 'Artesanal BBQ', price: 25.90, description: 'Blend artesanal de 150g, bacon crocante, mussarela derretida, molho barbecue defumado, salada fresca, molho da casa e pão brioche.', image: '/burger_premium.png', prepTime: '15-20 min' },
    { id: 'h-3', name: 'Artesanal Burguer', price: 33.90, description: 'Blend artesanal de 150g, cebola caramelizada, cream cheese, bacon crocante e molho especial da casa no pão brioche.', image: '/burger_premium.png', prepTime: '15-18 min' },
    { id: 'h-4', name: 'Artesanal Duplo', price: 37.90, description: 'Dois blends artesanais de 100g, cheddar cremoso, bacon crocante, cebola caramelizada, cream cheese e molho especial no pão brioche.', image: '/burger_premium.png', prepTime: '18-22 min' },
    { id: 'h-5', name: 'Artesanal Triplo', price: 43.90, description: 'Três blends artesanais de 100g, muito queijo cheddar derretido, bacon crocante, cebola caramelizada e molho especial no pão brioche.', image: '/burger_premium.png', prepTime: '22-25 min' }
  ],
  'sanduiches': [
    { id: 's-1', name: 'Sanduíche Pernil Defumado', price: 22.90, description: 'Pernil defumado desfiado, alface fresca, tomate, molho especial da casa e pão baguete levemente tostado.', image: '/pernil_sandwich.png', prepTime: '10-12 min' }
  ],
  'caldos': [
    { id: 'c-1', name: 'Caldo de Mandioca', price: 19.90, description: 'Uma combinação de cremosidade e sabor em um caldo preparado com todo cuidado.', image: '/caldo_mandioca.png', prepTime: '10 min' },
    { id: 'c-2', name: 'Angu Baiana com Suã', price: 19.90, description: 'Angu cremoso servido com suã macia e saborosa, mussarela, pimenta biquinho e cheiro-verde fresco.', image: '/caldo_mandioca.png', prepTime: '12 min' }
  ],
  'porcoes': [
    { id: 'p-1', name: 'Fritas Pequena 120g', price: 9.90, description: 'Porção individual de batatas fritas super crocantes e sequinhas.', image: '/fries_cheddar.png', prepTime: '8-10 min' },
    { id: 'p-2', name: 'Fritas Média 240g', price: 13.90, description: 'Porção média ideal para compartilhar, batatas fritas crocantes.', image: '/fries_cheddar.png', prepTime: '8-10 min' },
    { id: 'p-3', name: 'Fritas com Cheddar e Bacon', price: 22.90, description: '300g de fritas cobertas com cheddar cremoso e farofa de bacon crocante.', image: '/fries_cheddar.png', prepTime: '10-12 min' },
    { id: 'p-4', name: 'Fritas com Pernil Defumado', price: 23.90, description: '300g de fritas cobertas com pernil desfiado, molho especial e cebolinha fresca.', image: '/fries_cheddar.png', prepTime: '12-15 min' }
  ],
  'bebidas': [
    { id: 'b-1', name: 'Coca-Cola Lata 350ml', price: 6.90, description: 'Gelada e refrescante.', image: '/drinks_premium.png' },
    { id: 'b-2', name: 'Coca-Cola Zero Lata 350ml', price: 6.90, description: 'Sabor original, zero açúcar.', image: '/drinks_premium.png' },
    { id: 'b-3', name: 'Guaraná Antarctica Lata 350ml', price: 6.90, description: 'Guaraná Antarctica gelado.', image: '/drinks_premium.png' },
    { id: 'b-4', name: 'Fanta Laranja Lata 350ml', price: 6.90, description: 'Fanta laranja gelada.', image: '/drinks_premium.png' },
    { id: 'b-5', name: 'Coca-Cola 1 Litro', price: 9.90, description: 'Perfeito para compartilhar.', image: '/drinks_premium.png' },
    { id: 'b-6', name: 'Mate Couro 1L', price: 7.90, description: 'Tradicional Mate Couro.', image: '/drinks_premium.png' },
    { id: 'b-7', name: 'Água sem gás', price: 3.50, description: 'Garrafa 500ml.', image: '/drinks_premium.png' },
    { id: 'b-8', name: 'Água com gás', price: 4.50, description: 'Garrafa 500ml.', image: '/drinks_premium.png' }
  ],
  'bebidas-alcoolicas': [
    { id: 'ba-1', name: 'Heineken Long Neck', price: 9.90, description: 'Cerveja premium Heineken bem gelada.', image: '/drinks_premium.png' },
    { id: 'ba-2', name: 'Stella Artois Long Neck', price: 9.90, description: 'Cerveja Stella Artois gelada.', image: '/drinks_premium.png' }
  ]
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('mais-pedidos');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cartao');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  const categoryRefs = useRef({});

  // Dynamic Fonts Load
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const scrollToCategory = (id) => {
    setActiveCategory(id);
    const element = categoryRefs.current[id];
    if (element) {
      const offset = 120; // sticky header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Detect which category is in viewport during scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      
      for (const category of CATEGORIES) {
        const element = categoryRefs.current[category.id];
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product, qty = 1, itemNotes = '') => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.notes === itemNotes
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += qty;
        return newCart;
      }

      return [...prevCart, { product, quantity: qty, notes: itemNotes }];
    });
  };

  const updateCartQty = (index, delta) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      newCart[index].quantity += delta;
      if (newCart[index].quantity <= 0) {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cashback = cartTotal * 0.03;

  const handleOpenProductDetails = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setNotes('');
  };

  const handleAddFromModal = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity, notes);
      setSelectedProduct(null);
    }
  };

  const sendOrderToWhatsApp = () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) {
      alert('Por favor, informe seu nome antes de enviar o pedido.');
      return;
    }
    if (!address.trim()) {
      alert('Por favor, insira o endereço de entrega.');
      return;
    }

    let message = `🔥 *NOVO PEDIDO - HAMBÚRGUERIA* 🔥\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📍 *Endereço:* ${address}\n`;
    message += `💳 *Forma de Pagamento:* ${paymentMethod.toUpperCase()}\n\n`;
    message += `🍔 *Itens do Pedido:*\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.quantity}x* ${item.product.name} (R$ ${item.product.price.toFixed(2).replace('.', ',')})`;
      if (item.notes) {
        message += `\n   └ 📝 _Obs: ${item.notes}_`;
      }
      message += `\n`;
    });

    message += `\n💰 *Subtotal:* R$ ${cartTotal.toFixed(2).replace('.', ',')}\n`;
    message += `🎁 *Cashback de 3% ganho nesta compra:* R$ ${cashback.toFixed(2).replace('.', ',')} (para usar no próximo pedido)\n\n`;
    message += `🚀 *Por favor, confirme e inicie o preparo do meu pedido!*`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
    setShowOrderSuccess(true);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white selection:bg-[#ffb703] selection:text-black" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Background radial effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#b3001e]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ffb703]/5 rounded-full blur-[140px]" />
      </div>

      {/* HEADER HERO */}
      <div className="relative h-[400px] overflow-hidden flex items-end pb-12 z-10 border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/60 to-transparent z-10" />
          <img 
            src="/burger_premium.png" 
            alt="Hamburguer Premium" 
            className="w-full h-full object-cover scale-105 filter brightness-50 contrast-125"
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 w-full relative z-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b3001e]/30 border border-[#b3001e]/50 backdrop-blur-md mb-3 text-xs font-semibold text-red-200"
            >
              <Flame size={12} className="text-[#ffb703] animate-pulse" />
              Hamburgueria Artesanal Gourmet
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase"
            >
              HAMBÚR<span className="text-[#ffb703] drop-shadow-[0_0_15px_rgba(255,183,3,0.3)]">GUERIA</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 mt-2 max-w-lg text-sm md:text-base font-light"
            >
              Experiência gourmet com blends artesanais suculentos de verdade, pães brioche macios e ingredientes selecionados com o máximo rigor.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-2 bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-4 min-w-[240px] md:self-end shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Status</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                ABERTO AGORA
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
              <Clock size={14} className="text-[#ffb703]" />
              <span>Tempo estimado: 25 - 40 min</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <MapPin size={14} className="text-[#b3001e]" />
              <span>Entregas em toda a cidade</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CATEGORIES SCROLL BAR (STICKY) */}
      <div className="sticky top-0 z-40 bg-[#070708]/90 border-b border-white/5 backdrop-blur-md py-4 shadow-lg shadow-black/20">
        <div className="max-w-5xl mx-auto px-6 overflow-x-auto scrollbar-none flex gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase transition-all whitespace-nowrap border ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#b3001e] to-[#ffb703] border-transparent text-white shadow-[0_0_15px_rgba(255,183,3,0.25)] scale-105'
                  : 'bg-white/5 border-white/5 hover:border-white/20 text-gray-400 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* MENU PRODUCTS LIST */}
      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {CATEGORIES.map((category) => {
          const products = PRODUCTS[category.id] || [];
          if (products.length === 0) return null;

          return (
            <section
              key={category.id}
              ref={(el) => (categoryRefs.current[category.id] = el)}
              className="mb-16 scroll-mt-28"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/5">
                <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide flex items-center gap-3">
                  <span className="text-[#ffb703]">{category.icon}</span>
                  {category.name}
                </h2>
                <span className="text-xs text-gray-500 font-medium tracking-widest">{products.length} itens</span>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => {
                  const isMaisPedido = category.id === 'mais-pedidos';
                  return (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className={`relative flex flex-col sm:flex-row bg-[#111113] border rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all p-4 gap-4 ${
                        isMaisPedido
                          ? 'border-[#ffb703]/30 shadow-[0_0_15px_rgba(255,183,3,0.02)]'
                          : 'border-white/5 hover:border-white/10'
                      }`}
                      onClick={() => handleOpenProductDetails(product)}
                    >
                      {/* Product glow effect for featured */}
                      {isMaisPedido && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#ffb703]/5 to-transparent pointer-events-none rounded-2xl" />
                      )}

                      {/* Image container */}
                      <div className="relative w-full sm:w-[130px] h-[130px] rounded-xl overflow-hidden flex-shrink-0 bg-black/40">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                        {product.badge && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-[#b3001e] to-[#ffb703] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-md">
                            {product.badge}
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-lg md:text-xl text-white hover:text-[#ffb703] transition-colors flex items-center gap-1.5">
                              {product.name}
                              {isMaisPedido && <Sparkles size={14} className="text-[#ffb703] animate-pulse" />}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-400 font-light mt-1.5 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4 sm:mt-0">
                          <span className="text-xl font-extrabold text-[#ffb703]">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#ffb703] text-white hover:text-black border border-white/10 hover:border-transparent transition-all text-xs font-bold"
                          >
                            <Plus size={14} />
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* FLOAT CART BAR */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 z-50 px-6 max-w-md mx-auto"
          >
            <div 
              onClick={() => setIsCartOpen(true)}
              className="bg-gradient-to-r from-[#b3001e] to-[#ffb703] rounded-2xl p-4 flex items-center justify-between cursor-pointer shadow-[0_10px_30px_rgba(179,0,30,0.3)] hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/35 flex items-center justify-center relative">
                  <ShoppingBag size={18} className="text-white" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ffb703] text-black text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#b3001e]">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-white/80 block uppercase tracking-wider font-semibold">Ver Sacola</span>
                  <span className="text-lg font-extrabold text-white">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-black bg-[#ffb703] px-3.5 py-2 rounded-xl uppercase tracking-wider">
                Avançar <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUCT DETAILS MODAL (GLASSMORPHISM DETAIL) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#111113]/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 backdrop-blur-md"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="relative h-[240px] bg-black/40">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] to-transparent" />
                {selectedProduct.badge && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#b3001e] to-[#ffb703] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white">
                    {selectedProduct.badge}
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-extrabold tracking-tight">{selectedProduct.name}</h3>
                  <span className="text-2xl font-black text-[#ffb703]">R$ {selectedProduct.price.toFixed(2).replace('.', ',')}</span>
                </div>

                <p className="text-gray-400 font-light mt-3 text-sm leading-relaxed">{selectedProduct.description}</p>

                {selectedProduct.prepTime && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg mt-4">
                    <Clock size={12} className="text-[#ffb703]" />
                    <span>Preparo: {selectedProduct.prepTime}</span>
                  </div>
                )}

                {/* Notes Input */}
                <div className="mt-6">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-widest block mb-2">Alguma observação?</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Sem cebola, ponto da carne bem passado, sem molho..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm focus:border-[#ffb703] outline-none transition-all placeholder:text-gray-600 resize-none h-18"
                  />
                </div>

                {/* Qty & Add Button */}
                <div className="flex items-center justify-between gap-4 mt-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-xl p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddFromModal}
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#b3001e] to-[#ffb703] hover:from-[#b3001e]/90 hover:to-[#ffb703]/90 text-white font-bold transition-all shadow-[0_0_20px_rgba(255,183,3,0.15)] flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    Adicionar à Sacola
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING CART DRAWER (GLASSMORPHISM / SLIDE IN) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            
            <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-full bg-[#111113] border-l border-white/10 flex flex-col shadow-2xl relative"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-[#ffb703]" size={20} />
                    <h3 className="text-xl font-bold uppercase tracking-tight">Sua Sacola</h3>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <ShoppingBag size={48} className="text-gray-600 mb-3" />
                      <p className="text-gray-400 font-light text-sm">Sua sacola está vazia.</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-4 text-xs font-bold text-[#ffb703] border border-[#ffb703]/20 px-4 py-2 rounded-xl hover:bg-[#ffb703]/10 transition-all uppercase tracking-widest"
                      >
                        Ver Cardápio
                      </button>
                    </div>
                  ) : (
                    cart.map((item, index) => (
                      <div key={index} className="flex gap-4 p-3 bg-black/30 border border-white/5 rounded-2xl relative">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 flex-shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-bold text-sm text-white">{item.product.name}</h4>
                              <span className="text-sm font-extrabold text-[#ffb703] whitespace-nowrap">
                                R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                            {item.notes && (
                              <p className="text-[10px] text-[#ffb703]/90 italic mt-1 line-clamp-1">Obs: {item.notes}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-gray-500">Unitário: R$ {item.product.price.toFixed(2).replace('.', ',')}</span>
                            
                            <div className="flex items-center gap-1 bg-black/50 border border-white/10 rounded-lg p-0.5">
                              <button 
                                onClick={() => updateCartQty(index, -1)}
                                className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/5 text-gray-400 hover:text-white"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQty(index, 1)}
                                className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/5 text-gray-400 hover:text-white"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Customer Checkout Form */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-white/5 bg-black/20 space-y-4">
                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">Dados de Entrega</h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <input 
                        type="text" 
                        placeholder="Seu Nome completo" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:border-[#ffb703] outline-none transition-all placeholder:text-gray-600"
                      />
                      <input 
                        type="text" 
                        placeholder="Endereço de entrega (Ex: Rua A, 123 - Centro)" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs focus:border-[#ffb703] outline-none transition-all placeholder:text-gray-600"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Forma de Pagamento</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['cartao', 'pix', 'dinheiro'].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                              paymentMethod === method
                                ? 'bg-[#ffb703]/10 border-[#ffb703] text-[#ffb703]'
                                : 'bg-black/40 border-white/5 text-gray-400'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Drawer Footer */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-white/10 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Subtotal</span>
                        <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-[#ffb703] bg-[#ffb703]/5 px-3 py-1.5 rounded-lg border border-[#ffb703]/10">
                        <span className="flex items-center gap-1">
                          <Flame size={12} />
                          Cashback ganho (3%)
                        </span>
                        <span className="font-bold">R$ {cashback.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/5">
                        <span>Total</span>
                        <span className="text-xl text-[#ffb703]">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>

                    <button
                      onClick={sendOrderToWhatsApp}
                      className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-[#b3001e] to-[#ffb703] hover:from-[#b3001e]/90 hover:to-[#ffb703]/90 text-white font-extrabold transition-all shadow-[0_10px_20px_rgba(179,0,30,0.25)] flex items-center justify-center gap-2.5 uppercase tracking-wider text-xs"
                    >
                      <Phone size={14} />
                      Peça Agora no WhatsApp
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ORDER SUCCESS OVERLAY */}
      <AnimatePresence>
        {showOrderSuccess && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm p-8 bg-[#111113] border border-white/10 rounded-3xl text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Pedido Enviado!</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Seu pedido foi formatado e enviado para o WhatsApp do estabelecimento. Por favor, envie a mensagem na conversa que se abriu para que seu pedido seja confirmado.
              </p>
              <div className="bg-[#ffb703]/10 border border-[#ffb703]/20 rounded-xl p-3.5 mb-6 text-xs text-[#ffb703] font-bold">
                🔥 Você garantiu R$ {cashback.toFixed(2).replace('.', ',')} de cashback para a sua próxima compra!
              </div>
              <button 
                onClick={() => setShowOrderSuccess(false)}
                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs uppercase tracking-wider font-extrabold transition-all"
              >
                Voltar ao Cardápio
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 bg-[#050506] relative z-10 text-center text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#b3001e]/15 to-[#ffb703]/15 border border-[#ffb703]/20 rounded-full text-[#ffb703] font-bold text-sm">
            🔥 Todos os pedidos possuem 3% de cashback
          </div>
          <p className="font-light tracking-wide mt-2">
            © {new Date().getFullYear()} Hamburgueria. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-6 text-[10px] uppercase font-bold tracking-widest text-gray-600 mt-2">
            <span className="hover:text-white transition-colors cursor-pointer">Termos de uso</span>
            <span>·</span>
            <span className="hover:text-white transition-colors cursor-pointer">Segurança</span>
            <span>·</span>
            <span 
              onClick={() => {
                window.history.pushState({}, '', '/sdr');
                window.dispatchEvent(new Event('popstate'));
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              SDR Admin
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
