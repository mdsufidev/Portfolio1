import { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const skills = [
  ['Backend Development', 'Java, Spring Boot, Spring MVC, JDBC, RESTful APIs'],
  ['Data & Persistence', 'MySQL, SQL, Hibernate, JPA, relational database design'],
  ['Engineering Practices', 'OOP, collections, validation, exception handling, data structures'],
  ['Tools & Workflow', 'Maven, Git, GitHub, Postman, IntelliJ IDEA, Eclipse'],
]

const education = [
  ['2026', 'Java Full Stack Development', 'JSpiders · Basavanagudi, Bengaluru'],
  ['2021—2024', 'B.Tech, Computer Science & Engineering', 'Technocrats Institute of Technology · CGPA 7.41/10'],
  ['2021', 'Diploma, Computer Science & Engineering', 'Mangalam School of Management Technology · CGPA 7.10/10'],
]

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="topbar">
    <a className="brand brand-logo" href="#home" aria-label="Muhammad Sufiyan home"><img src="/assets/ms-navbar-logo.png" alt="Muhammad Sufiyan MS monogram"/></a>
    <button className={`menu-toggle ${open ? 'open' : ''}`} aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}><span/><span/></button>
    <nav className={`nav ${open ? 'nav-open' : ''}`} aria-label="Primary navigation">
      {['about','work','skills','contact'].map(item => <a key={item} onClick={() => setOpen(false)} href={`#${item}`}>{item[0].toUpperCase()+item.slice(1)}</a>)}
    </nav>
    <a className="top-contact" href="https://wa.me/916306556033?text=Hi%20Muhammad%20Sufiyan%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect." target="_blank" rel="noreferrer" aria-label="Chat with Muhammad Sufiyan on WhatsApp">Let's talk <span>↗</span></a>
  </header>
}

function Project({ dark = false }) {
  return <article className={`project ${dark ? 'project-dark' : 'project-yellow'} reveal`}>
    <div className="project-number">0{dark ? 2 : 1}</div>
    <div className="project-info">
      <p>{dark ? 'Java backend development · 2024—2025' : 'Backend engineering project · 2026—Present'}</p>
      <h3>{dark ? <>Employee<br/>Management</> : 'GetKiver'}</h3>
      <p>{dark ? 'A complete employee record management API with robust validation, pagination, sorting, and centralized exception handling.' : 'A service-provider discovery API connecting customers with local businesses through structured categories, locations, and availability.'}</p>
      <ul>{(dark ? ['Spring Data JPA','REST APIs','Postman'] : ['Java & Spring Boot','Hibernate / JPA','MySQL']).map(x => <li key={x}>{x}</li>)}</ul>
      <a href="https://github.com/mdsufidev" target="_blank" rel="noreferrer">View on GitHub ↗</a>
    </div>
    {dark ? <div className="project-art dashboard"><div className="dash-top"><span>EMPLOYEE / DIRECTORY</span><b>+ Add employee</b></div><div className="stat-row"><i>248<small>Employees</small></i><i>18<small>Departments</small></i><i>96%<small>Active</small></i></div><div className="rows"><span><b>MS</b> Maya Singh <i>Engineering</i></span><span><b>AK</b> Aman Khan <i>Product</i></span><span><b>RP</b> Riya Patel <i>Design</i></span></div></div>
      : <div className="project-art"><div className="api-window"><div><i/><i/><i/><span>GET /api/providers</span></div><pre><code>{`{\n  `}<b>"service"</b>{`: "Home Repair",\n  `}<b>"location"</b>{`: "New Delhi",\n  `}<b>"available"</b>{`: true,\n  `}<b>"rating"</b>{`: 4.8\n}`}</code></pre></div></div>}
  </article>
}

