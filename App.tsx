
import React, { useState, useMemo, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Menu, X, Phone, Instagram, Truck, Star, 
  CheckCircle2, MessageSquare, ChevronRight, Search, 
  Plus, Minus, Trash2, Flame, Award, MapPin, Youtube, 
  Wind, Sparkles, Gift, Bot, Send, Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Product, CartItem, Category } from './types';
import { PRODUCTS, TESTIMONIALS, PHONE_NUMBER, INSTAGRAM_HANDLE } from './constants';

// --- AI Assistant Component ---

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Namaste! I am your Teja Pickles assistant. Looking for a specific flavor or a festive gift recommendation?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Netlify specific: Exclusively using process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are an expert South Indian food connoisseur for 'Teja Pickles & Home Foods'. You help customers choose between Veg Pickles, Non-Veg Pickles, Sweets, and Hot Items. Be polite, use words like 'Namaste', and emphasize traditional Andhra flavors from Machilipatnam. Keep responses concise.",
        }
      });

      const responseText = response.text || "I'm sorry, I couldn't process that. Please try again!";
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "I apologize, I'm having trouble connecting right now. Please try again or chat with us on WhatsApp!" }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
        }
      }, 100);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
      {isOpen ? (
        <div className="bg-zinc-950 border border-amber-900/30 w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-in">
          <div className="bg-gradient-to-r from-amber-600 to-red-700 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-white" />
              <span className="font-black italic text-sm uppercase tracking-tighter">Flavor Guide</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-black/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm italic ${
                  m.role === 'user' ? 'bg-amber-600 text-black rounded-tr-none' : 'bg-zinc-900 text-gray-300 rounded-tl-none border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 p-3 rounded-2xl rounded-tl-none border border-white/5">
                  <Loader2 className="animate-spin text-amber-500" size={16} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for a recommendation..."
              className="flex-grow bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-xs italic focus:outline-none focus:border-amber-500 text-white"
            />
            <button 
              onClick={handleSend}
              className="bg-amber-600 p-2 rounded-xl hover:bg-amber-500 transition-colors"
            >
              <Send size={18} className="text-black" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-red-700 to-amber-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all border border-amber-400/20"
        >
          <Bot size={28} className="text-white" />
        </button>
      )}
    </div>
  );
};

// --- Shared Components ---

