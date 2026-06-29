import { useState } from 'react'
import { toast } from 'sonner'
import { Save, User, Lock, Bell, Mail, Smartphone, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function SettingsPage() {
  const { user } = useAuth()
  
  // Profile State
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [email, setEmail] = useState(user?.email || '')
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Notification State
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)

  // Loading States
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingSecurity, setIsSavingSecurity] = useState(false)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    // Mock API call
    setTimeout(() => {
      setIsSavingProfile(false)
      toast.success('Profile updated successfully')
    }, 1000)
  }

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setIsSavingSecurity(true)
    // Mock API call
    setTimeout(() => {
      setIsSavingSecurity(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password changed successfully')
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setIsSavingNotifications(true)
    // Mock API call
    setTimeout(() => {
      setIsSavingNotifications(false)
      toast.success('Notification preferences saved')
    }, 800)
  }

  return (
    <>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-[#e8f4f4] mb-1">
          Settings & Preferences
        </h1>
        <p className="text-sm text-[#6b9090]">
          Manage your personal profile, security credentials, and system notifications.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Security */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Profile Section */}
          <section className="bg-[#132020] border border-[#1f3333] rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1f3333] flex items-center gap-3 bg-[#0f1a1a]">
              <div className="p-2 bg-[#1a2a2a] rounded-md text-[#00c896]">
                <User size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#e8f4f4]">Personal Profile</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6b9090] mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#0f1a1a] border border-[#1f3333] rounded-lg px-4 py-2 text-sm text-[#e8f4f4] focus:outline-none focus:border-[#00c896] focus:ring-1 focus:ring-[#00c896] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6b9090] mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#0f1a1a] border border-[#1f3333] rounded-lg px-4 py-2 text-sm text-[#e8f4f4] focus:outline-none focus:border-[#00c896] focus:ring-1 focus:ring-[#00c896] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6b9090] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0f1a1a] border border-[#1f3333] rounded-lg px-4 py-2 text-sm text-[#e8f4f4] focus:outline-none focus:border-[#00c896] focus:ring-1 focus:ring-[#00c896] transition-all"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a2a2a] text-[#00c896] border border-[#1f3333] hover:border-[#00c896] rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    {isSavingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-[#132020] border border-[#1f3333] rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1f3333] flex items-center gap-3 bg-[#0f1a1a]">
              <div className="p-2 bg-[#2a0a0a] rounded-md text-[#ef4444]">
                <ShieldCheck size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#e8f4f4]">Security & Password</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveSecurity} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#6b9090] mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-[#0f1a1a] border border-[#1f3333] rounded-lg px-4 py-2 text-sm text-[#e8f4f4] focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#6b9090] mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-[#0f1a1a] border border-[#1f3333] rounded-lg px-4 py-2 text-sm text-[#e8f4f4] focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#6b9090] mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-[#0f1a1a] border border-[#1f3333] rounded-lg px-4 py-2 text-sm text-[#e8f4f4] focus:outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444] transition-all"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingSecurity}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2a0a0a] text-[#ef4444] border border-[#4a1a1a] hover:bg-[#4a1a1a] rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    <Lock size={16} />
                    {isSavingSecurity ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </section>

        </div>

        {/* Right Column: Notifications */}
        <div className="lg:col-span-1">
          <section className="bg-[#132020] border border-[#1f3333] rounded-lg overflow-hidden sticky top-8">
            <div className="px-6 py-4 border-b border-[#1f3333] flex items-center gap-3 bg-[#0f1a1a]">
              <div className="p-2 bg-[#0a1a3a] rounded-md text-[#4a9eff]">
                <Bell size={18} />
              </div>
              <h2 className="text-base font-semibold text-[#e8f4f4]">Notifications</h2>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Toggle Items */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[#6b9090]" />
                  <div>
                    <p className="text-sm font-medium text-[#e8f4f4]">Email Alerts</p>
                    <p className="text-xs text-[#6b9090]">Daily digests and urgent updates</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
                  <div className="w-9 h-5 bg-[#1f3333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#e8f4f4] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4a9eff]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-[#6b9090]" />
                  <div>
                    <p className="text-sm font-medium text-[#e8f4f4]">SMS Alerts</p>
                    <p className="text-xs text-[#6b9090]">Critical platform incidents only</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} />
                  <div className="w-9 h-5 bg-[#1f3333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#e8f4f4] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4a9eff]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-[#6b9090]" />
                  <div>
                    <p className="text-sm font-medium text-[#e8f4f4]">Push Notifications</p>
                    <p className="text-xs text-[#6b9090]">New disputes and verifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={pushNotifications} onChange={(e) => setPushNotifications(e.target.checked)} />
                  <div className="w-9 h-5 bg-[#1f3333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#e8f4f4] after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4a9eff]"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-[#1f3333]">
                <button
                  onClick={handleSaveNotifications}
                  disabled={isSavingNotifications}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0a1a3a] text-[#4a9eff] border border-[#1a3a6a] hover:bg-[#1a3a6a] rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {isSavingNotifications ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>

            </div>
          </section>
        </div>

      </div>
    </>
  )
}
