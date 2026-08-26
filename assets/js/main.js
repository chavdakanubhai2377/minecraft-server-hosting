// Main JS for PG Host frontend (updated: adds WebSocket console and API integration)
document.addEventListener('DOMContentLoaded',()=>{
  // Mobile sidebar toggle
  const toggle = document.querySelector('.mobile-nav-toggle');
  const sidebar = document.querySelector('.sidebar');
  if(toggle && sidebar){
    toggle.addEventListener('click',()=>sidebar.classList.toggle('open'))
  }

  // Purchase buttons (frontend) — if on checkout page this will hit backend endpoint
  document.querySelectorAll('.btn.purchase').forEach(btn=>{
    btn.addEventListener('click',async (e)=>{
      const plan = btn.closest('.plan') ? btn.closest('.plan').querySelector('h3').innerText : btn.dataset.plan;
      // If we are on the payments demo page, the button has data-plan and will be handled there.
      // Otherwise try contacting the demo backend to create a checkout session.
      try{
        const res = await fetch('/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan})});
        const data = await res.json();
        if(data.free){ alert(`You selected the ${plan} plan (Free).`); return; }
        if(data.url) window.location = data.url;
        else alert('Checkout demo: ' + JSON.stringify(data));
      }catch(err){
        // fallback: show simple alert
        alert(`You selected the ${plan} plan. Redirecting to checkout...`);
      }
    })
  })

  // Console send
  const sendCmd = document.getElementById('sendCmd');
  const input = document.getElementById('consoleCmd');
  const out = document.getElementById('consoleOutput');

  // WebSocket console using socket.io (if available)
  let socket;
  if(typeof io !== 'undefined'){
    try{
      socket = io();
      socket.on('connect', ()=>{
        console.log('Connected to backend socket');
      });
      socket.on('console', (msg)=>{
        if(!out) return;
        const lines = String(msg).split('\n');
        lines.forEach(l=>{
          const div = document.createElement('div'); div.textContent = l; out.appendChild(div);
        });
        out.scrollTop = out.scrollHeight;
      });
      socket.on('usage', (u)=>{
        // update any usage bars
        document.querySelectorAll('.progress-fill').forEach(el=>{
          // attempt to map by data attributes or fallback to random
          if(el.closest('.usage')){
            if(el.style.width.includes('%')) el.style.width = u.ram + '%';
          }
        });
      });
    }catch(err){ console.warn('Socket init failed', err) }
  }

  if(sendCmd){
    sendCmd.addEventListener('click',()=>{
      if(!input || !out) return;
      if(input.value.trim()==='') return;
      const cmd = input.value.trim();
      if(socket && socket.connected){
        socket.emit('command', cmd);
      } else {
        const line = document.createElement('div');
        line.textContent = `[CMD] ${cmd}`;out.appendChild(line);out.scrollTop = out.scrollHeight;input.value='';
      }
      input.value = '';
    })
  }

  // Quick Actions (start/stop/restart)
  document.querySelectorAll('.actions .btn, .panel-actions .btn').forEach(btn=>{
    btn.addEventListener('click', async (e)=>{
      const text = btn.textContent.trim().toLowerCase();
      let endpoint = null;
      if(text.includes('start')) endpoint = '/api/start';
      if(text.includes('stop')) endpoint = '/api/stop';
      if(text.includes('restart')) endpoint = '/api/restart';
      if(!endpoint) return;
      btn.disabled = true;
      try{
        const res = await fetch(endpoint, { method: 'POST' });
        const data = await res.json();
        console.log(data);
        // optimistic: update status dot text
        document.querySelectorAll('.status-text').forEach(el=>el.textContent = data.message || 'updated');
      }catch(err){ console.error(err) }
      btn.disabled = false;
    })
  })

  // Smooth page transition for internal links
  document.querySelectorAll('a[href$=".html"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      // let the link work normally on targets or external
      const href = a.getAttribute('href');
      if(!href || href.startsWith('http')) return;
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(()=>{window.location = href},220);
    })
  })

  // small mock live updates for usage bars when socket not available
  document.querySelectorAll('.progress-fill').forEach(el=>{
    const w = parseInt(el.style.width || '10');
    el.style.width = (Math.min(95, Math.max(6, w + Math.floor(Math.random()*8)-2))) + '%';
  })

});
