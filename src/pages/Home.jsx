import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Shield,
  RefreshCw,
  Headphones,
  Star,
  Zap,
} from "lucide-react";
import SEO from "../components/SEO.jsx";
import ProductCard from "../components/ProductCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import { fetchFeaturedProducts } from "../redux/slices/productSlice.js";
import { generateWebsiteSchema } from "../utils/seo.js";
import api from "../utils/api.js";
import { useState } from "react";
import bgVideo from "../assets/videos/bg-video.mp4";
import LogoMarquee from "../components/LogoMarquee.jsx";
import CountUpStat from "../components/CountUpStat.jsx";
import TestimonialsCarousel from "../components/TestimonialsCarousel.jsx";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over ₹499" },
  { icon: Shield, title: "Secure Payment", desc: "Razorpay protected" },
  { icon: RefreshCw, title: "Easy Returns", desc: "7 day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here for you" },
];

export default function Home() {
  const dispatch = useDispatch();
  const { featured, loading } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const videoRef = useRef(null);

  const logoItems = useMemo(
    () => [
      "Sandhaikart",
      "Electronics",
      "Fashion",
      "Home & Kitchen",
      "Sports",
      "Books",
      "Beauty",
      "New Arrivals",
      "Best Sellers",
      "Top Rated",
      "Fast Delivery",
      "Secure Payments",
    ],
    [],
  );

  const testimonials = useMemo(
    () => [
      {
        quote:
          "The product quality is consistently great and delivery is always on time. Clean UI, smooth checkout.",
        name: "Aarav S.",
        title: "Verified Customer",
        badge: "5★",
      },
      {
        quote:
          "Fast shipping and excellent packaging. Support team was quick to respond and super helpful.",
        name: "Meera K.",
        title: "Repeat Buyer",
        badge: "Support",
      },
      {
        quote:
          "Love the curated selection. The featured picks are genuinely useful and the pricing is fair.",
        name: "Vikram R.",
        title: "Premium Member",
        badge: "Value",
      },
      {
        quote:
          "Checkout with Razorpay was seamless. Orders page is clear and tracking updates are timely.",
        name: "Ananya P.",
        title: "Verified Customer",
        badge: "Smooth",
      },
      {
        quote:
          "Minimal design, great experience. Product cards are clean and the filters work perfectly.",
        name: "Rohit M.",
        title: "Power Shopper",
        badge: "UX",
      },
      {
        quote:
          "Returns were hassle-free. The team processed it quickly and kept me updated throughout.",
        name: "Sneha D.",
        title: "Verified Customer",
        badge: "Returns",
      },
    ],
    [],
  );

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    api
      .get("/categories")
      .then((res) => setCategories(res.data.categories?.slice(0, 6) || []))
      .catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        // Autoplay can still be blocked on some browsers; keep silent fallback.
      }
    };
    const t = setTimeout(tryPlay, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <SEO
        title="Sandhaikart – Premium Shopping"
        description="Discover amazing deals at Sandhaikart. Shop Electronics, Fashion, Home & Kitchen and more with fast delivery across India."
        schema={generateWebsiteSchema()}
      />

      {/* Background orbs */}
      <div
        className="orb orb-orange"
        style={{ top: "-100px", left: "-200px" }}
      />
      <div
        className="orb orb-blue"
        style={{ bottom: "20%", right: "-100px" }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>

        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-primary-400">
                <Zap className="w-4 h-4 fill-primary-400" />
                <span>New arrivals every week</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight">
                Shop the <span className="gradient-text">Best</span>
                <br />
                Products
                <br />
                <span className="text-slate-400 text-4xl md:text-5xl font-normal">
                  in India
                </span>
              </h1>

              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Discover thousands of premium products with guaranteed quality,
                fast shipping, and easy returns.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="btn-primary text-base py-4 px-8"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/products?category=Electronics"
                  className="btn-secondary text-base py-4 px-8"
                >
                  Electronics
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                {[
                  { value: "10K+", label: "Products" },
                  { value: "50K+", label: "Customers" },
                  { value: "4.8★", label: "Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-slate-500 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image/visual */}
            <div className="relative animate-fade-in hidden lg:block">
              <div className="glass rounded-3xl p-8 relative overflow-hidden">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      image: "/assets/images/electronics.jpg",
                      label: "Electronics",
                    },
                    {
                      image: "/assets/images/fashion.jpg",
                      label: "Fashion",
                    },
                    {
                      image: "/assets/images/home.jpg",
                      label: "Home",
                    },
                    {
                      image: "/assets/images/sports.jpg",
                      label: "Sports",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="glass-card p-6 flex flex-col items-center justify-center gap-3 aspect-square overflow-hidden relative"
                    >
                      {/* Background image */}
                      <img
                        src={item.image}
                        alt={item.label}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                      />
                      {/* Overlay for readability */}
                      <div className="absolute inset-0 bg-black/40"></div>
                      {/* Text label */}
                      <span className="relative z-10 text-white font-bold text-lg">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 glass px-4 py-2 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-white fill-white" />
                    <span className="text-white font-bold text-sm">4.8/5</span>
                  </div>
                  <p className="text-slate-400 text-xs">50K+ Reviews</p>
                </div>

                <div className="absolute -bottom-4 -left-4 glass px-4 py-3 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-white" />
                    <div>
                      <p className="text-white font-bold text-xs">
                        Free Delivery
                      </p>
                      <p className="text-slate-400 text-xs">Orders over ₹499</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand / Product logos marquee (under hero) */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <LogoMarquee items={logoItems} />
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{title}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title">Shop by Category</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Find exactly what you're looking for
                </p>
              </div>
              <Link to="/products" className="btn-ghost text-sm">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Count-up stats (above featured products) */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Products Listed", value: 10000, suffix: "+" },
              { label: "Happy Customers", value: 50000, suffix: "+" },
              { label: "Orders Delivered", value: 250000, suffix: "+" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-7">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  {s.label}
                </div>
                <CountUpStat
                  value={s.value}
                  suffix={s.suffix}
                  className="mt-3 text-3xl md:text-4xl font-display font-bold text-white"
                />
                <div className="mt-3 text-slate-500 text-sm">
                  Live marketplace activity
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-slate-500 text-sm mt-1">Hand-picked for you</p>
            </div>
            <Link to="/products?featured=true" className="btn-ghost text-sm">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card aspect-[3/4] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Logos marquee (under featured products) */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <LogoMarquee items={logoItems} />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 to-transparent" />
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Get 10% off your first order
              </h2>
              <p className="text-slate-400 mb-6">
                Sign up and use code{" "}
                <span className="text-primary-400 font-mono font-bold">
                  WELCOME10
                </span>{" "}
                at checkout.
              </p>
              <Link to="/register" className="btn-primary py-4 px-8 text-base">
                Claim Offer <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About + Testimonials (above footer) */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* About */}
            <div className="glass-card p-8">
              <h2 className="section-title">About Us</h2>
              <p className="text-slate-400 mt-4 leading-relaxed">
                Sandhaikart is a premium online marketplace focused on quality,
                speed, and a simple shopping experience. We curate products
                across essentials and lifestyle categories, backed by secure
                payments and responsive support.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {[
                  { k: "Quality-first", v: "Curated products you can trust" },
                  { k: "Fast delivery", v: "Quick dispatch and tracking" },
                  { k: "Secure checkout", v: "Razorpay protected payments" },
                  { k: "Easy returns", v: "Simple, transparent policies" },
                ].map((x) => (
                  <div key={x.k} className="glass p-4 rounded-2xl">
                    <div className="text-white font-semibold">{x.k}</div>
                    <div className="text-slate-500 text-sm mt-1">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="section-title">Testimonials</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Real feedback from our customers
                  </p>
                </div>
                <div className="text-slate-500 text-xs">Slides every 3s</div>
              </div>
              <TestimonialsCarousel
                testimonials={testimonials}
                intervalMs={3000}
                cardsPerSlide={3}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
