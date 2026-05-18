import { useEffect, useState } from 'react'
import { Save, Key, Palette, Globe, Truck } from 'lucide-react'
import AdminLayout from './AdminLayout.jsx'
import Button from '../../components/Button.jsx'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'

function Section({ title, icon: Icon, children, sectionName, saving, onSave }) {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary-400" />
          </div>
          <h2 className="text-white font-semibold">{title}</h2>
        </div>
        <Button size="sm" loading={saving} onClick={(e) => { e.preventDefault(); onSave(sectionName) }}>
          <Save className="w-3.5 h-3.5" /> Save
        </Button>
      </div>
      {children}
    </div>
  )
}

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Sandhaikart',
    siteDescription: 'Premium online shopping destination in India',
    primaryColor: '#f97316',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    shiprocketEmail: '',
    shiprocketPassword: '',
    shiprocketPickupLocation: 'Primary',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    metaTitle: 'Sandhaikart – Premium Shopping',
    metaDescription: 'Shop the best products at Sandhaikart.',
    freeShippingThreshold: 499,
    shippingCharge: 49,
    freeShippingEnabled: true,
    marqueeTexts: '',
    couponCode: '',
  })
  const [secrets, setSecrets] = useState({
    hasRazorpayKeySecret: false,
    hasShiprocketPassword: false,
    hasCloudinaryApiSecret: false,
  })
  const [saving, setSaving] = useState(false)

  const set = (key, value) => setSettings(s => ({ ...s, [key]: value }))

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const { data } = await api.get('/admin/settings')
        const s = data?.settings
        if (!mounted || !s) return

        setSettings(prev => ({
          ...prev,
          siteName: s.general?.siteName ?? prev.siteName,
          siteDescription: s.general?.siteDescription ?? prev.siteDescription,
          freeShippingThreshold: s.general?.freeShippingThreshold ?? prev.freeShippingThreshold,
          shippingCharge: s.general?.shippingCharge ?? prev.shippingCharge,
          freeShippingEnabled: s.general?.freeShippingEnabled ?? prev.freeShippingEnabled,

          metaTitle: s.seo?.metaTitle ?? prev.metaTitle,
          metaDescription: s.seo?.metaDescription ?? prev.metaDescription,

          primaryColor: s.theme?.primaryColor ?? prev.primaryColor,

          marqueeTexts: (s.marketing?.marqueeTexts || []).join('\n'),
          couponCode: s.marketing?.couponCode ?? prev.couponCode,

          razorpayKeyId: s.integrations?.razorpay?.keyId ?? prev.razorpayKeyId,
          razorpayKeySecret: '',
          shiprocketEmail: s.integrations?.shiprocket?.email ?? prev.shiprocketEmail,
          shiprocketPassword: '',
          shiprocketPickupLocation: s.integrations?.shiprocket?.pickupLocation ?? prev.shiprocketPickupLocation,
          cloudinaryCloudName: s.integrations?.cloudinary?.cloudName ?? prev.cloudinaryCloudName,
          cloudinaryApiKey: s.integrations?.cloudinary?.apiKey ?? prev.cloudinaryApiKey,
          cloudinaryApiSecret: '',
        }))

        setSecrets({
          hasRazorpayKeySecret: Boolean(s.secrets?.hasRazorpayKeySecret),
          hasShiprocketPassword: Boolean(s.secrets?.hasShiprocketPassword),
          hasCloudinaryApiSecret: Boolean(s.secrets?.hasCloudinaryApiSecret),
        })
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load settings')
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleSave = async (section) => {
    setSaving(true)
    try {
      const { data } = await api.put('/admin/settings', settings)
      const s = data?.settings
      if (s?.secrets) {
        setSecrets({
          hasRazorpayKeySecret: Boolean(s.secrets?.hasRazorpayKeySecret),
          hasShiprocketPassword: Boolean(s.secrets?.hasShiprocketPassword),
          hasCloudinaryApiSecret: Boolean(s.secrets?.hasCloudinaryApiSecret),
        })
      }
      // Clear secret inputs after saving (backend stores only if non-empty)
      setSettings(prev => ({
        ...prev,
        razorpayKeySecret: '',
        shiprocketPassword: '',
        cloudinaryApiSecret: '',
      }))
      toast.success(`${section} settings saved!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Settings" subtitle="Configure your store">
      <div className="max-w-3xl space-y-6">
        {/* General */}
        <Section title="General" icon={Globe} sectionName="General" saving={saving} onSave={handleSave}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Site Name</label>
              <input className="input-field" value={settings.siteName} onChange={e => set('siteName', e.target.value)} />
            </div>
            <div>
              <label className="label">Free Shipping Threshold (₹)</label>
              <input type="number" className="input-field" value={settings.freeShippingThreshold} onChange={e => set('freeShippingThreshold', e.target.value)} />
            </div>
            <div>
              <label className="label">Shipping Charge (₹)</label>
              <input type="number" className="input-field" value={settings.shippingCharge} onChange={e => set('shippingCharge', e.target.value)} min="0" />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between glass p-4 rounded-xl border border-white/10">
              <div>
                <p className="text-slate-200 text-sm font-medium">Enable Free Shipping</p>
                <p className="text-slate-500 text-xs mt-1">If disabled, shipping charge is always applied.</p>
              </div>
              <button
                type="button"
                onClick={() => set('freeShippingEnabled', !settings.freeShippingEnabled)}
                className={`w-12 h-7 rounded-full transition-all ${settings.freeShippingEnabled ? 'bg-primary-500' : 'bg-white/10'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white mx-1 transition-transform ${settings.freeShippingEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Site Description</label>
              <textarea className="input-field resize-none h-20" value={settings.siteDescription} onChange={e => set('siteDescription', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Homepage Scrolling Offer Texts</label>
              <textarea
                className="input-field resize-none h-24"
                placeholder={'One line per message\nExample: Special Offer: Get 10% Discounts for Online Payment (Razorpay)\nExample: Special Discount Get Rs.50 Off On Order Above Rs.1000. Please Apply this Coupon Code: \"special50\"'}
                value={settings.marqueeTexts}
                onChange={e => set('marqueeTexts', e.target.value)}
              />
              <p className="text-[11px] text-slate-500 mt-1">Shown as a right-to-left scrolling banner on the homepage.</p>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Default Coupon Code (optional)</label>
              <input className="input-field font-mono" placeholder="special50" value={settings.couponCode} onChange={e => set('couponCode', e.target.value)} />
            </div>
          </div>
        </Section>

        {/* SEO */}
        <Section title="SEO" icon={Globe} sectionName="SEO" saving={saving} onSave={handleSave}>
          <div className="space-y-4">
            <div>
              <label className="label">Meta Title</label>
              <input className="input-field" value={settings.metaTitle} onChange={e => set('metaTitle', e.target.value)} />
            </div>
            <div>
              <label className="label">Meta Description</label>
              <textarea className="input-field resize-none h-20" value={settings.metaDescription} onChange={e => set('metaDescription', e.target.value)} />
            </div>
          </div>
        </Section>

        {/* Theme */}
        <Section title="Theme" icon={Palette} sectionName="Theme" saving={saving} onSave={handleSave}>
          <div>
            <label className="label">Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.primaryColor} onChange={e => set('primaryColor', e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border border-white/10" />
              <input className="input-field font-mono" value={settings.primaryColor} onChange={e => set('primaryColor', e.target.value)} />
            </div>
            <p className="text-slate-500 text-xs mt-2">Changes require a rebuild to take effect.</p>
          </div>
        </Section>

        {/* Razorpay */}
        <Section title="Razorpay" icon={Key} sectionName="Razorpay" saving={saving} onSave={handleSave}>
          <div className="glass p-3 rounded-xl mb-4">
            <p className="text-xs text-slate-400">
              🔒 Keys are stored securely on the server. Never expose your secret key in the frontend.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Key ID</label>
              <input className="input-field font-mono text-sm" placeholder="rzp_live_..." value={settings.razorpayKeyId} onChange={e => set('razorpayKeyId', e.target.value)} />
            </div>
            <div>
              <label className="label">Key Secret</label>
              <input type="password" className="input-field font-mono text-sm" placeholder="••••••••••••" value={settings.razorpayKeySecret} onChange={e => set('razorpayKeySecret', e.target.value)} />
              {secrets.hasRazorpayKeySecret && !settings.razorpayKeySecret && (
                <p className="text-[11px] text-slate-500 mt-1">A secret is already saved (leave blank to keep).</p>
              )}
            </div>
          </div>
        </Section>

        {/* Shiprocket */}
        <Section title="Shiprocket" icon={Truck} sectionName="Shiprocket" saving={saving} onSave={handleSave}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field" value={settings.shiprocketEmail} onChange={e => set('shiprocketEmail', e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input-field" placeholder="••••••••" value={settings.shiprocketPassword} onChange={e => set('shiprocketPassword', e.target.value)} />
              {secrets.hasShiprocketPassword && !settings.shiprocketPassword && (
                <p className="text-[11px] text-slate-500 mt-1">A password is already saved (leave blank to keep).</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Pickup Location</label>
              <input className="input-field" placeholder="Primary" value={settings.shiprocketPickupLocation} onChange={e => set('shiprocketPickupLocation', e.target.value)} />
              <p className="text-[11px] text-slate-500 mt-1">Must match your Shiprocket pickup location name.</p>
            </div>
          </div>
        </Section>

        {/* Cloudinary */}
        <Section title="Cloudinary" icon={Key} sectionName="Cloudinary" saving={saving} onSave={handleSave}>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Cloud Name</label>
              <input className="input-field font-mono text-sm" value={settings.cloudinaryCloudName} onChange={e => set('cloudinaryCloudName', e.target.value)} />
            </div>
            <div>
              <label className="label">API Key</label>
              <input className="input-field font-mono text-sm" value={settings.cloudinaryApiKey} onChange={e => set('cloudinaryApiKey', e.target.value)} />
            </div>
            <div>
              <label className="label">API Secret</label>
              <input type="password" className="input-field font-mono text-sm" placeholder="••••••••" value={settings.cloudinaryApiSecret} onChange={e => set('cloudinaryApiSecret', e.target.value)} />
              {secrets.hasCloudinaryApiSecret && !settings.cloudinaryApiSecret && (
                <p className="text-[11px] text-slate-500 mt-1">A secret is already saved (leave blank to keep).</p>
              )}
            </div>
          </div>
        </Section>
      </div>
    </AdminLayout>
  )
}