const Navbar = ({ cartCount, onOpenCart }: { cartCount: number, onOpenCart: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      <div className="bg-gradient-to-r from-red-800 via-amber-600 to-red-800 py-2 overflow-hidden border-b border-amber-400/30">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-12">
          {[1, 2, 3].map((i) => (
            <span key={i} className="text-white font-black uppercase italic text-[10px] md:text-xs tracking-[0.3em] flex items-center gap-4">
              <Wind size={14} className="text-white" /> 🪁 SANKRANTHI FESTIVAL OFFERS: SPECIAL DEALS ON PICKLES, SWEETS & HOTS! <Wind size={14} /> 
              <Sparkles size={14} className="text-amber-200" /> CHAT ON WHATSAPP TO GRAB THE HARVEST DEALS! <Sparkles size={14} />
            </span>
          ))}
        </div>
      </div>

      <nav className="bg-black/80 backdrop-blur-xl border-b border-amber-900/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center border border-amber-400">
                  <Flame className="text-white" size={20} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-amber-500 font-black text-lg leading-none tracking-tighter uppercase italic">TEJA</h1>
                  <p className="text-white text-[8px] font-black tracking-widest uppercase opacity-80">Pickles & Foods</p>
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Products', 'About', 'Testimonials', 'Delivery', 'Contact'].map((name) => (
                <Link
                  key={name}
                  to={name === 'Home' ? '/' : `/${name.toLowerCase()}`}
                  className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:text-amber-400 ${
                    (location.pathname === '/' && name === 'Home') || location.pathname === `/${name.toLowerCase()}` ? 'text-amber-500 border-b border-amber-500 pb-1' : 'text-gray-300'
                  }`}
                >
                  {name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={onOpenCart}
                className="relative p-2.5 bg-gradient-to-tr from-red-700 to-amber-600 text-white rounded-xl hover:scale-110 transition-all border border-amber-400/20"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-red-700 text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-red-700">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                className="md:hidden p-2 text-gray-300"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-zinc-950 border-t border-amber-900/20 p-6 space-y-4 shadow-2xl">
            {['Home', 'Products', 'About', 'Testimonials', 'Delivery', 'Contact'].map((name) => (
              <Link
                key={name}
                to={name === 'Home' ? '/' : `/${name.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-black uppercase tracking-widest text-gray-300 hover:text-amber-500 py-3 border-b border-white/5 last:border-0"
              >
                {name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-amber-900/20 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-12">
               <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center border border-amber-400 shadow-[0_0_20px_rgba(217,119,6,0.3)]">
                <Flame className="text-white" size={32} />
              </div>
              <h3 className="text-white font-black text-3xl tracking-tighter uppercase italic">TEJA PICKLES</h3>
            </div>
            <p className="text-amber-100/40 text-xl font-medium max-w-md leading-relaxed italic">
              Authentic South Indian tradition in every bite. Handcrafted pickles and home foods from the heart of Andhra.
            </p>
            <div className="flex gap-6 mt-12">
              <a href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-black transition-all">
                <Instagram size={24} />
              </a>
              <a href="https://youtube.com/channel/UCMGPdnAyW1T_5mflM_2Bu2A" target="_blank" rel="noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-black transition-all">
                <Youtube size={24} />
              </a>
              <a href={`tel:${PHONE_NUMBER}`} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-black transition-all">
                <Phone size={24} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-10">Navigation</h4>
            <div className="flex flex-col gap-6">
              {['Home', 'Products', 'About', 'Testimonials', 'Delivery', 'Contact'].map((item) => (
                <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors font-bold text-lg italic">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-10">The Kitchen</h4>
            <div className="space-y-8">
              <div className="flex gap-6">
                <MapPin className="text-amber-500 shrink-0" size={24} />
                <p className="text-gray-400 font-medium italic">Machilipatnam, Andhra Pradesh, 521002</p>
              </div>
              <div className="flex gap-6">
                <Phone className="text-amber-500 shrink-0" size={24} />
                <p className="text-gray-400 font-medium italic">{PHONE_NUMBER}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-600 text-xs font-black uppercase tracking-[0.3em]">&copy; 2024 Teja Pickles & Home Foods. All Rights Reserved.</p>
          <div className="flex gap-8 text-[10px] font-black text-gray-600 uppercase tracking-widest italic">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Page Components ---

const ProductCard: React.FC<{ product: Product, onAddToCart: (p: Product, w: '250g' | '500g' | '1kg') => void }> = ({ product, onAddToCart }) => {
  const [weight, setWeight] = useState<'250g' | '500g' | '1kg'>('1kg');

  const currentPrice = useMemo(() => {
    if (weight === '1kg') return product.price;
    if (weight === '500g') return Math.round(product.price * 0.55); 
    return Math.round(product.price * 0.3);
  }, [weight, product.price]);

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden group hover:border-amber-500/30 transition-all duration-500 flex flex-col h-full shadow-2xl">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <span className="bg-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border border-amber-400/30">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-white mb-2 italic tracking-tight">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-medium italic">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex gap-2 mb-6">
            {(['250g', '500g', '1kg'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setWeight(w)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                  weight === w 
                    ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_10px_rgba(217,119,6,0.3)]' 
                    : 'bg-zinc-800 border-white/5 text-gray-400 hover:border-amber-500/30'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Price</span>
              <span className="text-2xl font-black text-white">₹{currentPrice}</span>
            </div>
            <button 
              onClick={() => onAddToCart(product, weight)}
              className="bg-white text-black p-4 rounded-2xl hover:bg-amber-500 transition-colors shadow-lg active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartModal = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQty, 
  onRemove 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  items: CartItem[],
  onUpdateQty: (id: string, w: string, delta: number) => void,
  onRemove: (id: string, w: string) => void
}) => {
  const total = items.reduce((sum, item) => sum + item.calculatedPrice * item.quantity, 0);

  if (!isOpen) return null;

  const handleCheckout = () => {
    const message = `*NEW ORDER - TEJA PICKLES & HOME FOODS*\n\n` +
      items.map(item => `ITEM NAME: ${item.name} (${item.selectedWeight})\nQUANTITY: ${item.quantity}\n--------------------------`).join('\n') +
      `\n\n💰 *TOTAL PAYABLE: ₹${total}*` +
      `\n\nCUSTOMER NAME: ` +
      `\nADDRESS TO DELIVER: ` +
      `\nPINCODE: ` +
      `\nPHN.NO: `;
    
    window.open(`https://wa.me/${PHONE_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-zinc-950 h-full border-l border-amber-900/20 shadow-2xl flex flex-col animate-slide-in">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Your Bag</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
              <ShoppingBag size={80} className="mb-6" />
              <p className="text-xl font-bold italic">Your bag is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.selectedWeight}`} className="flex gap-6">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover border border-white/5" />
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-white italic">{item.name}</h4>
                    <button onClick={() => onRemove(item.id, item.selectedWeight)} className="text-red-500/50 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-4">{item.selectedWeight}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-white/5">
                      <button 
                        onClick={() => onUpdateQty(item.id, item.selectedWeight, -1)}
                        className="p-1.5 hover:text-amber-500"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-black text-white">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, item.selectedWeight, 1)}
                        className="p-1.5 hover:text-amber-500"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-black text-white">₹{item.calculatedPrice * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-zinc-900/50 border-t border-white/5">
          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-400 font-black uppercase tracking-widest text-xs">Subtotal</span>
            <span className="text-3xl font-black text-white italic">₹{total}</span>
          </div>
          <button 
            disabled={items.length === 0}
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-red-700 to-amber-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] italic shadow-xl shadow-red-950/20 disabled:opacity-50 hover:scale-[1.02] transition-all active:scale-95"
          >
            Order via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = ({ onAddToCart }: { onAddToCart: (p: Product, w: '250g' | '500g' | '1kg') => void }) => {
  const featured = PRODUCTS.slice(0, 3);

  return (
    <div className="bg-black text-white">
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1596797038530-2c396b27477b?auto=format&fit=crop&q=80" 
            alt="Andhra Spice" 
            className="w-full h-full object-cover opacity-40 scale-110 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 mt-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-8">
              <Award className="text-amber-500" size={24} />
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">The Pride of Machilipatnam</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] italic tracking-tighter">
              AUTHENTIC <span className="text-amber-500">ANDHRA</span><br />LEGACY.
            </h1>
            <p className="text-xl text-amber-100/60 mb-12 max-w-xl font-medium italic">
              Experience the bold flavors of Teja's world-famous pickles and home foods, crafted with heritage and handcrafted with love.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/products" className="bg-amber-600 hover:bg-amber-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest italic transition-all transform hover:scale-105">
                Explore Menu
              </Link>
              <Link to="/about" className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 px-10 py-5 rounded-2xl font-black uppercase tracking-widest italic transition-all">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-br from-[#1a0f0f] to-black py-32 overflow-hidden border-y border-amber-600/20">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Wind size={400} className="text-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div>
                <span className="bg-amber-500 text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                  Sankranthi Sambaralu 🪁
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none mb-8">
                  Celebrate the <br /> <span className="text-amber-500 not-italic">Harvest Season</span>
                </h2>
                <p className="text-2xl text-amber-100/60 italic leading-relaxed font-medium">
                  Relish the authentic taste of Sankranthi with our special festive handmade sweets, spicy hots, and world-class pickles.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-white/5 p-8 rounded-3xl border border-amber-500/20 group hover:border-amber-500/50 transition-all">
                  <Gift className="text-amber-500 mb-4" size={32} />
                  <h4 className="text-white font-black italic uppercase text-lg mb-2">Festive Combos</h4>
                  <p className="text-gray-400 text-sm italic">Exclusive curated bundles for gifting and family celebrations.</p>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-amber-500/20 group hover:border-amber-500/50 transition-all">
                  <Gift className="text-amber-500 mb-4" size={32} />
                  <h4 className="text-white font-black italic uppercase text-lg mb-2">Grandma's Recipes</h4>
                  <p className="text-gray-400 text-sm italic">Traditional sweets like Sunnundalu & Ariselu made in pure ghee.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                <a 
                  href={`https://wa.me/${PHONE_NUMBER.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest italic flex items-center gap-4 hover:bg-amber-500 transition-all"
                >
                  <MessageSquare size={20} />
                  Claim Festival Offer
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-zinc-900 rounded-[4rem] overflow-hidden border-4 border-amber-900/30 relative shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1605065541170-49658763567d?auto=format&fit=crop&q=80" 
                  alt="Traditional South Indian Food" 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-black/40 group-hover:bg-transparent transition-all">
                  <h3 className="text-white font-black italic text-4xl uppercase tracking-tighter">Harvest <br />Special</h3>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-600 rounded-full flex items-center justify-center border-4 border-black shadow-xl">
                <span className="text-black font-black text-center text-xs leading-none uppercase">Sweets & <br /> Pickles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-20">
            <div>
              <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Trending Now</h4>
              <h2 className="text-5xl font-black italic tracking-tighter uppercase">Our Signatures</h2>
            </div>
            <Link to="/products" className="text-amber-500 hover:text-white transition-colors flex items-center font-black uppercase tracking-widest text-xs gap-2 pb-2 border-b-2 border-amber-500/20">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: Flame, title: "Grandma's Heat", desc: "Original age-old family recipes" },
              { icon: Truck, title: "Global Reach", desc: "Shipping across India and USA" },
              { icon: CheckCircle2, title: "Pure Quality", desc: "No artificial colors or preservatives" },
              { icon: Award, title: "Heritage Pride", desc: "Authentic Machilipatnam flavors" }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 group hover:border-amber-500/30 transition-all">
                <item.icon className="text-amber-500 mb-6 transition-transform group-hover:scale-110" size={32} />
                <h3 className="text-lg font-black text-white uppercase italic mb-2">{item.title}</h3>
                <p className="text-gray-500 font-medium italic text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const Products = ({ onAddToCart }: { onAddToCart: (p: Product, w: '250g' | '500g' | '1kg') => void }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');

  const categories: Category[] = ['All', 'Non-Veg Pickles', 'Veg Pickles', 'Sweets', 'NV Dry Items', 'Hot Items'];

  const filtered = PRODUCTS.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black pt-32 pb-32 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Storefront</h4>
          <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-12">Explore Flavors</h2>
          
          <div className="max-w-2xl mx-auto relative mb-12">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Search for your favorite item..." 
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-white font-medium italic focus:outline-none focus:border-amber-500 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] italic border transition-all ${
                  activeCategory === cat 
                  ? 'bg-amber-600 border-amber-400 text-black shadow-lg shadow-amber-900/20' 
                  : 'bg-zinc-900 border-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 opacity-20">
            <Search size={64} className="mx-auto mb-6" />
            <p className="text-2xl font-bold italic">No items found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-black pt-32 pb-32 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div>
            <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Our Journey</h4>
            <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-12 leading-none">THE KITCHEN<br />OF LEGENDS.</h2>
            <div className="space-y-8 text-xl text-amber-100/60 font-medium italic leading-relaxed">
              <p>Founded in Machilipatnam, Teja Pickles has been synonymous with quality and tradition for over three decades. Our kitchen is more than just a production facility; it's a sanctuary where heritage recipes are preserved.</p>
              <p>We source every chili, every mango, and every spice from local farmers who share our passion for excellence. No mass production, no compromises – just pure, handcrafted goodness.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-16">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                <span className="block text-4xl font-black text-amber-500 mb-2 italic">30+</span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Years of Trust</span>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                <span className="block text-4xl font-black text-amber-500 mb-2 italic">100%</span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Natural</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-amber-500/20 blur-3xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1596797038530-2c396b27477b?auto=format&fit=crop&q=80" 
              alt="Heritage Kitchen" 
              className="relative rounded-3xl shadow-2xl border border-white/5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsPage = () => {
  return (
    <div className="min-h-screen bg-black pt-32 pb-32 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Wall of Love</h4>
          <h2 className="text-6xl font-black italic tracking-tighter uppercase">Spreading Joy</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="p-10 rounded-[2.5rem] bg-zinc-950 border border-white/5 flex flex-col items-center text-center group hover:border-amber-500/30 transition-all">
              <div className="relative mb-8">
                <div className="absolute -inset-2 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src={t.avatar} alt={t.name} className="relative w-24 h-24 rounded-full border-4 border-amber-500 object-cover" />
              </div>
              <div className="flex gap-1 mb-6 text-amber-500">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <p className="text-xl text-amber-100/60 font-medium italic leading-relaxed mb-8">"{t.comment}"</p>
              <div className="mt-auto">
                <h5 className="text-lg font-black text-white uppercase italic">{t.name}</h5>
                <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Delivery = () => {
  return (
    <div className="min-h-screen bg-black pt-32 pb-32 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="relative order-2 md:order-1">
             <div className="absolute -inset-4 bg-red-500/10 blur-3xl rounded-full"></div>
             <img src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80" alt="Fast Shipping" className="relative rounded-3xl shadow-2xl" />
          </div>
          <div className="order-1 md:order-2">
            <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Logistics</h4>
            <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-12">SPEEDY<br />ARRIVAL.</h2>
            <div className="space-y-10">
              {[
                { title: "Domestic Shipping", desc: "Across all states in India. Fast delivery to metros." },
                { title: "International (USA)", desc: "Special packaging for USA exports. Quality guaranteed." },
                { title: "Vacuum Sealed", desc: "Freshness locked in with premium food-grade packaging." },
                { title: "Order Tracking", desc: "Real-time updates directly to your WhatsApp." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                    <Truck className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white italic uppercase mb-2">{item.title}</h3>
                    <p className="text-amber-100/40 font-medium italic">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="min-h-screen bg-black pt-32 pb-32 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h4 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Get in Touch</h4>
          <h2 className="text-6xl font-black italic tracking-tighter uppercase">Let's Connect</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="bg-zinc-950 p-12 rounded-[3rem] border border-white/5">
            <h3 className="text-3xl font-black italic uppercase mb-12 tracking-tight">Direct Lines</h3>
            <div className="space-y-10">
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-8 group">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <Phone size={28} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Call Us</p>
                  <p className="text-2xl font-black text-white italic">{PHONE_NUMBER}</p>
                </div>
              </a>
              <a href={`https://instagram.com/${INSTAGRAM_HANDLE.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-8 group">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <Instagram size={28} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Instagram</p>
                  <p className="text-2xl font-black text-white italic">{INSTAGRAM_HANDLE}</p>
                </div>
              </a>
              <a href="https://youtube.com/channel/UCMGPdnAyW1T_5mflM_2Bu2A" target="_blank" rel="noreferrer" className="flex items-center gap-8 group">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <Youtube size={28} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">YouTube</p>
                  <p className="text-2xl font-black text-white italic">Teja Pickles</p>
                </div>
              </a>
              <div className="flex items-center gap-8 group">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-amber-500">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Visit Store</p>
                  <p className="text-2xl font-black text-white italic leading-tight">Machilipatnam, Andhra Pradesh, 521002</p>
                </div>
              </div>
            </div>
          </div>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 ml-4">Name</label>
                <input type="text" className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-5 px-6 text-white italic focus:outline-none focus:border-amber-500" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 ml-4">Email</label>
                <input type="email" className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-5 px-6 text-white italic focus:outline-none focus:border-amber-500" placeholder="your@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 ml-4">Message</label>
              <textarea rows={6} className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-5 px-6 text-white italic focus:outline-none focus:border-amber-500 resize-none" placeholder="What's on your mind?"></textarea>
            </div>
            <button className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase tracking-widest italic hover:bg-amber-500 transition-all transform active:scale-95 shadow-xl">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, weight: '250g' | '500g' | '1kg') => {
    let calculatedPrice = product.price;
    if (weight === '500g') calculatedPrice = Math.round(product.price * 0.55);
    if (weight === '250g') calculatedPrice = Math.round(product.price * 0.3);

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedWeight === weight);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedWeight === weight) 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedWeight: weight, calculatedPrice }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id: string, weight: string, delta: number) => {
    setCart(prev => prev.map(item => 
      (item.id === id && item.selectedWeight === weight) 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const removeFromCart = (id: string, weight: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedWeight === weight)));
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onAddToCart={addToCart} />} />
            <Route path="/products" element={<Products onAddToCart={addToCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/*" element={<Home onAddToCart={addToCart} />} />
          </Routes>
        </main>
        <Footer />
        <CartModal 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cart}
          onUpdateQty={updateCartQty}
          onRemove={removeFromCart}
        />
        <AIAssistant />
      </div>
    </BrowserRouter>
  );
};

export default App;
