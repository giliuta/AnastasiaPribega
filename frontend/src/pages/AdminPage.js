import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Users, Settings, LogOut, Trash2, Check, 
  Phone, Calendar, Send, RefreshCw, Edit3, Save, X, Image, Upload
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const MEDIA_BASE = 'https://customer-assets.emergentagent.com/job_arch-beauty-lab/artifacts/';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/admin/login`, {}, { auth: { username, password } });
      localStorage.setItem('adminAuth', btoa(`${username}:${password}`));
      onLogin();
    } catch (err) {
      setError('Неверный логин или пароль');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-pribega-bg flex items-center justify-center px-6">
      <motion.div className="w-full max-w-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-3xl font-light text-pribega-text text-center mb-2">PRIBEGA</h1>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-pribega-text-secondary text-center mb-10">Admin Panel</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">Логин</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-pribega-surface border border-pribega-border px-4 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none" />
          </div>
          <div>
            <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">Пароль</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-pribega-surface border border-pribega-border px-4 py-3 font-body text-sm text-pribega-text focus:border-pribega-accent focus:outline-none" />
          </div>
          {error && <p className="font-body text-xs text-red-500 text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-pribega-text text-pribega-bg py-3 font-body text-[10px] uppercase tracking-[0.25em] hover:bg-pribega-accent transition-colors duration-300 disabled:opacity-50">
            {loading ? '...' : 'Войти'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('contacts');
  const [stats, setStats] = useState({ total_contacts: 0, new_contacts: 0 });
  const [contacts, setContacts] = useState([]);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState({ chat_id: '' });
  const [media, setMedia] = useState({ portfolio: [], instagram: [] });
  const [loading, setLoading] = useState(true);
  const [editingServices, setEditingServices] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getAuthHeader = () => {
    const auth = localStorage.getItem('adminAuth');
    return { Authorization: `Basic ${auth}` };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, contactsRes, servicesRes, settingsRes, mediaRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/contacts`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/services`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/settings`, { headers: getAuthHeader() }),
        axios.get(`${API}/admin/media`, { headers: getAuthHeader() }),
      ]);
      setStats(statsRes.data);
      setContacts(contactsRes.data);
      setServices(servicesRes.data);
      setSettings(settingsRes.data);
      setMedia(mediaRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminAuth');
        onLogout();
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateContactStatus = async (id, status) => {
    await axios.patch(`${API}/admin/contacts/${id}?status=${status}`, {}, { headers: getAuthHeader() });
    setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Удалить эту заявку?')) return;
    await axios.delete(`${API}/admin/contacts/${id}`, { headers: getAuthHeader() });
    setContacts(contacts.filter(c => c.id !== id));
  };

  const saveSettings = async () => {
    await axios.put(`${API}/admin/settings`, { telegram_chat_id: settings.chat_id }, { headers: getAuthHeader() });
    alert('Настройки сохранены');
  };

  const testTelegram = async () => {
    const res = await axios.post(`${API}/admin/test-telegram`, {}, { headers: getAuthHeader() });
    alert(res.data.success ? 'Сообщение отправлено!' : 'Ошибка отправки');
  };

  const saveServices = async () => {
    await axios.put(`${API}/admin/services`, services, { headers: getAuthHeader() });
    setEditingServices(false);
    alert('Услуги сохранены');
  };

  const updateServiceItem = (catIndex, itemIndex, field, value) => {
    const newServices = [...services];
    newServices[catIndex].items[itemIndex][field] = value;
    setServices(newServices);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !editingPhoto) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await axios.post(`${API}/admin/upload`, formData, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
      });
      
      const filename = uploadRes.data.filename;
      const { type, position } = editingPhoto;
      
      // Update the photo
      await axios.put(
        `${API}/admin/media/${type}/${position}?src=${encodeURIComponent(filename)}`,
        {},
        { headers: getAuthHeader() }
      );
      
      // Update local state
      const newMedia = { ...media };
      newMedia[type][position].src = filename;
      setMedia(newMedia);
      
      setEditingPhoto(null);
      alert('Фото обновлено! Обновите страницу сайта.');
    } catch (err) {
      alert('Ошибка загрузки: ' + (err.response?.data?.detail || err.message));
    }
    setUploading(false);
  };

  const getPhotoUrl = (src) => {
    if (src.startsWith('http')) return src;
    if (src.includes('/')) return `${API}/${src}`;
    return `${MEDIA_BASE}${src}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const tabs = [
    { id: 'contacts', label: 'Заявки', icon: Users },
    { id: 'media', label: 'Фото', icon: Image },
    { id: 'services', label: 'Услуги', icon: Edit3 },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-pribega-bg">
      <header className="bg-pribega-surface border-b border-pribega-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-heading text-xl font-light text-pribega-text">PRIBEGA</h1>
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-pribega-text-secondary">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchData} className="p-2 text-pribega-text-secondary hover:text-pribega-accent transition-colors">
              <RefreshCw size={16} />
            </button>
            <button onClick={onLogout} className="p-2 text-pribega-text-secondary hover:text-red-500 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-pribega-surface border border-pribega-border p-6">
            <p className="font-heading text-3xl font-light text-pribega-text">{stats.total_contacts}</p>
            <p className="font-body text-[10px] uppercase tracking-[0.15em] text-pribega-text-secondary mt-1">Всего заявок</p>
          </div>
          <div className="bg-pribega-surface border border-pribega-border p-6">
            <p className="font-heading text-3xl font-light text-pribega-accent">{stats.new_contacts}</p>
            <p className="font-body text-[10px] uppercase tracking-[0.15em] text-pribega-text-secondary mt-1">Новых</p>
          </div>
        </div>

        <div className="flex gap-1 mb-6 border-b border-pribega-border">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-body text-xs uppercase tracking-[0.15em] transition-colors border-b-2 -mb-px ${
                activeTab === tab.id ? 'text-pribega-accent border-pribega-accent' : 'text-pribega-text-secondary border-transparent hover:text-pribega-text'
              }`}>
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-6 h-6 border-2 border-pribega-accent border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <>
            {/* CONTACTS TAB */}
            {activeTab === 'contacts' && (
              <div className="space-y-3">
                {contacts.length === 0 ? (
                  <p className="text-center py-10 font-body text-sm text-pribega-text-secondary">Нет заявок</p>
                ) : contacts.map(contact => (
                  <div key={contact.id} className={`bg-pribega-surface border p-4 flex items-center gap-4 ${contact.status === 'new' ? 'border-pribega-accent' : 'border-pribega-border'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-heading text-base font-light text-pribega-text">{contact.name}</p>
                        {contact.status === 'new' && (
                          <span className="px-2 py-0.5 bg-pribega-accent/10 text-pribega-accent font-body text-[9px] uppercase">Новая</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-1 font-body text-sm text-pribega-text hover:text-pribega-accent">
                          <Phone size={12} />{contact.phone}
                        </a>
                        <span className="flex items-center gap-1 font-body text-xs text-pribega-text-secondary">
                          <Calendar size={12} />{formatDate(contact.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {contact.status === 'new' && (
                        <button onClick={() => updateContactStatus(contact.id, 'processed')} className="p-2 text-green-600 hover:bg-green-50 rounded">
                          <Check size={16} />
                        </button>
                      )}
                      <button onClick={() => deleteContact(contact.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MEDIA TAB */}
            {activeTab === 'media' && (
              <div className="space-y-8">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
                
                {/* Instagram */}
                <div className="bg-pribega-surface border border-pribega-border p-6">
                  <h3 className="font-heading text-lg font-light text-pribega-text mb-2">Instagram (8 фото)</h3>
                  <p className="font-body text-xs text-pribega-text-secondary mb-4">Нажмите на фото чтобы заменить</p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {media.instagram.map((item, i) => (
                      <div key={i} className="relative group cursor-pointer" onClick={() => { setEditingPhoto({ type: 'instagram', position: i }); fileInputRef.current?.click(); }}>
                        <img src={getPhotoUrl(item.src)} alt="" className="w-full aspect-square object-cover hover:opacity-70 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                          <Upload size={20} className="text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">{i+1}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Portfolio */}
                <div className="bg-pribega-surface border border-pribega-border p-6">
                  <h3 className="font-heading text-lg font-light text-pribega-text mb-2">Портфолио ({media.portfolio.length} фото/видео)</h3>
                  <p className="font-body text-xs text-pribega-text-secondary mb-4">Нажмите на фото чтобы заменить</p>
                  <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                    {media.portfolio.map((item, i) => (
                      <div key={i} className="relative group cursor-pointer" onClick={() => { if(item.type === 'img') { setEditingPhoto({ type: 'portfolio', position: i }); fileInputRef.current?.click(); }}}>
                        {item.type === 'img' ? (
                          <>
                            <img src={getPhotoUrl(item.src)} alt="" className="w-full aspect-square object-cover hover:opacity-70 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                              <Upload size={16} className="text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full aspect-square bg-pribega-bg flex items-center justify-center text-pribega-text-secondary text-[10px]">VIDEO</div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">{i+1}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {uploading && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-pribega-accent border-t-transparent rounded-full mx-auto mb-4" />
                      <p>Загрузка...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  {editingServices ? (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingServices(false)} className="px-4 py-2 border border-pribega-border font-body text-xs uppercase">
                        <X size={14} className="inline mr-1" />Отмена
                      </button>
                      <button onClick={saveServices} className="px-4 py-2 bg-pribega-accent text-white font-body text-xs uppercase">
                        <Save size={14} className="inline mr-1" />Сохранить
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setEditingServices(true)} className="px-4 py-2 border border-pribega-border font-body text-xs uppercase hover:border-pribega-accent">
                      <Edit3 size={14} className="inline mr-1" />Редактировать
                    </button>
                  )}
                </div>
                {services.map((cat, ci) => (
                  <div key={cat.id} className="bg-pribega-surface border border-pribega-border p-6">
                    <h3 className="font-heading text-lg font-light text-pribega-text mb-4">{cat.title_ru}</h3>
                    <div className="space-y-3">
                      {cat.items.map((item, ii) => (
                        <div key={ii} className="flex items-center gap-4 py-2 border-b border-pribega-border last:border-0">
                          {editingServices ? (
                            <>
                              <input type="text" value={item.name} onChange={(e) => updateServiceItem(ci, ii, 'name', e.target.value)}
                                className="flex-1 bg-pribega-bg border border-pribega-border px-3 py-2 font-body text-sm" />
                              <input type="text" value={item.price} onChange={(e) => updateServiceItem(ci, ii, 'price', e.target.value)}
                                className="w-24 bg-pribega-bg border border-pribega-border px-3 py-2 font-body text-sm text-right" />
                            </>
                          ) : (
                            <>
                              <span className="flex-1 font-body text-sm text-pribega-text">{item.name}</span>
                              <span className="font-heading text-base text-pribega-text">{item.price}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-lg">
                <div className="bg-pribega-surface border border-pribega-border p-6">
                  <h3 className="font-heading text-lg font-light text-pribega-text mb-4">Telegram уведомления</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="font-body text-[10px] uppercase tracking-[0.2em] text-pribega-text-secondary block mb-2">Chat ID</label>
                      <input type="text" value={settings.chat_id || ''} onChange={(e) => setSettings({ ...settings, chat_id: e.target.value })}
                        placeholder="-1001234567890"
                        className="w-full bg-pribega-bg border border-pribega-border px-4 py-3 font-body text-sm" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={saveSettings} className="px-6 py-3 bg-pribega-text text-pribega-bg font-body text-[10px] uppercase">Сохранить</button>
                      <button onClick={testTelegram} className="px-6 py-3 border border-pribega-border font-body text-[10px] uppercase">
                        <Send size={12} className="inline mr-1" />Тест
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('adminAuth')) setIsLoggedIn(true);
  }, []);

  if (!isLoggedIn) return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  return <Dashboard onLogout={() => { localStorage.removeItem('adminAuth'); setIsLoggedIn(false); }} />;
}