function ContactForm() {
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState({ name: '', email: '', project: 'Backend API', message: '' })
  const update = ({ target }) => { setForm(current => ({ ...current, [target.name]: target.value })); setStatus('idle') }
  const submit = async event => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.includes('@') || !form.message.trim()) return setStatus('error')
    if (!isSupabaseConfigured) return setStatus('config')
    setStatus('sending')
    const { error } = await supabase.from('contact_messages').insert({ name: form.name.trim(), email: form.email.trim(), project_type: form.project, message: form.message.trim() })
    if (error) return setStatus('error')
    setForm({ name: '', email: '', project: 'Backend API', message: '' }); setStatus('success')
  }
  return <form className="contact-form" onSubmit={submit} noValidate>
    <div className="form-row">
      <label><span>01 / Your name</span><input name="name" value={form.name} onChange={update} placeholder="What should I call you?" autoComplete="name"/></label>
      <label><span>02 / Email address</span><input name="email" type="email" value={form.email} onChange={update} placeholder="you@company.com" autoComplete="email"/></label>
    </div>
    <label className="select-field"><span>03 / What can I help with?</span><select name="project" value={form.project} onChange={update}><option>Backend API</option><option>Java application</option><option>Full-stack project</option><option>Job opportunity</option><option>Something else</option></select></label>
    <label><span>04 / Tell me about it</span><textarea name="message" value={form.message} onChange={update} placeholder="A few details about your idea, timeline, or opportunity..." rows="4"/></label>
    <div className="form-footer"><p className={status} aria-live="polite">{status === 'error' ? 'Could not send. Check the fields and try again.' : status === 'config' ? 'Supabase Project URL needs to be configured.' : status === 'success' ? 'Thank you — your message has been received.' : 'I usually reply within 24–48 hours.'}</p><button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send enquiry'} <span>↗</span></button></div>
  </form>
}

const botReply = message => {
  const text = message.toLowerCase()
  if (text.includes('skill') || text.includes('tech')) return 'Muhammad works with Java, Spring Boot, REST APIs, Hibernate/JPA, MySQL, Maven, Git and Postman.'
  if (text.includes('project') || text.includes('work')) return 'His featured backend projects are GetKiver and Employee Management. You can explore both in the Projects section.'
  if (text.includes('resume') || text.includes('cv')) return 'You can download Muhammad’s resume from the Download Resume button in the hero section.'
  if (text.includes('contact') || text.includes('email') || text.includes('hire')) return 'You can use the Contact form or email Muhammad at sufi111729@gmail.com. He usually replies within 24–48 hours.'
  if (text.includes('available') || text.includes('location')) return 'Muhammad is based in New Delhi, India and is available for Java backend opportunities.'
  if (text.includes('github')) return 'You can view his code at github.com/mdsufidev.'
  if (text.includes('linkedin')) return 'You can connect with Muhammad at linkedin.com/in/mdsufidev.'
  return 'I’m Muhammad’s developer copilot. Once Groq is connected, we can explore Java, Spring Boot, API architecture, project ideas, interviews, careers, or anything else you’re curious about. For now, ask me about his portfolio, skills, projects or contact details.'
}

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! I’m SufiBot—Muhammad’s developer copilot. Let’s talk portfolio, Java, backend architecture, project ideas, interviews, or anything tech.' }])
  const send = async event => {
    event.preventDefault()
    const message = input.trim()
    if (!message || loading) return
    const nextMessages = [...messages, { from: 'user', text: message }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    let reply = botReply(message)
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.functions.invoke('portfolio-chat', { body: { messages: nextMessages } })
      if (!error && data?.reply) reply = data.reply
    }
    setMessages(current => [...current, { from: 'bot', text: reply }])
    setLoading(false)
  }
  return <aside className={`chatbot ${open ? 'is-open' : ''}`}>
    {open && <div className="chat-panel" role="dialog" aria-label="Portfolio chatbot">
      <header><div><b>SufiBot</b><span><i/> Online</span></div><button onClick={() => setOpen(false)} aria-label="Close chat">×</button></header>
      <div className="chat-messages" aria-live="polite">{messages.map((message, index) => <p className={message.from} key={`${message.from}-${index}`}>{message.text}</p>)}{loading && <p className="bot typing">Thinking…</p>}</div>
      <form onSubmit={send}><input value={input} onChange={event => setInput(event.target.value)} placeholder="Ask me something…" aria-label="Chat message" disabled={loading}/><button type="submit" aria-label="Send message" disabled={loading}>→</button></form>
    </div>}
    <button className="chat-toggle" onClick={() => setOpen(current => !current)} aria-label={open ? 'Close chatbot' : 'Open chatbot'}>{open ? '×' : <><span>&lt;/&gt;</span> Chat</>}</button>
  </aside>
}

