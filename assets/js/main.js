// Main JS for PG Host frontend
document.addEventListener('DOMContentLoaded',()=>{
  // Mobile sidebar toggle
  const toggle = document.querySelector('.mobile-nav-toggle');
  const sidebar = document.querySelector('.sidebar');
  if(toggle && sidebar){
    toggle.addEventListener('click',()=>sidebar.classList.toggle('open'))
  }

  // Purchase buttons
  document.querySelectorAll('.btn.purchase').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const plan = btn.closest('.plan').querySelector('h3').innerText;
      alert(`You selected the ${plan} plan. Redirecting to checkout...`);
      // TODO: integrate checkout
    })
  })

  // Console send
  const sendCmd = document.getElementById('sendCmd');
  if(sendCmd){
    sendCmd.addEventListener('click',()=>{
      const input = document.getElementById('consoleCmd');
      const out = document.getElementById('consoleOutput');
      if(input.value.trim()==='') return;
      const cmd = input.value.trim();
      const line = document.createElement('div');
      line.textContent = `[CMD] ${cmd}`;out.appendChild(line);out.scrollTop = out.scrollHeight;input.value='';
    })
  }

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

  // small mock live updates for usage bars
  document.querySelectorAll('.progress-fill').forEach(el=>{
    const w = parseInt(el.style.width || '10');
    el.style.width = (Math.min(95, Math.max(6, w + Math.floor(Math.random()*8)-2))) + '%';
  })
});
