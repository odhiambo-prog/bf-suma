import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Leaf, 
  ShieldCheck, 
  Award, 
  Coffee, 
  Activity, 
  Heart, 
  Baby, 
  Sparkles, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { CATEGORIES, PRODUCTS } from './constants';
import type { Product } from './constants';
import { cn } from './lib/utils';

// Helper for dynamic icons based on category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Immune Booster': return <ShieldCheck className="w-6 h-6" />;
    case 'Bone & Joint Care': return <Activity className="w-6 h-6" />;
    case 'Cardiovascular Health': return <Heart className="w-6 h-6" />;
    case 'Smart Kids': return <Baby className="w-6 h-6" />;
    case 'Anti-Aging': return <Sparkles className="w-6 h-6" />;
    case 'Digestive Living': return <Leaf className="w-6 h-6" />;
    case 'Better Life': return <Award className="w-6 h-6" />;
    case 'Premium Selected': return <ShoppingBag className="w-6 h-6" />;
    default: return <Leaf className="w-6 h-6" />;
  }
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Products', href: '#products' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="BFSUMA Eagle Shop" className="h-10 w-auto" />
          <span className={cn(
            "font-display font-bold text-xl hidden sm:block",
            isScrolled ? "text-bfsuma-green" : "text-bfsuma-green"
          )}>Eagle Shop</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium hover:text-bfsuma-gold transition-colors text-slate-800"
            >
              {link.name}
            </a>
          ))}
          <button className="bg-bfsuma-green text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all shadow-md">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-bfsuma-green"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-6 px-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-lg font-medium text-slate-800 border-b border-slate-100 pb-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="bg-bfsuma-green text-white px-6 py-3 rounded-xl text-lg font-semibold mt-2">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-bfsuma-warm">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-bfsuma-green/5 hidden lg:block" />
      
      {/* Decorative Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-bfsuma-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-bfsuma-gold/10 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-bfsuma-sage text-bfsuma-green text-xs font-bold tracking-widest uppercase mb-6">
            Trusted Wellness Solutions
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight text-slate-900 mb-6">
            Elevate Your <span className="text-bfsuma-green">Vitality</span> with Nature's Best
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            Discover premium, science-backed supplements designed to optimize your health. From immune boosters to anti-aging wonders, BFSUMA brings Los Angeles quality to Nairobi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#products" className="bg-bfsuma-green text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 transition-all">
              Shop Now <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#about" className="bg-white border-2 border-bfsuma-green text-bfsuma-green px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-bfsuma-sage/20 transition-all">
              Learn More
            </a>
          </div>
          
          <div className="mt-12 flex items-center gap-8 border-t border-slate-200 pt-8">
            <div>
              <p className="text-3xl font-bold text-bfsuma-green">50+</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Premium Products</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <p className="text-3xl font-bold text-bfsuma-green">10k+</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Happy Customers</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="/images/supp.jpeg" 
              alt="BFSUMA Products" 
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Floating Card */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 z-20 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-bfsuma-gold/20 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-bfsuma-gold" />
              </div>
              <div>
                <p className="font-bold text-slate-900">100% Organic</p>
                <p className="text-xs text-slate-500">Pure Herbal Extracts</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">BFSUMA Nairobi Eagle Shop</h2>
          <div className="w-20 h-1 bg-bfsuma-gold mx-auto mb-6" />
          <p className="text-slate-600 text-lg">
            Beyond supplements, we are a wellness hub. Located at the heart of Nairobi, our Eagle Shop provides professional health services to support your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Wellness Center", 
              desc: "Professional full-body screenings and personalized health consultations.", 
              icon: <Activity className="w-8 h-8" />,
              img: "/images/WhatsApp Image 2026-06-09 at 14.09.11.jpeg"
            },
            { 
              title: "Eagle Bistro", 
              desc: "Enjoy our signature Cordyceps and Reishi functional coffees in a relaxing space.", 
              icon: <Coffee className="w-8 h-8" />,
              img: "/images/WhatsApp Image 2026-06-09 at 14.09.13.jpeg"
            },
            { 
              title: "Training Hub", 
              desc: "Daily training sessions for distributors and product knowledge workshops.", 
              icon: <Award className="w-8 h-8" />,
              img: "/images/WhatsApp Image 2026-06-09 at 14.09.14 (3).jpeg"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group bg-bfsuma-warm rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-bfsuma-green">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 mb-6">{item.desc}</p>
                <button className="text-bfsuma-green font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(PRODUCTS);
    } else {
      setFilteredProducts(PRODUCTS.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <section id="products" className="py-24 bg-bfsuma-warm/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">Premium Supplement Catalog</h2>
            <p className="text-slate-600">Browse our wide range of products categorized by health benefits. Find exactly what your body needs.</p>
          </div>
          
          <div className="relative group">
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200 cursor-pointer">
              <ShoppingBag className="w-5 h-5 text-bfsuma-green" />
              <span className="font-bold text-slate-800">{selectedCategory}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
            
            {/* Simple Dropdown Simulator */}
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 py-4 max-h-96 overflow-y-auto">
              <button 
                onClick={() => setSelectedCategory('All')}
                className="w-full text-left px-6 py-2 hover:bg-bfsuma-sage/10 hover:text-bfsuma-green transition-colors font-medium"
              >
                All Products
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="w-full text-left px-6 py-2 hover:bg-bfsuma-sage/10 hover:text-bfsuma-green transition-colors font-medium"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Quick Filter */}
        <div className="flex flex-wrap gap-4 mb-12">
          {['All', ...CATEGORIES.slice(0, 5)].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-semibold transition-all",
                selectedCategory === cat 
                  ? "bg-bfsuma-green text-white shadow-lg shadow-bfsuma-green/30" 
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.code}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="aspect-square bg-slate-50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                  <div className="text-bfsuma-green/20 scale-150">
                    {getCategoryIcon(product.category)}
                  </div>
                  <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[10px] font-bold px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">
                    {product.code}
                  </span>
                </div>
                <div className="flex flex-col h-full">
                  <p className="text-xs font-bold text-bfsuma-gold uppercase tracking-widest mb-2">{product.category}</p>
                  <h3 className="font-bold text-slate-900 leading-tight mb-4 group-hover:text-bfsuma-green transition-colors">{product.name}</h3>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <button className="text-sm font-bold text-bfsuma-green flex items-center gap-1 hover:gap-2 transition-all">
                      View Details <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-bfsuma-sage/30 flex items-center justify-center text-bfsuma-green">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-8">
            <img src="/logo.png" alt="BFSUMA" className="h-12 w-auto brightness-0 invert" />
            <span className="font-display font-bold text-2xl text-white">Eagle Shop</span>
          </div>
          <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
            Nairobi's premier destination for high-quality health supplements and professional wellness services. Your journey to optimal health starts here.
          </p>
          <div className="flex gap-4">
            {['facebook', 'instagram', 'twitter', 'linkedin'].map(social => (
              <div key={social} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-bfsuma-green transition-colors cursor-pointer">
                <span className="sr-only">{social}</span>
                {/* Social icons placeholder */}
                <div className="w-4 h-4 bg-slate-400 rounded-sm" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-8">Quick Links</h4>
          <ul className="flex flex-col gap-4 text-slate-400">
            <li><a href="#home" className="hover:text-bfsuma-gold transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-bfsuma-gold transition-colors">About Hub</a></li>
            <li><a href="#products" className="hover:text-bfsuma-gold transition-colors">Supplements</a></li>
            <li><a href="#" className="hover:text-bfsuma-gold transition-colors">Testimonials</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-8">Contact Us</h4>
          <ul className="flex flex-col gap-6 text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-bfsuma-gold flex-shrink-0" />
              <span>6th Floor, Utumishi House, Mamlaka Road, Nairobi, Kenya</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-bfsuma-gold flex-shrink-0" />
              <span>+254 (0)716626037</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-bfsuma-gold flex-shrink-0" />
              <span>info@eagleshop.co.ke</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2026 BFSUMA Eagle Shop Nairobi. All Rights Reserved. Built with Vitality.</p>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-bfsuma-warm text-slate-900 selection:bg-bfsuma-green selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <ProductsSection />
      
      {/* Benefit Banner */}
      <section className="py-20 bg-bfsuma-green relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-black/5 -skew-x-12 transform translate-x-20" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-8">Ready to Transform Your Health?</h2>
          <p className="text-bfsuma-sage text-xl mb-12 max-w-2xl mx-auto">Visit our Nairobi Wellness Center for a comprehensive screening and personalized supplement plan.</p>
          <button className="bg-bfsuma-gold text-slate-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-all shadow-xl">
            Book a Consultation
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
