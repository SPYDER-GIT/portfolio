/**
 * Suraj Singh Portfolio - Interactive Application Logic
 * Implements Theme Switching, Mutual Fund Scorecard Simulator,
 * SQL Query Sandbox, Project Filters, Resume Modal, and Toast Alerts.
 */

// ==================== 1. THEME SWITCHER ====================
const themeToggleBtn = document.getElementById('themeToggleBtn');

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // Default to dark mode for modern high-tech fintech aesthetic
    document.documentElement.classList.add('dark');
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    showToast(isDark ? 'Switched to Dark Theme' : 'Switched to Light Theme');
  });
}

// ==================== 2. MOBILE MENU ====================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// ==================== 3. TOAST SYSTEM ====================
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastMessage');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('flex');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, 2500);
}

function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('Failed to copy');
  }
  document.body.removeChild(textArea);
}

// ==================== 4. ANALYTICS LAB: TAB SWITCHING ====================
function switchLabTab(tabName) {
  const mfView = document.getElementById('labMutualFundView');
  const sqlView = document.getElementById('labSqlView');
  const btnMf = document.getElementById('tabBtnMutualFund');
  const btnSql = document.getElementById('tabBtnSql');

  if (tabName === 'mutualFund') {
    mfView.classList.remove('hidden');
    sqlView.classList.add('hidden');

    btnMf.className = 'px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition bg-white dark:bg-dark-surface text-cyan-600 dark:text-cyan-400 shadow-sm';
    btnSql.className = 'px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
  } else {
    mfView.classList.add('hidden');
    sqlView.classList.remove('hidden');

    btnSql.className = 'px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition bg-white dark:bg-dark-surface text-cyan-600 dark:text-cyan-400 shadow-sm';
    btnMf.className = 'px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
    
    // Ensure table renders properly on first view
    updateSqlQueryView();
  }
}

// ==================== 5. MUTUAL FUND SIMULATOR DATA ====================
const mutualFundSchemes = {
  quant_active: {
    score: 92.4,
    grade: 'Tier-1 Outperformer',
    verdict: 'High-alpha tactical asset allocator with strong downside protection against NIFTY 50 benchmark.',
    cagr: '+24.8%',
    sharpe: '1.84',
    sortino: '2.41',
    alpha: '+6.15%',
    beta: '0.92',
    drawdown: '-11.4%'
  },
  parag_parikh: {
    score: 95.2,
    grade: 'Top-Tier Capital Preserver',
    verdict: 'Highest risk-adjusted Sortino ratio with disciplined cash buffer and international equity hedge.',
    cagr: '+22.1%',
    sharpe: '2.08',
    sortino: '2.94',
    alpha: '+5.40%',
    beta: '0.78',
    drawdown: '-8.9%'
  },
  mirae_large: {
    score: 85.0,
    grade: 'Consistent Benchmark Matcher',
    verdict: 'Low tracking error, highly stable bluechip portfolio with resilient large-cap balance.',
    cagr: '+15.6%',
    sharpe: '1.35',
    sortino: '1.74',
    alpha: '+1.40%',
    beta: '0.98',
    drawdown: '-13.2%'
  },
  hdfc_midcap: {
    score: 89.8,
    grade: 'High-Beta Alpha Engine',
    verdict: 'Exceptional market upturn participation (+28.4% 3Y CAGR) with managed cyclical volatility.',
    cagr: '+28.4%',
    sharpe: '1.65',
    sortino: '2.18',
    alpha: '+7.85%',
    beta: '1.14',
    drawdown: '-16.5%'
  }
};

function updateFundMetrics() {
  const selector = document.getElementById('fundSelector');
  if (!selector) return;

  const data = mutualFundSchemes[selector.value];
  if (!data) return;

  // Update text values
  document.getElementById('scoreDisplay').textContent = data.score.toFixed(1);
  document.getElementById('fundGradeBadge').textContent = data.grade;
  document.getElementById('fundVerdictText').textContent = data.verdict;
  document.getElementById('metricCagr').textContent = data.cagr;
  document.getElementById('metricSharpe').textContent = data.sharpe;
  document.getElementById('metricSortino').textContent = data.sortino;
  document.getElementById('metricAlpha').textContent = data.alpha;
  document.getElementById('metricBeta').textContent = data.beta;
  document.getElementById('metricDrawdown').textContent = data.drawdown;

  // Update circle circumference (2 * pi * 40 = 251.2)
  const circle = document.getElementById('scoreProgressCircle');
  if (circle) {
    const totalCircumference = 251.2;
    const progress = (data.score / 100) * totalCircumference;
    const offset = totalCircumference - progress;
    circle.style.strokeDashoffset = offset;
  }
}

