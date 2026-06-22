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
import { getTransformedUrl } from "../utils/cloudinary.js";
import bgVideo from "../assets/videos/bg-video.mp4";
import LogoMarquee from "../components/LogoMarquee.jsx";
import LogoMarquee1 from "../components/LogoMarquee1.jsx";
import CountUpStat from "../components/CountUpStat.jsx";
import TestimonialsCarousel from "../components/TestimonialsCarousel.jsx";
import CategoryMediaCarouselSection from "../components/home/CategoryMediaCarouselSection.jsx";
import HeroCardsSection from "../components/home/HeroCardsSection.jsx";
import ElectronicImage from "../assets/images/electronics.jpg";
import fashionImage from "../assets/images/fashion.jpg";
import homeImage from "../assets/images/home.jpg";
import SportsImage from "../assets/images/sports.jpg";
import { PRODUCT_CATEGORIES } from "../styles/theme.js";

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
      className="group  relative overflow-hidden rounded-2xl border border-white/10 p-0 min-h-[180px] md:min-h-[220px]"
    >
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />
      <div
        className={`absolute glass inset-0 bg-gradient-to-r ${tones[tone] || tones.teal}`}
      />
      <div className="absolute inset-0 bg-dark-950/10 group-hover:bg-dark-950/0 transition-colors" />

      <div className="relative p-6 md:p-8 h-full flex flex-col justify-between">
        <div className="p-4 rounded-lg max-w-md">
          <div className="text-[11px] tracking-[0.18em] text-black/80 font-bold uppercase">
            New Collection
          </div>
          <div className="mt-2 text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-black drop-shadow-sm">
            {title}
          </div>
          <p className="mt-2 text-sm text-black/80 max-w-xs line-clamp-2">{tagline}</p>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 self-start px-4 py-2 rounded-xl bg-white/90 hover:scale-105 text-dark-950 text-sm font-semibold shadow-lg shadow-black/10 group-hover:bg-white transition-colors">
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
  const [heroImages, setHeroImages] = useState([]);
  const [heroVideoError, setHeroVideoError] = useState(false);
  const videoRef = useRef(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [latestArrivalBanners, setLatestArrivalBanners] = useState([]);
  const [storeSettings, setStoreSettings] = useState({
    freeShippingThreshold: 400,
    shippingCharge: 40,
    freeShippingEnabled: true,
  });

  const fallbackMarquee = useMemo(
    () => [
      "Special Offer: Get 10% Discounts for Online Payment (Razorpay)",
      'Special Discount Get Rs.50 Off On Order Above Rs.1000. Please Apply this Coupon Code: "special50"',
    ],
    [],
  );

  const fallbackMarquee1 = useMemo(
    () => {
      const liveCategories = categories
        .map((cat) => cat?.name)
        .filter(Boolean);
      const uniqueLiveCategories = [...new Set(liveCategories)];
      return uniqueLiveCategories.length ? uniqueLiveCategories : PRODUCT_CATEGORIES;
    },
    [categories],
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
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => {});
    api
      .get("/gallery", { params: { limit: 20 } })
      .then((res) => setGalleryImages(res.data.images || []))
      .catch(() => {});
    api
      .get("/settings")
      .then((res) => {
        const g = res.data.settings?.general;
        if (g) {
          setStoreSettings(prev => ({
            ...prev,
            freeShippingThreshold: Number.isFinite(Number(g.freeShippingThreshold)) ? Number(g.freeShippingThreshold) : prev.freeShippingThreshold,
            shippingCharge: Number.isFinite(Number(g.shippingCharge)) ? Number(g.shippingCharge) : prev.shippingCharge,
            freeShippingEnabled: typeof g.freeShippingEnabled === 'boolean' ? g.freeShippingEnabled : prev.freeShippingEnabled,
          }));
        }
        setMarqueeItems(res.data.settings?.marketing?.marqueeTexts || []);
        setLatestArrivalBanners(
          Array.isArray(res.data.settings?.homepage?.latestArrivalBanners)
            ? res.data.settings.homepage.latestArrivalBanners
            : [],
        );
        const nextVideo = res.data.settings?.homepage?.heroVideo?.url || "";
        setHeroVideoUrl(nextVideo);
        setHeroVideoError(false);
        const imgs = Array.isArray(res.data.settings?.homepage?.heroImages)
          ? res.data.settings.homepage.heroImages
          : [];
        const legacy = res.data.settings?.homepage?.heroImage?.url
          ? [{ url: res.data.settings.homepage.heroImage.url }]
          : [];
        const merged = imgs.length ? imgs : legacy;
        setHeroImages(merged.filter((x) => x?.url).map((x) => x.url));
      })
      .catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (!heroImages.length) return;
    if (heroImages.length === 1) return;
    const t = setInterval(() => {
      setHeroSlide((s) => (s + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(t);
  }, [heroImages]);

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

  const dynamicFeatures = useMemo(() => [
    {
      icon: Truck,
      title: storeSettings.freeShippingEnabled ? "Free Shipping" : "Shipping Charge",
      desc: storeSettings.freeShippingEnabled ? `On orders over ₹${storeSettings.freeShippingThreshold}` : `₹${storeSettings.shippingCharge}`
    },
    { icon: Shield, title: "Secure Payment", desc: "Razorpay protected" },
    { icon: RefreshCw, title: "Easy Returns", desc: "3 day return policy" },
    { icon: Headphones, title: "24/7 Support", desc: "Always here for you" },
  ], [storeSettings]);

  return (
    <div className="">
      <SEO
        title="Sandhaikart – Premium Shopping"
        description="Discover amazing deals at Sandhaikart. Shop Electronics, Fashion, Home & Kitchen and more with fast delivery across India."
        schema={generateWebsiteSchema()}
      />

      <CategoryMediaCarouselSection />

      <section className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <LogoMarquee1 items={fallbackMarquee1} />
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-3 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title text-[#2a365b]">
                  Shop by Category
                </h2>
                <p className="text-slate-600 text-md mt-1">
                  Find exactly what you're looking for
                </p>
              </div>
              <Link to="/products" className="btn-ghost text-[#2a365b] text-sm">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {categories.map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Background orbs */}
      <div
        className="orb orb-orange"
        style={{ top: "-100px", left: "-200px" }}
      />
      <div
        className="orb orb-blue"
        style={{ bottom: "20%", right: "-100px" }}
      />

    

      {/* Features */}
      <section className="py-5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dynamicFeatures.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex glass hover:shadow-xl transition-all duration-300 border border-black/10 rounded-lg items-center gap-4 p-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2a365b]/10 border border-[#2a365b]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#2a365b]" />
                </div>
                <div>
                  <p className="text-[#1f2b4d] font-medium text-lg font-display">
                    {title}
                  </p>
                  <p className="text-[#d6872b] font-bold text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo banners (above gallery) */}
      <section className="py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-5">
            <h2 className="section-title text-[#2a365b]">Latest Arrivals</h2>
            <p className="text-slate-500 text-md mt-1">Explore our newest collection</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {(latestArrivalBanners?.length ? latestArrivalBanners : [
              {
                title: "HEALTH",
                description: "Start strong, stay strong — essentials for your everyday wellness.",
                image: { url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80" },
                to: "/products?category=Beauty",
              },
              {
                title: "HOODIES",
                description: "Wear comfort. Live bold — street-ready fits, all day.",
                image: { url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80" },
                to: "/products?category=Fashion",
              },
            ]).slice(0, 2).map((b, idx) => (
              <PromoBanner
                key={b?.image?.url || idx}
                title={b.title || "Latest"}
                tagline={b.description || ""}
                tone={idx % 2 === 0 ? "teal" : "amber"}
                to={b.to || "/products"}
                imageUrl={b.image?.url || ""}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <div className="flex items-end justify-between mb-5 px-4 mt-3 sm:px-6 max-w-7xl mx-auto">
        <div className="">
          <h2 className="section-title text-[#2a365b]">Gallery</h2>
          <p className="text-slate-500 text-md mt-1">
            Find exactly what you're looking for
          </p>
        </div>
        <Link
          to="/products"
          className="btn-ghost text-black/70 hover:text-black text-sm"
        >
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
          {
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
            caption: "Headphones",
          },
          {
            url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
            caption: "Camera",
          },
        ];
        const pick = (idx) => galleryImages[idx] || fallback[idx];
        return (
          <section className="max-w-7xl mx-auto p-4 grid grid-cols-2 md:grid-cols-5 gap-4 md:h-[500px] lg:h-[600px]">
            <div className="md:col-span-1 grid grid-rows-10 gap-4 h-[300px] sm:h-[400px] md:h-full">
              <div className="row-span-4 rounded-xl overflow-hidden shadow-sm w-full h-full relative" style={{ minHeight: 0 }}>
                <img
                  src={getTransformedUrl(pick(0)?.url, { width: 480, height: 460, crop: 'fill_pad', gravity: 'auto', background: 'auto' })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-300"
                  alt={pick(0)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm w-full h-full relative" style={{ minHeight: 0 }}>
                <img
                  src={getTransformedUrl(pick(1)?.url, { width: 480, height: 708, crop: 'pad', background: 'auto' })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'fill', objectPosition: 'center', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-300"
                  alt={pick(1)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="md:col-span-1 grid grid-rows-10 gap-4 h-[300px] sm:h-[400px] md:h-full">
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm w-full h-full relative" style={{ minHeight: 0 }}>
                <img
                  src={getTransformedUrl(pick(2)?.url, { width: 480, height: 708, crop: 'fill_pad', gravity: 'auto', background: 'auto' })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-300"
                  alt={pick(2)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
              <div className="row-span-4 rounded-xl overflow-hidden shadow-sm w-full h-full relative" style={{ minHeight: 0 }}>
                <img
                  src={getTransformedUrl(pick(3)?.url, { width: 480, height: 460, crop: 'fill_pad', gravity: 'auto', background: 'auto' })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-300"
                  alt={pick(3)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="md:col-span-1 grid grid-rows-10 gap-4 h-[300px] sm:h-[400px] md:h-full">
              <div className="row-span-4 rounded-xl overflow-hidden shadow-sm w-full h-full relative" style={{ minHeight: 0 }}>
                <img
                  src={getTransformedUrl(pick(4)?.url, { width: 480, height: 460, crop: 'fill_pad', gravity: 'auto', background: 'auto' })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-300"
                  alt={pick(4)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm w-full h-full relative" style={{ minHeight: 0 }}>
                <img
                  src={getTransformedUrl(pick(5)?.url, { width: 480, height: 708, crop: 'pad', background: 'auto' })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-300"
                  alt={pick(5)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="md:col-span-1 grid grid-rows-10 gap-4 h-[300px] sm:h-[400px] md:h-full">
              <div className="row-span-4 rounded-xl overflow-hidden shadow-sm w-full h-full relative" style={{ minHeight: 0 }}>
                <img
                  src={getTransformedUrl(pick(6)?.url, { width: 480, height: 460, crop: 'pad', background: 'auto' })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-300"
                  alt={pick(6)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm w-full h-full relative" style={{ minHeight: 0 }}>
                <img
                  src={getTransformedUrl(pick(7)?.url, { width: 480, height: 708, crop: 'fill_pad', gravity: 'auto', background: 'auto' })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-300"
                  alt={pick(7)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
            </div>

            <div className="md:col-span-1 grid grid-rows-10 gap-4 h-[300px] sm:h-[400px] md:h-full">
              <div className="row-span-6 rounded-xl overflow-hidden shadow-sm w-full h-full relative" style={{ minHeight: 0 }}>
                <img
                  src={getTransformedUrl(pick(8)?.url, { width: 480, height: 708, crop: 'fill_pad', gravity: 'auto', background: 'auto' })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-300"
                  alt={pick(8)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
              <div className="row-span-4 rounded-xl overflow-hidden shadow-sm w-full h-full relative" style={{ minHeight: 0 }}>
                <img
                  src={getTransformedUrl(pick(9)?.url, { width: 480, height: 460, crop: 'pad', background: 'auto' })}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  className="hover:scale-105 transition-transform duration-300"
                  alt={pick(9)?.caption || "Gallery image"}
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        );
      })()}

      {/* Logos marquee (under featured products) */}
      <section className="border-t border-white/5 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <LogoMarquee
            repeat={false}
            items={marqueeItems?.length ? marqueeItems : fallbackMarquee}
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-3 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title text-[#2a365b]">
                Featured Products
              </h2>
              <p className="text-slate-500 text-md mt-1">Hand-picked for you</p>
            </div>
            <Link
              to="/products?featured=true"
              className="btn-ghost text-[#2a365b] text-sm hover:text-black"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="glass-card aspect-[3/4] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <HeroCardsSection />

      {/* CTA Banner */}
      <section className="py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 to-transparent" />
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                Get 10% off your first order
              </h2>
              <p className="text-slate-600 mb-6">
                Sign up and use code{" "}
                <span className="text-primary-400 font-mono font-bold">
                  AREMBI10
                </span>{" "}
                at checkout.
              </p>
              <Link
                to="/register"
                className="btn-primary text-white py-4 px-8 text-base"
              >
                Claim Offer <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About + Testimonials (above footer) */}
      <section className="py-7 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* About */}
            <div className="glass-card p-8">
              <h2 className="section-title text-[#2a365b]">About Us</h2>
              <p className="text-slate-500 mt-4 leading-relaxed">
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
                    <div className="text-[#2a365b] font-semibold">{x.k}</div>
                    <div className="text-slate-500 text-sm mt-1">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <div className="flex items-end justify-between">
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
    </div>
  );
}
