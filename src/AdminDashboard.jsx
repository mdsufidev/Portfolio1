import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const ADMIN_EMAIL = 'sufi111729@gmail.com'

export default function AdminDashboard() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [credentials, setCredentials] = useState({ email: ADMIN_EMAIL, password: '' })

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => { if (session) loadMessages() }, [session])

  async function login(event) {
    event.preventDefault(); setError(''); setLoading(true)
    const { error: loginError } = await supabase.auth.signInWithPassword(credentials)
    if (loginError) setError(loginError.message === 'Invalid login credentials' ? 'Admin user ya password match nahi hua. Supabase Authentication → Users mein user create/verify karein.' : loginError.message)
    setLoading(false)
  }

  async function loadMessages() {
    setLoading(true); setError('')
    const { data, error: loadError } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (loadError) setError(loadError.message); else setMessages(data || [])
    setLoading(false)
  }

  async function setStatus(id, status) {
    const { error: updateError } = await supabase.from('contact_messages').update({ status }).eq('id', id)
    if (updateError) setError(updateError.message)
    else setMessages(current => current.map(message => message.id === id ? { ...message, status } : message))
  }

  const counts = useMemo(() => ({ total: messages.length, unread: messages.filter(m => m.status === 'new').length, replied: messages.filter(m => m.status === 'replied').length }), [messages])

  if (!isSupabaseConfigured) return <main className="admin-shell"><div className="admin-notice"><span>Configuration required</span><h1>Supabase URL missing.</h1><p>Replace the placeholder value in <code>.env</code>, then restart the Vite server.</p><a href="/">← Back to portfolio</a></div></main>
  if (loading && !session) return <main className="admin-shell admin-loading">Loading workspace…</main>
  if (!session) return <main className="admin-shell"><form className="admin-login" onSubmit={login}><span>Private workspace / Sufi</span><h1>Welcome back.</h1><p>Sign in to view portfolio enquiries.</p><label>Email<input type="email" value={credentials.email} onChange={e => setCredentials({...credentials,email:e.target.value})}/></label><label>Password<input type="password" value={credentials.password} onChange={e => setCredentials({...credentials,password:e.target.value})} required/></label>{error && <p className="admin-error">{error}</p>}<button disabled={loading}>{loading ? 'Signing in…' : 'Enter dashboard →'}</button><a href="/">← Return to portfolio</a></form></main>

  return <main className="admin-page"><header><div><span>MS / PRIVATE</span><h1>Enquiry desk.</h1></div><div className="admin-actions"><button onClick={loadMessages}>Refresh ↻</button><button onClick={() => supabase.auth.signOut()}>Sign out ↗</button></div></header><section className="admin-stats"><div><span>Total messages</span><b>{counts.total}</b></div><div><span>Needs attention</span><b>{counts.unread}</b></div><div><span>Replied</span><b>{counts.replied}</b></div></section>{error && <p className="admin-error admin-wide">{error}</p>}<section className="message-list">{loading ? <p>Loading messages…</p> : messages.length === 0 ? <div className="empty-state"><span>Inbox zero</span><h2>No enquiries yet.</h2><p>New portfolio messages will appear here.</p></div> : messages.map(message => <article className={message.status === 'new' ? 'is-new' : ''} key={message.id}><div className="message-meta"><span>{new Date(message.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span><i>{message.status}</i></div><h2>{message.name}</h2><a href={`mailto:${message.email}`}>{message.email}</a><b>{message.project_type}</b><p>{message.message}</p><div className="message-controls"><button onClick={()=>setStatus(message.id,'read')}>Mark read</button><button onClick={()=>setStatus(message.id,'replied')}>Replied</button><button onClick={()=>setStatus(message.id,'archived')}>Archive</button></div></article>)}</section></main>
}