// ==================== 6. SQL SANDBOX DATA & LOGIC ====================
const sqlQueries = {
  window_cumulative: {
    code: `-- 1. Cumulative Running Revenue via SQL Window Functions
SELECT 
    DATE_FORMAT(Order_Date, '%Y-%m') AS Order_Month,
    ROUND(SUM(Sales), 2) AS Monthly_Revenue,
    ROUND(SUM(SUM(Sales)) OVER (ORDER BY DATE_FORMAT(Order_Date, '%Y-%m')), 2) AS Cumulative_Revenue,
    COUNT(DISTINCT Order_ID) AS Total_Orders
FROM superstore_sales
GROUP BY DATE_FORMAT(Order_Date, '%Y-%m')
ORDER BY Order_Month ASC;`,
    headers: ['Order_Month', 'Monthly_Revenue ($)', 'Cumulative_Revenue ($)', 'Total_Orders'],
    rows: [
      ['2023-01', '$14,236.42', '$14,236.42', '79'],
      ['2023-02', '$18,119.74', '$32,356.16', '94'],
      ['2023-03', '$55,691.01', '$88,047.17', '186'],
      ['2023-04', '$28,295.35', '$116,342.52', '135'],
      ['2023-05', '$23,648.29', '$139,990.81', '142']
    ]
  },
  customer_clv: {
    code: `-- 2. Top 5 High-Value Customers & Lifetime Margin Ratio
SELECT 
    Customer_ID,
    Customer_Name,
    Segment,
    ROUND(SUM(Sales), 2) AS Lifetime_Value,
    ROUND(SUM(Profit), 2) AS Total_Profit,
    CONCAT(ROUND((SUM(Profit) / SUM(Sales)) * 100, 1), '%') AS Profit_Margin_Pct
FROM superstore_sales
GROUP BY Customer_ID, Customer_Name, Segment
ORDER BY Lifetime_Value DESC
LIMIT 5;`,
    headers: ['Customer_ID', 'Customer_Name', 'Segment', 'Lifetime_Value ($)', 'Total_Profit ($)', 'Margin %'],
    rows: [
      ['SM-20320', 'Sean Miller', 'Consumer', '$25,043.05', '$-1,980.74', '-7.9%'],
      ['TC-20980', 'Tamara Chand', 'Corporate', '$19,052.22', '$8,981.32', '47.1%'],
      ['RB-19360', 'Raymond Buch', 'Consumer', '$15,117.34', '$6,976.10', '46.1%'],
      ['TA-21385', 'Tom Ashbrook', 'Home Office', '$14,595.62', '$4,599.21', '31.5%'],
      ['AB-10105', 'Adrian Barton', 'Consumer', '$14,473.57', '$5,444.81', '37.6%']
    ]
  },
  regional_margin: {
    code: `-- 3. CTE-Based Regional Category Profitability
WITH RegionalMetrics AS (
    SELECT 
        Region,
        Category,
        ROUND(SUM(Sales), 2) AS Total_Sales,
        ROUND(SUM(Profit), 2) AS Total_Profit
    FROM superstore_sales
    GROUP BY Region, Category
)
SELECT 
    Region,
    Category,
    Total_Sales,
    Total_Profit,
    ROUND((Total_Profit / Total_Sales) * 100, 2) AS Margin_Percentage
FROM RegionalMetrics
ORDER BY Region, Margin_Percentage DESC;`,
    headers: ['Region', 'Category', 'Total_Sales ($)', 'Total_Profit ($)', 'Margin %'],
    rows: [
      ['West', 'Technology', '$251,991.61', '$44,303.65', '17.58%'],
      ['East', 'Technology', '$264,973.98', '$47,462.04', '17.91%'],
      ['Central', 'Office Supplies', '$167,026.43', '$23,406.10', '14.01%'],
      ['South', 'Technology', '$148,771.91', '$19,991.50', '13.44%'],
      ['Central', 'Furniture', '$163,797.16', '$-2,871.05', '-1.75%']
    ]
  },
  repeat_orders: {
    code: `-- 4. Customer Cohorts with High Frequency Repeat Orders
SELECT 
    Customer_ID,
    Customer_Name,
    COUNT(DISTINCT Order_ID) AS Total_Orders_Placed,
    ROUND(AVG(Sales), 2) AS Average_Basket_Size,
    ROUND(SUM(Sales), 2) AS Aggregate_Spend
FROM superstore_sales
GROUP BY Customer_ID, Customer_Name
HAVING COUNT(DISTINCT Order_ID) >= 8
ORDER BY Total_Orders_Placed DESC
LIMIT 5;`,
    headers: ['Customer_ID', 'Customer_Name', 'Total_Orders', 'Avg_Basket ($)', 'Aggregate_Spend ($)'],
    rows: [
      ['EP-13915', 'Emily Phan', '17 Orders', '$324.50', '$5,516.50'],
      ['SV-20365', 'Seth Vernon', '15 Orders', '$764.80', '$11,472.00'],
      ['WB-21850', 'William Brown', '14 Orders', '$438.10', '$6,133.40'],
      ['PP-18955', 'Paul Prost', '14 Orders', '$589.40', '$8,251.60'],
      ['ZC-21910', 'Zuschuss Carroll', '13 Orders', '$617.20', '$8,023.60']
    ]
  }
};

