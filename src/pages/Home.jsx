import { useEffect, useMemo, useRef, useState } from "react";
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
import bgVideo from "../assets/videos/bg-video.mp4";
import LogoMarquee from "../components/LogoMarquee.jsx";
import LogoMarquee1 from "../components/LogoMarquee1.jsx";
import CountUpStat from "../components/CountUpStat.jsx";
import TestimonialsCarousel from "../components/TestimonialsCarousel.jsx";
import ElectronicImage from "../assets/images/electronics.jpg";
import fashionImage from "../assets/images/fashion.jpg";
import homeImage from "../assets/images/home.jpg";
import SportsImage from "../assets/images/sports.jpg";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over ₹400" },
  { icon: Shield, title: "Secure Payment", desc: "Razorpay protected" },
  { icon: RefreshCw, title: "Easy Returns", desc: "7 day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here for you" },
];

function PromoBanner({ title, tagline, imageUrl, to, tone = "teal" }) {
  const tones = {
    teal: "from-emerald-500/25 via-teal-500/10 to-transparent",
    amber: "from-amber-500/30 via-orange-500/10 to-transparent",
  };

  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-white/10 glass-card p-0 min-h-[180px] md:min-h-[220px]"
    >
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div
        className={`absolute inset-0 bg-gradient-to-r ${tones[tone] || tones.teal}`}
      />
      <div className="absolute inset-0 bg-dark-950/10 group-hover:bg-dark-950/0 transition-colors" />

      <div className="relative p-6 md:p-8 h-full flex flex-col justify-between">
        <div>
          <div className="text-[11px] tracking-[0.18em] font-semibold text-white/80 uppercase">
            New Collection
          </div>
          <div className="mt-2 text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white drop-shadow-sm">
            {title}
          </div>
          <p className="mt-2 text-sm text-white/80 max-w-xs">{tagline}</p>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 self-start px-4 py-2 rounded-xl bg-white/90 text-dark-950 text-sm font-semibold shadow-lg shadow-black/10 group-hover:bg-white transition-colors">
          Shop now <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const { featured, loading } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [marqueeItems, setMarqueeItems] = useState([]);
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroVideoError, setHeroVideoError] = useState(false);
  const videoRef = useRef(null);

  const fallbackMarquee = useMemo(
    () => [
      "Special Offer: Get 10% Discounts for Online Payment (Razorpay)",
      'Special Discount Get Rs.50 Off On Order Above Rs.1000. Please Apply this Coupon Code: "special50"',
    ],
    [],
  );

  const fallbackMarquee1 = useMemo(
    () => [
      "Beauty",
      "Books",
      "Toys",
      "Groceries",
      "Automotive",
      "Garden & Outdoors",
      "Pet Supplies",
      "Office Products",
      "Health & Personal Care",
      "Baby Products",
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
    api
      .get("/gallery", { params: { limit: 20 } })
      .then((res) => setGalleryImages(res.data.images || []))
      .catch(() => {});
    api
      .get("/settings")
      .then((res) => {
        setMarqueeItems(res.data.settings?.marketing?.marqueeTexts || []);
        const nextVideo = res.data.settings?.homepage?.heroVideo?.url || "";
        setHeroVideoUrl(nextVideo);
        setHeroVideoError(false);
        setHeroImageUrl(res.data.settings?.homepage?.heroImage?.url || "");
      })
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
  }, [heroVideoUrl]);

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
        {/* Background media (admin-configurable) */}
        {heroVideoUrl && !heroVideoError ? (
          <video
            key={heroVideoUrl}
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            poster={heroImageUrl || undefined}
            onLoadedData={() => setHeroVideoError(false)}
            onError={() => setHeroVideoError(true)}
          >
            <source src={heroVideoUrl} />
          </video>
        ) : heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            loading="eager"
            decoding="async"
          />
        ) : (
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
        )}

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
                <span className="text-white/80 text-4xl md:text-5xl font-normal">
                  in India
                </span>
              </h1>

              <p className="text-white/80 text-lg max-w-md leading-relaxed">
                Discover thousands of premium products with guaranteed quality,
                fast shipping, and easy returns.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="btn-primary text-white py-4 px-8"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/products?category=Handicraft Items"
                  className="btn-secondary text-base py-4 px-8"
                >
                  Handicraft Items
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
                    <div className="text-white/70 text-sm">{stat.label}</div>
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
                      image: ElectronicImage,
                      label: "Electronics",
                    },
                    {
                      image: fashionImage,
                      label: "Fashion",
                    },
                    {
                      image: homeImage,
                      label: "Home",
                    },
                    {
                      image: SportsImage,
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
                <div className="absolute top-2 right-2 glass px-4 py-2 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-white fill-white" />
                    <span className="text-white font-bold text-sm">4.8/5</span>
                  </div>
                  <p className="text-slate-400 text-xs">50K+ Reviews</p>
                </div>

                <div className="absolute bottom-2 left-2 glass px-4 py-3 rounded-2xl shadow-xl">
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
          <LogoMarquee
            repeat={false}
            items={marqueeItems?.length ? marqueeItems : fallbackMarquee}
          />
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
                  <p className="text-white font-medium text-md">{title}</p>
                  <p className="text-slate-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banners (above gallery) */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-5">
            <PromoBanner
              title="HEALTH"
              tagline="Start strong, stay strong — essentials for your everyday wellness."
              tone="teal"
              to="/products?category=Beauty"
              imageUrl="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
            />
            <PromoBanner
              title="HOODIES"
              tagline="Wear comfort. Live bold — street-ready fits, all day."
              tone="amber"
              to="/products?category=Fashion"
              imageUrl="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-10 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title">Shop by Category</h2>
                <p className="text-slate-500 text-md mt-1">
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

      {/* Gallery */}
      <div className="flex items-end justify-between mb-10 px-4 mt-10 sm:px-6 lg:px-8">
        <div>
          <h2 className="section-title">Gallery</h2>
          <p className="text-slate-500 text-md mt-1">
            Find exactly what you're looking for
          </p>
        </div>
        <Link to="/products" className="btn-ghost text-sm">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {(() => {
        const fallback = [
          {
            url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
            caption: "Ingredients",
          },
          {
            url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
            caption: "Portrait",
          },
          {
            url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
            caption: "Warm soup bowl",
          },
          {
            url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
            caption: "Fashion model",
          },
          {
            url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
            caption: "Yoga and wellness",
          },
          {
            url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
            caption: "Streetwear",
          },
          {
            url: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=400&q=80",
            caption: "Red Top",
          },
          {
            url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80",
            caption: "Group Wear",
          },
        ];
        const pick = (idx) => galleryImages[idx] || fallback[idx];
        return (
          <section className="max-w-7xl mx-auto p-4 grid grid-cols-2 md:grid-cols-5 gap-4 lg:h-[600px]">
            <div className="md:col-span-1 grid grid-rows-10 gap-4">
              <div className="row-span-4 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={pick(0)?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={pick(0)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={pick(1)?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={pick(1)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="md:col-span-1 grid grid-rows-10 gap-4">
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={pick(2)?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={pick(2)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
              <div className="row-span-4 bg-blue-50 p-6 rounded-xl flex flex-col justify-center">
                <h3 className="font-bold text-xl mb-1">GUT</h3>
                <p className="text-xs text-gray-600 leading-tight">
                  Real ingredients, rich flavors fuel your body the natural way.
                </p>
              </div>
            </div>

            <div className="md:col-span-1 grid grid-rows-10 gap-4">
              <div className="row-span-4 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={pick(3)?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={pick(3)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={pick(4)?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={pick(4)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="md:col-span-1 grid grid-rows-10 gap-4">
              <div className="row-span-4 bg-orange-50 p-6 rounded-xl flex flex-col justify-center">
                <h3 className="font-bold text-xl mb-1">FIT</h3>
                <p className="text-xs text-gray-600 leading-tight">
                  Effortless styles for a confident you—dress every day with
                  comfort.
                </p>
              </div>
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={pick(5)?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={pick(5)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="md:col-span-1 grid grid-rows-10 gap-4">
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={pick(6)?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={pick(6)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
              <div className="row-span-4 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={pick(7)?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={pick(7)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="lg:hidden md:col-span-1 grid grid-rows-10 gap-4">
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={pick(4)?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={pick(4)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
              <div className="row-span-4 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={pick(7)?.url}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  alt={pick(7)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        );
      })()}

      {/* Logos marquee (under featured products) */}
      <section className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <LogoMarquee1 items={fallbackMarquee1} />
        </div>
      </section>


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
              <p className="text-slate-500 text-md mt-1">Hand-picked for you</p>
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
