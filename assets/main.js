/* 韦乐衍 · Leyan —— 年龄、生日倒计时、入场动画、留言板 */

const MONTHS = ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月', '8 月', '9 月', '10 月', '11 月', '12 月'];
const DAY = 86400000;
const BIRTH_DAY = 24, BIRTH_MONTH = 9; // 10 月 24 日

const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const now = startOfDay(new Date());

const birthdayThisYear = startOfDay(new Date(now.getFullYear(), BIRTH_MONTH, BIRTH_DAY));
const ageOnBirthday = now.getFullYear() - 2019;               // 今年生日当天满几岁
const currentAge = now < birthdayThisYear ? ageOnBirthday - 1 : ageOnBirthday;
const isBirthday = now.getTime() === birthdayThisYear.getTime();
const nextBirthday = now <= birthdayThisYear
  ? birthdayThisYear
  : startOfDay(new Date(now.getFullYear() + 1, BIRTH_MONTH, BIRTH_DAY));
const daysLeft = Math.round((nextBirthday - now) / DAY);
const turningAge = nextBirthday.getFullYear() - 2019;

const setText = (sel, val) =>
  document.querySelectorAll(sel).forEach(el => { el.textContent = val; });

setText('[data-age]', currentAge);
setText('[data-next-birthday-age]', turningAge);
setText('[data-cd-days]', daysLeft);
setText('[data-year]', now.getFullYear());
setText('[data-birthday-counted]',
  isBirthday ? '就是今天 🎂' : `${MONTHS[nextBirthday.getMonth()]} ${nextBirthday.getDate()} 日`);

if (isBirthday) {
  setText('.cd-label', `今天满 ${currentAge} 岁啦`);
  document.querySelector('.cd-num')?.remove();
  document.body.classList.add('birthday');
  confetti();
}

/* 地面滚动的篮球：跟着页面滚动前进并自转 */
const ball = document.querySelector('.floor-ball');
if (ball) {
  const roll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    ball.style.setProperty('--p', p.toFixed(4));
    ball.style.setProperty('--rot', (scrollY * 4.4).toFixed(1) + 'deg');
  };
  addEventListener('scroll', () => requestAnimationFrame(roll), { passive: true });
  addEventListener('resize', roll);
  roll();
}

/* 滚动入场 */
const targets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(el => io.observe(el));
} else {
  targets.forEach(el => el.classList.add('in'));
}

/* 留言板：Twikoo。留言存在自己的 LeanCloud 里，静态站本身不碰数据。
   滚到附近才加载脚本；没填 envId 之前整块隐藏（styles.css 搜 .gb-off）。 */
const TWIKOO_ENV = ''; // 例：https://xxx.lcintl.com/2020/10/xxxxxxxxxxxxxxx

if (!TWIKOO_ENV) {
  document.body.classList.add('gb-off');
} else {
  const gb = document.getElementById('guestbook');
  const loadTwikoo = () => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/twikoo@1/dist/twikoo.all.min.js';
    s.onload = () => twikoo.init({
      envId: TWIKOO_ENV,
      el: '#twikoo',
      lang: 'zh-CN',
      requiredFields: ['nick'], // 邮箱不必填，少收一点访客信息
    });
    document.body.appendChild(s);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { io.disconnect(); loadTwikoo(); }
    }, { rootMargin: '400px 0px' });
    io.observe(gb);
  } else {
    loadTwikoo();
  }
}

function confetti() {
  const colors = ['#f2711c', '#3e8fb0', '#6fa82f', '#ffc24b', '#d94f70'];
  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 90; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = (Math.random() * 6) + 's';
    p.style.animationDuration = (4 + Math.random() * 4) + 's';
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
}
