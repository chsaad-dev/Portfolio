(function() {
  const btn = document.getElementById('ai-chat-btn');
  const panel = document.getElementById('ai-chat-panel');
  const closeBtn = document.getElementById('ai-chat-close');
  const msgs = document.getElementById('ai-chat-messages');
  const form = document.getElementById('ai-chat-input-area');
  const input = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-chat-send');
  const typing = document.getElementById('ai-chat-typing');

  let history = [];
  const WORKER_URL = "https://portfolio-chatbot.giveeaseapp.workers.dev";

  if (!btn || !panel) return;

  function toggleChat() {
    panel.classList.toggle('open');
    btn.classList.toggle('open', panel.classList.contains('open'));
    if (panel.classList.contains('open') && input) input.focus();
  }

  btn.addEventListener('click', toggleChat);
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
      btn.classList.remove('open');
    });
  }

  const chipsContainer = document.getElementById('ai-chat-chips');

  function formatMarkdown(text) {
    if (!text) return '';
    let safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Strip incomplete trailing markdown link if cut off mid-token
    safe = safe.replace(/(\*{0,2}\[[^\]]*(\](?:\([^\)]*)?)?)$/, '');

    safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+|mailto:[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;font-family:var(--font-mono);font-size:0.85em;">$1</code>');

    const lines = safe.split('\n');
    let inList = false;
    let result = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed === '---') {
        if (inList) { result.push('</ul>'); inList = false; }
        result.push('<hr style="border:none;border-top:1px solid var(--border);margin:0.5rem 0;">');
      } else if (/^#+\s*/.test(trimmed)) {
        if (inList) { result.push('</ul>'); inList = false; }
        const title = trimmed.replace(/^#+\s*(?:#+\s*)?/, '');
        result.push('<h4>' + title + '</h4>');
      } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (!inList) {
          result.push('<ul>');
          inList = true;
        }
        result.push('<li>' + trimmed.slice(2) + '</li>');
      } else {
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (trimmed.length > 0) {
          result.push('<p>' + trimmed + '</p>');
        }
      }
    }
    if (inList) result.push('</ul>');
    return result.join('');
  }

  function addMessage(text, isUser) {
    if (!msgs) return;
    const d = document.createElement('div');
    d.className = isUser ? 'user-msg' : 'ai-msg';
    if (isUser) {
      d.textContent = text;
    } else {
      d.innerHTML = formatMarkdown(text);
    }
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function sendMessage() {
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    if (chipsContainer) {
      chipsContainer.style.display = 'none';
    }

    input.value = '';
    addMessage(text, true);

    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;
    if (typing) typing.style.display = 'block';

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });

      if (!res.ok) throw new Error('Network error');

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't get a response.";
      addMessage(reply, false);

      history.push({ role: 'user', text });
      history.push({ role: 'assistant', text: reply });
      if (history.length > 20) history = history.slice(-20);
    } catch (err) {
      addMessage("Oops, something went wrong connecting to the AI.", false);
    } finally {
      input.disabled = false;
      if (sendBtn) sendBtn.disabled = false;
      if (typing) typing.style.display = 'none';
      input.focus();
    }
  }

  if (form) form.addEventListener('submit', sendMessage);

  if (chipsContainer) {
    chipsContainer.querySelectorAll('.ai-chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        if (input) {
          input.value = chip.getAttribute('data-query');
          sendMessage();
        }
      });
    });
  }
})();
