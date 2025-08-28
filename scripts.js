  // ======= Helpers =======
  const $ = (sel, ctx=document) => ctx.querySelector(sel)
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel))
  const setActive = (id) => {
    // Toggle messages
    $$('.messages').forEach(el => el.classList.add('hidden'))
    const active = document.getElementById('section-'+id)
    if (active) active.classList.remove('hidden')
    // Toggle sidebar menu
    const buttons = $$('#menu button')
    buttons.forEach(b => b.setAttribute('aria-current','false'))
    const current = $(`#menu button[data-section="${id}"]`)
    if (current) current.setAttribute('aria-current','page')
    // Hash + focus
    history.replaceState(null,'','#'+id)
    $('#main').focus({ preventScroll:true })
  }
  // ======= Menu clicks =======
  $$('#menu button').forEach(btn => btn.addEventListener('click', () => setActive(btn.dataset.section)))
  // ======= Initial route from hash =======
  const initial = location.hash?.replace('#','') || 'about'
  setActive(initial)
  // ======= Keyboard search ( / ) =======
  document.addEventListener('keydown', (e) => {
    if (e.key === '/') { e.preventDefault(); $('#search')?.focus() }
  })
  // ======= Search filter =======
  $('#search').addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase()
    $$('#menu button').forEach(b => {
      const match = b.textContent.toLowerCase().includes(q)
      b.style.display = match ? '' : 'none'
    })
  })
  // ======= Composer demo actions =======
  $('#send').addEventListener('click', ()=>{
    const v = $('#quickInput').value.trim()
    if(!v) return
    const div = document.createElement('div')
    div.className = 'msg right'
    div.innerHTML = `<img class="avatar" src="https://i.pravatar.cc/200?img=67" alt="You"/><div class="bubble"><p>${v}</p><div class="meta">You • just now</div></div>`
    const current = $$('.messages').find(m => !m.classList.contains('hidden'))
    current?.appendChild(div)
    $('#quickInput').value = ''
    current?.scrollTo({ top: current.scrollHeight, behavior:'smooth' })
  })
  // ======= Contact actions =======
  const EMAIL = 'pooya585@gmail.com' // TODO: replace
  $('#copyEmail').addEventListener('click', async ()=>{
    await navigator.clipboard.writeText(EMAIL)
    $('#copyEmail').textContent = 'Copied ✓'
    setTimeout(()=> $('#copyEmail').textContent = 'Copy email', 1200)
  })
  $('#sendEmail').addEventListener('click', ()=>{
    const f = $('#contactForm')
    const params = new URLSearchParams({
      subject: '👋 Inquiry from resume site',
      body: `Hi Pooya,%0D%0A%0D%0A${f.message.value}%0D%0A%0D%0A— ${f.name.value} (${f.email.value})`
    })
    location.href = `mailto:${EMAIL}?${params.toString()}`
  })
  // ======= Download CV (placeholder PDF) =======
  $('#downloadCV').addEventListener('click', ()=>{
    const blob = new Blob([
      '%PDF-1.3\n%âãÏÓ\n1 0 obj<>stream\nBT /F1 24 Tf 72 720 Td (Resume placeholder — replace with real PDF) Tj ET\nendstream endobj\ntrailer<>\n%%EOF'
    ], { type:'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'Pooya-Hafez-CV.pdf'; a.click()
    URL.revokeObjectURL(url)
  })
  // ======= Mobile menu =======
  const mobileDialog = $('#mobileMenu')
  $('#openMenu')?.addEventListener('click', ()=>{
    const container = $('#mobileMenuItems'); container.innerHTML = ''
    $$('#menu button').forEach(b => {
      const clone = b.cloneNode(true)
      clone.addEventListener('click', ()=>{ 
        setActive(clone.dataset.section); 
        mobileDialog.close() 
      })
      container.appendChild(clone)
    })
    mobileDialog.showModal()
  })
  $('#closeMenu')?.addEventListener('click', ()=> mobileDialog.close())
  
  // Close mobile menu when clicking outside
  mobileDialog?.addEventListener('click', (e) => {
    if (e.target === mobileDialog) {
      mobileDialog.close()
    }
  })
  // ======= Year =======
  $('#year').textContent = new Date().getFullYear()