function updateSqlQueryView() {
  const selector = document.getElementById('sqlQuerySelector');
  if (!selector) return;

  const queryKey = selector.value;
  const data = sqlQueries[queryKey];
  if (!data) return;

  // Update Code
  document.getElementById('sqlCodeBlock').textContent = data.code;

  // Update Table Headers
  const thead = document.getElementById('sqlTableHead');
  thead.innerHTML = '';
  const headRow = document.createElement('tr');
  data.headers.forEach(h => {
    const th = document.createElement('th');
    th.className = 'py-3 px-4';
    th.textContent = h;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  // Update Table Rows
  const tbody = document.getElementById('sqlTableBody');
  tbody.innerHTML = '';
  data.rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 dark:hover:bg-dark-surface/60 transition';
    r.forEach((cell, idx) => {
      const td = document.createElement('td');
      td.className = 'py-2.5 px-4';
      if (cell.includes('-') && cell.includes('%')) {
        td.innerHTML = `<span class="text-rose-500 font-semibold">${cell}</span>`;
      } else if (cell.includes('%') || cell.includes('+')) {
        td.innerHTML = `<span class="text-emerald-500 font-semibold">${cell}</span>`;
      } else {
        td.textContent = cell;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  const rowCount = document.getElementById('sqlRowCount');
  if (rowCount) {
    rowCount.textContent = `Showing ${data.rows.length} preview rows`;
  }
}

function copySqlCode() {
  const code = document.getElementById('sqlCodeBlock').textContent;
  copyToClipboard(code, 'SQL query copied to clipboard!');
}

// ==================== 7. PROJECTS FILTERING ====================
function filterProjects(category) {
  const cards = document.querySelectorAll('.project-card');
  const buttons = document.querySelectorAll('.project-filter-btn');

  // Update active button state
  buttons.forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.className = 'project-filter-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border border-cyan-500/40 bg-cyan-500 text-white shadow-sm shadow-cyan-500/20';
    } else {
      btn.className = 'project-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300 hover:border-cyan-500';
    }
  });

  // Filter cards
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// ==================== 8. RESUME MODAL HANDLERS ====================
const resumeModal = document.getElementById('resumeModal');
const openResumeBtn = document.getElementById('openResumeModalBtn');
const heroResumeBtn = document.getElementById('heroResumeBtn');
const mobileResumeBtn = document.getElementById('mobileResumeBtn');
const closeResumeBtn = document.getElementById('closeResumeModalBtn');

function openResume() {
  if (resumeModal) {
    resumeModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeResume() {
  if (resumeModal) {
    resumeModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);
if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResume);
if (mobileResumeBtn) mobileResumeBtn.addEventListener('click', openResume);
if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);

if (resumeModal) {
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && resumeModal && !resumeModal.classList.contains('hidden')) {
    closeResume();
  }
});

// ==================== 9. CONTACT FORM HANDLER ====================
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  // Construct mailto link as direct fallback
  const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  const mailtoUrl = `mailto:surajkumarsingh2580@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

  // Display success message
  const msgBox = document.getElementById('formSuccessMessage');
  if (msgBox) {
    msgBox.classList.remove('hidden');
  }

  showToast('Inquiry drafted! Opening mail client...');
  
  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 600);
}

// ==================== 10. INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateFundMetrics();
  updateSqlQueryView();
});
