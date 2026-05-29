import { useEffect, useState } from 'react'
import { Save, Key, Palette, Globe, Truck, Video, Image as ImageIcon, Trash2 } from 'lucide-react'
import AdminLayout from './AdminLayout.jsx'
import Button from '../../components/Button.jsx'
import toast from 'react-hot-toast'
import api from '../../utils/api.js'
import { uploadImage, uploadVideo, deleteAsset } from '../../utils/cloudinary.js'

function Section({ title, icon: Icon, children, sectionName, saving, onSave }) {
  return (
    <div className="glass-card1 p-6 space-y-4">
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
    heroVideoUrl: '',
    heroVideoPublicId: '',
    heroImageUrl: '',
    heroImagePublicId: '',
    heroImages: [],
    heroCards: [],
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

          heroVideoUrl: s.homepage?.heroVideo?.url ?? prev.heroVideoUrl,
          heroVideoPublicId: s.homepage?.heroVideo?.publicId ?? prev.heroVideoPublicId,
          heroImageUrl: s.homepage?.heroImage?.url ?? prev.heroImageUrl,
          heroImagePublicId: s.homepage?.heroImage?.publicId ?? prev.heroImagePublicId,
          heroImages: Array.isArray(s.homepage?.heroImages) && s.homepage.heroImages.length
            ? s.homepage.heroImages
            : (s.homepage?.heroImage?.url ? [{ url: s.homepage.heroImage.url, publicId: s.homepage?.heroImage?.publicId || '' }] : prev.heroImages),
          heroCards: Array.isArray(s.homepage?.heroCards) ? s.homepage.heroCards : prev.heroCards,

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

  const saveHeroFields = async (next) => {
    const payload = {
      heroVideoUrl: next.heroVideoUrl,
      heroVideoPublicId: next.heroVideoPublicId,
      heroImageUrl: next.heroImageUrl,
      heroImagePublicId: next.heroImagePublicId,
      heroImages: next.heroImages,
      heroCards: next.heroCards,
    }
    const { data } = await api.put('/admin/settings', payload)
    return data?.settings
  }

  const addHeroCard = async (kind, file) => {
    if (!file) return
    if ((settings.heroCards || []).length >= 14) {
      toast.error('Maximum 14 cards allowed')
      return
    }
    setSaving(true)
    try {
      const res = kind === 'video' ? await uploadVideo(file, 'hero-cards') : await uploadImage(file, 'hero-cards')
      const title = prompt('Card title (optional):', '') || ''
      const next = {
        ...settings,
        heroCards: [...(settings.heroCards || []), { kind, url: res.url, publicId: res.public_id, title }],
      }
      setSettings(next)
      await saveHeroFields(next)
      toast.success('Card added')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setSaving(false)
    }
  }

  const deleteHeroCardAt = async (idx) => {
    const card = (settings.heroCards || [])[idx]
    if (!card) return
    if (!confirm('Delete this card?')) return
    setSaving(true)
    try {
      if (card.publicId) await deleteAsset(card.publicId, card.kind === 'video' ? 'video' : 'image')
      const next = { ...settings, heroCards: (settings.heroCards || []).filter((_, i) => i !== idx) }
      setSettings(next)
      await saveHeroFields(next)
      toast.success('Card deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally {
      setSaving(false)
    }
  }

  const handleHeroVideoUpload = async (file) => {
    if (!file) return
    setSaving(true)
    try {
      const res = await uploadVideo(file, 'hero')
      const next = {
        ...settings,
        heroVideoUrl: res.url,
        heroVideoPublicId: res.public_id,
      }
      setSettings(next)
      await saveHeroFields(next)
      toast.success('Hero video updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Video upload failed')
    } finally {
      setSaving(false)
    }
  }

  const handleHeroImageUpload = async (file) => {
    if (!file) return
    setSaving(true)
    try {
      const res = await uploadImage(file, 'hero')
      const next = {
        ...settings,
        heroImageUrl: res.url,
        heroImagePublicId: res.public_id,
        heroImages: [...(settings.heroImages || []), { url: res.url, publicId: res.public_id }],
      }
      setSettings(next)
      await saveHeroFields(next)
      toast.success('Hero image added')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed')
    } finally {
      setSaving(false)
    }
  }

  const deleteHeroImageAt = async (idx) => {
    const img = (settings.heroImages || [])[idx]
    if (!img) return
    if (!confirm('Delete this hero image?')) return
    setSaving(true)
    try {
      if (img.publicId) await deleteAsset(img.publicId, 'image')
      const nextImages = (settings.heroImages || []).filter((_, i) => i !== idx)
      const next = {
        ...settings,
        heroImages: nextImages,
        heroImageUrl: nextImages[0]?.url || '',
        heroImagePublicId: nextImages[0]?.publicId || '',
      }
      setSettings(next)
      await saveHeroFields(next)
      toast.success('Hero image deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete image')
    } finally {
      setSaving(false)
    }
  }

  const deleteHeroVideo = async () => {
    if (!settings.heroVideoPublicId) return
    if (!confirm('Delete hero video?')) return
    setSaving(true)
    try {
      await deleteAsset(settings.heroVideoPublicId, 'video')
      const next = { ...settings, heroVideoUrl: '', heroVideoPublicId: '' }
      setSettings(next)
      await saveHeroFields(next)
      toast.success('Hero video deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete video')
    } finally {
      setSaving(false)
    }
  }

  const deleteHeroImage = async () => {
    if (!settings.heroImagePublicId) return
    if (!confirm('Delete hero image?')) return
    setSaving(true)
    try {
      await deleteAsset(settings.heroImagePublicId, 'image')
      const next = { ...settings, heroImageUrl: '', heroImagePublicId: '', heroImages: [] }
      setSettings(next)
      await saveHeroFields(next)
      toast.success('Hero image deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete image')
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
              <input className="input-field text-white" value={settings.siteName} onChange={e => set('siteName', e.target.value)} />
            </div>
            <div>
              <label className="label">Free Shipping Threshold (₹)</label>
              <input type="number" className="input-field text-white" value={settings.freeShippingThreshold} onChange={e => set('freeShippingThreshold', e.target.value)} />
            </div>
            <div>
              <label className="label">Shipping Charge (₹)</label>
              <input type="number" className="input-field text-white" value={settings.shippingCharge} onChange={e => set('shippingCharge', e.target.value)} min="0" />
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
              <textarea className="input-field text-white resize-none h-20" value={settings.siteDescription} onChange={e => set('siteDescription', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Homepage Scrolling Offer Texts</label>
              <textarea
                className="input-field text-white resize-none h-24"
                placeholder={'One line per message\nExample: Special Offer: Get 10% Discounts for Online Payment (Razorpay)\nExample: Special Discount Get Rs.50 Off On Order Above Rs.1000. Please Apply this Coupon Code: \"special50\"'}
                value={settings.marqueeTexts}
                onChange={e => set('marqueeTexts', e.target.value)}
              />
              <p className="text-[11px] text-slate-500 mt-1">Shown as a right-to-left scrolling banner on the homepage.</p>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Default Coupon Code (optional)</label>
              <input className="input-field text-white font-mono" placeholder="special50" value={settings.couponCode} onChange={e => set('couponCode', e.target.value)} />
            </div>
          </div>
        </Section>

        {/* Homepage Media */}
        {/* <Section title="Homepage Media" icon={Video} sectionName="Homepage Media" saving={saving} onSave={handleSave}>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-primary-400" />
                  <p className="text-slate-200 text-sm font-medium">Hero Background Video</p>
                </div>
                <button
                  type="button"
                  onClick={deleteHeroVideo}
                  className="btn-ghost py-1.5 px-2.5 text-xs text-red-400 hover:text-red-300"
                  disabled={saving || !settings.heroVideoPublicId}
                  title="Delete video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {settings.heroVideoUrl ? (
                <video src={settings.heroVideoUrl} className="mt-3 w-full rounded-xl border border-white/10" controls />
              ) : (
                <p className="text-slate-500 text-xs mt-3">No hero video uploaded.</p>
              )}
              <label className="mt-3 inline-flex items-center gap-2 btn-secondary cursor-pointer">
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleHeroVideoUpload(e.target.files?.[0])}
                  disabled={saving}
                />
              </label>
              <p className="text-[11px] text-slate-500 mt-2">Upload a small MP4 for best performance.</p>
            </div>

            <div className="glass p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary-400" />
                  <p className="text-slate-200 text-sm font-medium">Hero Images (Slider)</p>
                </div>
                <button
                  type="button"
                  onClick={deleteHeroImage}
                  className="btn-ghost py-1.5 px-2.5 text-xs text-red-400 hover:text-red-300"
                  disabled={saving || !settings.heroImagePublicId}
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {settings.heroImages?.length ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {settings.heroImages.slice(0, 4).map((img, i) => (
                    <div key={img.publicId || img.url || i} className="relative rounded-xl overflow-hidden border border-white/10">
                      <img src={img.url} alt="" className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => deleteHeroImageAt(i)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center"
                        title="Delete"
                        disabled={saving}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  ))}
                  {settings.heroImages.length > 4 && (
                    <div className="flex items-center justify-center h-24 rounded-xl glass border border-white/10 text-slate-400 text-xs">
                      +{settings.heroImages.length - 4} more
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-xs mt-3">No hero image uploaded.</p>
              )}
              <label className="mt-3 inline-flex items-center gap-2 btn-secondary cursor-pointer">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleHeroImageUpload(e.target.files?.[0])}
                  disabled={saving}
                />
              </label>
              <p className="text-[11px] text-slate-500 mt-2">Upload multiple images to show as a slider on the homepage hero background.</p>
            </div>
          </div>
        </Section> */}

        {/* Homepage Hero Cards */}
        <Section title="Homepage Hero Cards" icon={ImageIcon} sectionName="Homepage Hero Cards" saving={saving} onSave={handleSave}>
          <div className="glass p-4 rounded-xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-slate-200 text-sm font-medium">Carousel cards (max 14)</p>
                <p className="text-[11px] text-slate-500 mt-1">Shown on the homepage as a 3-card carousel under the hero.</p>
              </div>
              <div className="flex gap-2">
                <label className={`btn-secondary cursor-pointer ${saving || (settings.heroCards || []).length >= 14 ? 'opacity-50 pointer-events-none' : ''}`}>
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => addHeroCard('image', e.target.files?.[0])} disabled={saving} />
                </label>
                <label className={`btn-secondary cursor-pointer ${saving || (settings.heroCards || []).length >= 14 ? 'opacity-50 pointer-events-none' : ''}`}>
                  Upload Video
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => addHeroCard('video', e.target.files?.[0])} disabled={saving} />
                </label>
              </div>
            </div>

            {(settings.heroCards || []).length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {settings.heroCards.map((c, i) => (
                  <div key={c.publicId || c.url || i} className="relative rounded-xl overflow-hidden border border-white/10 bg-dark-900/30">
                    {c.kind === 'video' ? (
                      <video src={c.url} className="w-full h-24 object-cover" muted playsInline />
                    ) : (
                      <img src={c.url} alt="" className="w-full h-24 object-cover" />
                    )}
                    <div className="p-2">
                      <div className="text-xs text-slate-200 line-clamp-1">{c.title || (c.kind === 'video' ? 'Video' : 'Image')}</div>
                      <div className="text-[11px] text-slate-500">{c.kind}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteHeroCardAt(i)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center"
                      title="Delete"
                      disabled={saving}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No cards uploaded yet.</p>
            )}
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
        {/* <Section title="Theme" icon={Palette} sectionName="Theme" saving={saving} onSave={handleSave}>
          <div>
            <label className="label">Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.primaryColor} onChange={e => set('primaryColor', e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border border-white/10" />
              <input className="input-field font-mono" value={settings.primaryColor} onChange={e => set('primaryColor', e.target.value)} />
            </div>
            <p className="text-slate-500 text-xs mt-2">Changes require a rebuild to take effect.</p>
          </div>
        </Section> */}

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