export default function App() {
  if (window.location.pathname === '/sufi' || window.location.pathname === '/sufi/') return <AdminDashboard />
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target) } }), {threshold:.12})
    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return <><Header/><main>
    <section className="hero" id="home">
      <div className="hero-copy"><div className="hero-copy-inner"><p className="eyebrow"><span/> Java Backend Developer</p><h1>Building scalable backend systems<br/><em>using Java, Spring Boot<br/>and REST APIs.</em></h1><p className="hero-name">Muhammad Sufiyan</p><div className="hero-actions"><a className="button button-dark" href="/assets/Java-Backend-Developer%20Muhamd%20Sufiyan.pdf" download="Muhammad-Sufiyan-Java-Backend-Developer-Resume.pdf">Download Resume <span>↓</span></a><a className="button button-light" href="#work">View Projects <span>↘</span></a></div><div className="hero-links"><a href="#contact">Contact Me →</a><a href="https://github.com/mdsufidev" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://linkedin.com/in/mdsufidev" target="_blank" rel="noreferrer">LinkedIn ↗</a></div><div className="availability"><i/><span>Available for opportunities<br/><b>New Delhi, India</b></span></div></div></div>
      <div className="hero-visual"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><img src="/assets/muhammad-sufiyan-portrait.png" alt="Professional portrait representing Muhammad Sufiyan"/><div className="code-pill">&lt;/&gt; <span>Clean code.<br/>Real impact.</span></div><p className="vertical-label">JAVA · SPRING BOOT · REST APIs</p></div>
      <svg className="wave" viewBox="0 0 180 900" preserveAspectRatio="none" aria-hidden="true"><path d="M180 0H0C104 140 9 273 73 420c70 160 84 240 20 480h87V0Z"/></svg>
    </section>
    <section className="marquee" aria-label="Core technologies"><div>JAVA <i>✦</i> SPRING BOOT <i>✦</i> REST APIs <i>✦</i> MYSQL <i>✦</i> HIBERNATE / JPA <i>✦</i> CLEAN CODE <i>✦</i></div></section>
    <section className="about section" id="about"><div><p className="section-kicker">01 / About me</p><h2>Backend thinking.<br/><em>Product focus.</em></h2></div><div className="about-copy reveal"><p className="lead">I’m a Java developer who cares about what happens beneath the interface—the architecture, data flow, and small decisions that make software dependable.</p><p>My work centers on Spring Boot, Hibernate/JPA, SQL, and MySQL. I enjoy designing REST APIs, modeling relational data, and building validation and exception-handling layers that keep applications predictable.</p><a className="text-link" href="mailto:sufi111729@gmail.com">More about me <span>→</span></a></div></section>
    <section className="work section" id="work"><div className="section-heading reveal"><div><p className="section-kicker">02 / Selected work</p><h2>Projects built to<br/><em>work in the real world.</em></h2></div><p>Two backend systems, thoughtfully designed from database to endpoint.</p></div><Project/><Project dark/></section>
    <section className="skills section" id="skills"><div><p className="section-kicker">03 / Expertise</p><h2>The toolkit behind<br/><em>the build.</em></h2></div><div className="skill-list">{skills.map((skill,i)=><div className="reveal" key={skill[0]}><span>0{i+1}</span><h3>{skill[0]}</h3><p>{skill[1]}</p></div>)}</div></section>
    <section className="education section"><p className="section-kicker">04 / Background</p><div className="timeline">{education.map(item=><div className="reveal" key={item[0]}><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></div>)}</div></section>
    <section className="contact" id="contact"><div className="contact-intro"><p className="section-kicker">05 / Get in touch</p><h2>Have a project in mind?<br/><em>Let’s build it right.</em></h2><p>Whether it’s a backend API, a Java application, or a new opportunity—tell me what you’re working on.</p></div><ContactForm/><div className="direct-contact"><span>Prefer to write directly?</span><a className="email" href="mailto:sufi111729@gmail.com">sufi111729@gmail.com <b>↗</b></a></div><div className="contact-bottom"><p>New Delhi, India<br/><a href="tel:+916306556033">+91 63065 56033</a></p><div><a href="https://linkedin.com/in/mdsufidev">LinkedIn ↗</a><a href="https://github.com/mdsufidev">GitHub ↗</a><a href="https://muhammadsufiyan.com">Website ↗</a></div></div></section>
  </main><footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a href="#home"><img src="/assets/ms-navbar-logo.png" alt="Muhammad Sufiyan MS monogram"/></a><div><h3>Muhammad Sufiyan</h3><p>Java developer building dependable<br/>backend experiences.</p></div></div><div className="footer-links"><span>Explore</span><a href="#about">About</a><a href="#work">Work</a><a href="#skills">Skills</a><a href="#contact">Contact</a></div><div className="footer-connect"><span>Start a conversation</span><h3>Let’s create something<br/><em>meaningful.</em></h3><a href="https://wa.me/916306556033?text=Hi%20Muhammad%20Sufiyan%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect." target="_blank" rel="noreferrer">Chat on WhatsApp <b>↗</b></a></div></div><div className="footer-bottom"><p>© 2026 Muhammad Sufiyan. All rights reserved.</p><div><a href="https://linkedin.com/in/mdsufidev">LinkedIn ↗</a><a href="https://github.com/mdsufidev">GitHub ↗</a></div><a href="#home">Back to top ↑</a></div></footer><Chatbot/></>
}
