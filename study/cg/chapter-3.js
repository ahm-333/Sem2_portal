/**
 * Computer Graphics Chapter 3: Output Primitives & Bresenham's Algorithm
 * Interactive Lesson Logic:
 * 1. Screen Coordinate Grid (#screenCoordSvg) with click + keyboard accessibility
 * 2. Static Vector Diagrams (#jaggiesSvg, #d1d2Svg) with WCAG AA theme-aware colors
 * 3. Solved Example Stepper & Plotter (#exampleTableBody, #examplePlotSvg, #btnExPrev, #btnExNext, #btnExAll)
 * 4. Custom Bresenham Solver (#customSolverTableBody, #customSolverSvg, #solverSummaryCards) with all slope & boundary cases
 * 5. Quiz Engine (34 questions across #quiz-sec1..#quiz-sec6 and #quiz-all) with PortalStorage persistence
 * 6. Shared Reading Controls, TOC Drawer, Section Navigation, and Breadcrumb Sync
 */

(function () {
  'use strict';

  var STORAGE_KEY_QUIZ = 'sem2_cg_chapter3_answers_v1';
  var STORAGE_KEY_FONT = 'sem2_cg_font_scale';
  var STORAGE_KEY_SPACING = 'sem2_cg_line_spacing';

  var rawStorage = window.PortalStorage || null;
  var storage = {
    getString: function (k, d) {
      try {
        var val = rawStorage && typeof rawStorage.getItem === 'function' ? rawStorage.getItem(k) : localStorage.getItem(k);
        return val !== null && val !== undefined ? val : d;
      } catch (_e) {
        return d;
      }
    },
    setString: function (k, v) {
      try {
        if (rawStorage && typeof rawStorage.setItem === 'function') {
          rawStorage.setItem(k, String(v));
        } else {
          localStorage.setItem(k, String(v));
        }
      } catch (_e) {
        /* ignore */
      }
    },
    getJSON: function (k, d) {
      try {
        var r = this.getString(k, null);
        return r ? JSON.parse(r) : d;
      } catch (_e) {
        return d;
      }
    },
    setJSON: function (k, v) {
      try {
        this.setString(k, JSON.stringify(v));
      } catch (_e) {
        /* ignore */
      }
    }
  };

  var userAnswers = storage.getJSON(STORAGE_KEY_QUIZ, {});

  function getQuestions() {
    if (Array.isArray(window.quizQuestions)) {
      return window.quizQuestions;
    }
    if (Array.isArray(window.QUIZ_QUESTIONS)) {
      return window.QUIZ_QUESTIONS;
    }
    return [];
  }

  /* =========================================================================
   * 1. INTERACTIVE SCREEN COORDINATE DIAGRAM (#screenCoordSvg)
   * ========================================================================= */
  var activePixelCoord = { x: 2, y: 1 };

  function renderScreenCoordSvg(activeX, activeY) {
    if (typeof activeX === 'number') activePixelCoord.x = activeX;
    if (typeof activeY === 'number') activePixelCoord.y = activeY;

    var svg = document.getElementById('screenCoordSvg');
    if (!svg) return;

    var cols = 6;
    var rows = 4;
    var cellW = 48;
    var cellH = 44;
    var startX = 76;
    var startY = 28;
    var html = '';

    html += '<text x="' + (startX + (cols * cellW) / 2) + '" y="18" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--study-ink)">Pixel Columns X (0 → Left to Right)</text>';
    html += '<text x="20" y="' + (startY + (rows * cellH) / 2) + '" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--study-ink)" transform="rotate(-90, 20, ' + (startY + (rows * cellH) / 2) + ')">Scan Lines Y (0 at Bottom)</text>';

    for (var r = 0; r < rows; r++) {
      var scanY = rows - 1 - r;
      var py = startY + r * cellH;
      html += '<text x="' + (startX - 10) + '" y="' + (py + cellH / 2 + 4) + '" text-anchor="end" font-size="12" font-family="monospace" font-weight="bold" fill="var(--study-ink)">Y=' + scanY + '</text>';

      for (var c = 0; c < cols; c++) {
        var px = startX + c * cellW;
        var isSel = c === activePixelCoord.x && scanY === activePixelCoord.y;
        var fill = isSel ? 'var(--study-accent)' : 'var(--study-soft)';
        var textCol = isSel ? 'var(--study-on-accent)' : 'var(--study-ink)';
        var strokeCol = isSel ? 'var(--study-ink)' : 'var(--study-line)';
        var strokeW = isSel ? '2' : '1';
        var pressedAttr = isSel ? 'true' : 'false';

        html += '<g class="coord-pixel-cell" role="button" tabindex="0" data-col="' + c + '" data-scan="' + scanY + '" aria-pressed="' + pressedAttr + '" aria-label="Pixel Column X = ' + c + ', Scan Line Y = ' + scanY + '" style="cursor:pointer">';
        html += '<rect x="' + (px + 2) + '" y="' + (py + 2) + '" width="' + (cellW - 4) + '" height="' + (cellH - 4) + '" rx="6" fill="' + fill + '" stroke="' + strokeCol + '" stroke-width="' + strokeW + '"/>';
        html += '<text x="' + (px + cellW / 2) + '" y="' + (py + cellH / 2 + 4) + '" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="' + textCol + '">(' + c + ',' + scanY + ')</text>';
        html += '</g>';
      }
    }

    for (var col = 0; col < cols; col++) {
      var cx = startX + col * cellW + cellW / 2;
      html += '<text x="' + cx + '" y="' + (startY + rows * cellH + 22) + '" text-anchor="middle" font-size="12" font-family="monospace" font-weight="bold" fill="var(--study-ink)">X=' + col + '</text>';
    }

    var bottomY = startY + rows * cellH + 46;
    html += '<line x1="' + startX + '" y1="' + bottomY + '" x2="' + (startX + 120) + '" y2="' + bottomY + '" stroke="var(--cg-svg-emerald)" stroke-width="2.5"/>';
    html += '<text x="' + (startX + 128) + '" y="' + (bottomY + 4) + '" font-size="11" font-weight="bold" fill="var(--cg-svg-emerald)">Origin (0,0) at Bottom-Left</text>';

    svg.innerHTML = html;

    var readout = document.getElementById('coordReadout');
    if (readout) {
      readout.textContent = 'Pixel: (Col X = ' + activePixelCoord.x + ', Scan Line Y = ' + activePixelCoord.y + ')';
    }

    var cells = svg.querySelectorAll('.coord-pixel-cell');
    cells.forEach(function (cell) {
      var selectCell = function (shouldRefocus) {
        var nextX = Number(cell.getAttribute('data-col'));
        var nextY = Number(cell.getAttribute('data-scan'));
        renderScreenCoordSvg(nextX, nextY);
        if (shouldRefocus) {
          var updated = svg.querySelector('.coord-pixel-cell[data-col="' + nextX + '"][data-scan="' + nextY + '"]');
          if (updated) updated.focus();
        }
      };

      cell.addEventListener('click', function () {
        selectCell(false);
      });

      cell.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          selectCell(true);
        }
      });
    });
  }

  window.renderScreenCoordSvg = renderScreenCoordSvg;

  /* =========================================================================
   * 2. JAGGIES SVG (#jaggiesSvg) & d1/d2 SVG (#d1d2Svg)
   * ========================================================================= */
  function renderJaggiesSvg() {
    var svg = document.getElementById('jaggiesSvg');
    if (!svg) return;

    var cols = 8;
    var rows = 4;
    var size = 38;
    var ox = 50;
    var oy = 18;
    var plotted = [
      [0, 0],
      [1, 0],
      [2, 1],
      [3, 1],
      [4, 2],
      [5, 2],
      [6, 3],
      [7, 3]
    ];
    var html = '';

    for (var r = 0; r < rows; r++) {
      var sy = rows - 1 - r;
      for (var c = 0; c < cols; c++) {
        var isOn = plotted.some(function (p) {
          return p[0] === c && p[1] === sy;
        });
        var px = ox + c * size;
        var py = oy + r * size;
        html += '<rect x="' + px + '" y="' + py + '" width="' + size + '" height="' + size + '" fill="' + (isOn ? 'var(--cg-svg-soft-blue)' : 'transparent') + '" stroke="var(--study-line)" stroke-width="1"/>';
        if (isOn) {
          html += '<circle cx="' + (px + size / 2) + '" cy="' + (py + size / 2) + '" r="6" fill="var(--study-accent)"/>';
        }
      }
    }

    var xStart = ox + size / 2;
    var yStart = oy + (rows - 1) * size + size / 2;
    var xEnd = ox + (cols - 1) * size + size / 2;
    var yEnd = oy + size / 2;

    html += '<line x1="' + xStart + '" y1="' + yStart + '" x2="' + xEnd + '" y2="' + yEnd + '" stroke="var(--cg-svg-danger)" stroke-width="2.5" stroke-dasharray="6,4"/>';

    var pts = plotted
      .map(function (p) {
        var cx = ox + p[0] * size + size / 2;
        var cy = oy + (rows - 1 - p[1]) * size + size / 2;
        return cx + ',' + cy;
      })
      .join(' ');

    html += '<polyline points="' + pts + '" fill="none" stroke="var(--study-accent)" stroke-width="2.5"/>';
    html += '<text x="50" y="194" font-size="11" font-weight="bold" fill="var(--cg-svg-danger)">--- Ideal Smooth Line</text>';
    html += '<text x="220" y="194" font-size="11" font-weight="bold" fill="var(--study-accent)">● Plotted Stair-Step Pixels (The Jaggies)</text>';

    svg.innerHTML = html;
  }

  function renderD1D2Svg() {
    var svg = document.getElementById('d1d2Svg');
    if (!svg) return;

    var xk = 95;
    var xk1 = 265;
    var yk1 = 75;
    var yk = 215;
    var yTrue = 160;
    var html = '';

    html += '<line x1="45" y1="' + yk1 + '" x2="395" y2="' + yk1 + '" stroke="var(--study-line)" stroke-width="1.5" stroke-dasharray="5,5"/>';
    html += '<line x1="45" y1="' + yk + '" x2="395" y2="' + yk + '" stroke="var(--study-line)" stroke-width="1.5" stroke-dasharray="5,5"/>';
    html += '<line x1="' + xk + '" y1="35" x2="' + xk + '" y2="255" stroke="var(--study-line)" stroke-width="1.5" stroke-dasharray="5,5"/>';
    html += '<line x1="' + xk1 + '" y1="35" x2="' + xk1 + '" y2="255" stroke="var(--study-line)" stroke-width="1.5" stroke-dasharray="5,5"/>';

    html += '<text x="40" y="' + (yk1 + 4) + '" text-anchor="end" font-size="12" font-family="monospace" font-weight="bold" fill="var(--study-ink)">y_k+1</text>';
    html += '<text x="40" y="' + (yk + 4) + '" text-anchor="end" font-size="12" font-family="monospace" font-weight="bold" fill="var(--study-ink)">y_k</text>';
    html += '<text x="' + xk + '" y="275" text-anchor="middle" font-size="12" font-family="monospace" font-weight="bold" fill="var(--study-ink)">x_k</text>';
    html += '<text x="' + xk1 + '" y="275" text-anchor="middle" font-size="12" font-family="monospace" font-weight="bold" fill="var(--study-ink)">x_k + 1</text>';

    html += '<line x1="55" y1="230" x2="375" y2="120" stroke="var(--cg-svg-emerald)" stroke-width="3"/>';
    html += '<text x="372" y="106" text-anchor="end" font-size="11" font-weight="bold" fill="var(--cg-svg-emerald)">True Line Path (y)</text>';

    html += '<circle cx="' + xk + '" cy="' + yk + '" r="8" fill="var(--study-accent)"/>';
    html += '<text x="' + xk + '" y="' + (yk + 22) + '" text-anchor="middle" font-size="11" font-weight="bold" fill="var(--study-accent)">Current (x_k, y_k)</text>';

    html += '<circle cx="' + xk1 + '" cy="' + yk1 + '" r="8" fill="var(--cg-svg-purple)"/>';
    html += '<text x="' + (xk1 - 12) + '" y="' + (yk1 - 12) + '" text-anchor="end" font-size="11" font-weight="bold" fill="var(--cg-svg-purple)">Upper Pixel (x_k+1, y_k+1)</text>';

    html += '<circle cx="' + xk1 + '" cy="' + yk + '" r="8" fill="var(--cg-svg-amber)"/>';
    html += '<text x="' + (xk1 - 12) + '" y="' + (yk + 22) + '" text-anchor="end" font-size="11" font-weight="bold" fill="var(--cg-svg-amber)">Lower Pixel (x_k+1, y_k)</text>';

    html += '<circle cx="' + xk1 + '" cy="' + yTrue + '" r="5" fill="var(--cg-svg-emerald)"/>';

    html += '<line x1="' + (xk1 + 22) + '" y1="' + yTrue + '" x2="' + (xk1 + 22) + '" y2="' + yk + '" stroke="var(--cg-svg-amber)" stroke-width="2.5"/>';
    html += '<text x="' + (xk1 + 30) + '" y="' + ((yTrue + yk) / 2 + 4) + '" font-size="12" font-family="monospace" font-weight="bold" fill="var(--cg-svg-amber)">d1 = y - y_k</text>';

    html += '<line x1="' + (xk1 + 22) + '" y1="' + yk1 + '" x2="' + (xk1 + 22) + '" y2="' + yTrue + '" stroke="var(--cg-svg-purple)" stroke-width="2.5"/>';
    html += '<text x="' + (xk1 + 30) + '" y="' + ((yk1 + yTrue) / 2 + 4) + '" font-size="12" font-family="monospace" font-weight="bold" fill="var(--cg-svg-purple)">d2 = (y_k+1) - y</text>';

    svg.innerHTML = html;
  }

  /* =========================================================================
   * 3. SOLVED EXAMPLE TABLE & STEPPER (SLIDES 27-30: (20,10) -> (30,18))
   * ========================================================================= */
  var EX_STEPS = [
    { k: 0, pk: 6, sign: 'موجب (≥ 0) ⟹ زود y', pt: [21, 11], nextCalc: 'p1 = 6 - 4 = 2' },
    { k: 1, pk: 2, sign: 'موجب (≥ 0) ⟹ زود y', pt: [22, 12], nextCalc: 'p2 = 2 - 4 = -2' },
    { k: 2, pk: -2, sign: 'سالب (< 0) ⟹ ثبت y', pt: [23, 12], nextCalc: 'p3 = -2 + 16 = 14' },
    { k: 3, pk: 14, sign: 'موجب (≥ 0) ⟹ زود y', pt: [24, 13], nextCalc: 'p4 = 14 - 4 = 10' },
    { k: 4, pk: 10, sign: 'موجب (≥ 0) ⟹ زود y', pt: [25, 14], nextCalc: 'p5 = 10 - 4 = 6' },
    { k: 5, pk: 6, sign: 'موجب (≥ 0) ⟹ زود y', pt: [26, 15], nextCalc: 'p6 = 6 - 4 = 2' },
    { k: 6, pk: 2, sign: 'موجب (≥ 0) ⟹ زود y', pt: [27, 16], nextCalc: 'p7 = 2 - 4 = -2' },
    { k: 7, pk: -2, sign: 'سالب (< 0) ⟹ ثبت y', pt: [28, 16], nextCalc: 'p8 = -2 + 16 = 14' },
    { k: 8, pk: 14, sign: 'موجب (≥ 0) ⟹ زود y', pt: [29, 17], nextCalc: 'p9 = 14 - 4 = 10' },
    { k: 9, pk: 10, sign: 'موجب (≥ 0) ⟹ زود y', pt: [30, 18], nextCalc: 'وصلنا لنقطة النهاية!' }
  ];
  var currentExStep = 10;

  function renderSolvedExample() {
    var tbody = document.getElementById('exampleTableBody');
    var badge = document.getElementById('exStepBadge');
    if (!tbody || !badge) return;

    badge.textContent = currentExStep === 10 ? 'كل الخطوات (10/10)' : 'الخطوة k = ' + (currentExStep - 1) + ' (' + currentExStep + '/10)';

    tbody.innerHTML = EX_STEPS.slice(0, currentExStep)
      .map(function (s, idx) {
        var isCurrent = idx === currentExStep - 1 && currentExStep < 10;
        var rowCls = isCurrent ? 'ex-step-row active-step-row font-bold' : 'ex-step-row';
        var signCls = s.pk >= 0 ? 'cg-text-emerald' : 'cg-text-amber';
        return (
          '<tr class="' + rowCls + '" tabindex="0" data-step="' + (idx + 1) + '" aria-label="الخطوة k = ' + s.k + '، البكسل (' + s.pt[0] + ', ' + s.pt[1] + ')">' +
          '<td class="p-2.5 font-mono font-bold" dir="ltr">' + s.k + '</td>' +
          '<td class="p-2.5 font-mono font-bold" dir="ltr">' + s.pk + '</td>' +
          '<td class="p-2.5 font-bold ' + signCls + '">' + s.sign + '</td>' +
          '<td class="p-2.5 font-mono font-bold cg-text-blue" dir="ltr">(' + s.pt[0] + ', ' + s.pt[1] + ')</td>' +
          '<td class="p-2.5 font-mono text-xs" dir="ltr">' + s.nextCalc + '</td>' +
          '</tr>'
        );
      })
      .join('');

    var rows = tbody.querySelectorAll('.ex-step-row');
    rows.forEach(function (row) {
      var stepNum = Number(row.getAttribute('data-step'));
      row.addEventListener('click', function () {
        setExStep(stepNum);
      });
      row.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          setExStep(stepNum);
        }
      });
    });

    renderExamplePlotSvg();
  }

  function setExStep(step) {
    currentExStep = Math.max(1, Math.min(10, Number(step) || 10));
    renderSolvedExample();
  }

  window.setExStep = setExStep;

  function renderExamplePlotSvg() {
    var svg = document.getElementById('examplePlotSvg');
    if (!svg) return;

    var allPts = [[20, 10]].concat(
      EX_STEPS.slice(0, currentExStep).map(function (s) {
        return s.pt;
      })
    );
    var minX = 20;
    var maxX = 30;
    var minY = 10;
    var maxY = 18;
    var cell = 28;
    var ox = 56;
    var oy = 24;
    var cols = maxX - minX + 1;
    var rows = maxY - minY + 1;
    var html = '';

    for (var r = 0; r < rows; r++) {
      var yVal = maxY - r;
      var py = oy + r * cell;
      html += '<text x="' + (ox - 10) + '" y="' + (py + cell / 2 + 4) + '" text-anchor="end" font-size="11" font-family="monospace" font-weight="bold" fill="var(--study-ink)">' + yVal + '</text>';

      for (var c = 0; c < cols; c++) {
        var xVal = minX + c;
        var px = ox + c * cell;
        var isPlotted = allPts.some(function (p) {
          return p[0] === xVal && p[1] === yVal;
        });
        var isRepeat = (xVal === 23 && yVal === 12) || (xVal === 28 && yVal === 16);
        var fill = isPlotted ? (isRepeat ? 'var(--cg-svg-amber)' : 'var(--study-accent)') : 'transparent';
        html += '<rect x="' + px + '" y="' + py + '" width="' + cell + '" height="' + cell + '" fill="' + fill + '" fill-opacity="' + (isPlotted ? '0.24' : '1') + '" stroke="var(--study-line)" stroke-width="1"/>';
        if (isPlotted) {
          html += '<circle cx="' + (px + cell / 2) + '" cy="' + (py + cell / 2) + '" r="6" fill="' + fill + '"/>';
        }
      }
    }

    for (var col = 0; col < cols; col++) {
      var xLabel = minX + col;
      var cx = ox + col * cell + cell / 2;
      html += '<text x="' + cx + '" y="' + (oy + rows * cell + 18) + '" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="var(--study-ink)">' + xLabel + '</text>';
    }

    var x1 = ox + cell / 2;
    var y1 = oy + (rows - 1) * cell + cell / 2;
    var x2 = ox + (cols - 1) * cell + cell / 2;
    var y2 = oy + cell / 2;
    html += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--cg-svg-emerald)" stroke-width="2" stroke-dasharray="4,4"/>';
    html += '<text x="56" y="318" font-size="11" font-weight="bold" fill="var(--study-accent)">● Plotted Pixels</text>';
    html += '<text x="190" y="318" font-size="11" font-weight="bold" fill="var(--cg-svg-amber)">● Flat Y Steps (k=2 &amp; k=7)</text>';

    svg.innerHTML = html;
  }

  /* =========================================================================
   * 4. INTERACTIVE CUSTOM BRESENHAM SOLVER (SECTION 6)
   * ========================================================================= */
  function syncPresetButtons(x0, y0, x1, y1) {
    var key = [x0, y0, x1, y1].join(',');
    var btns = document.querySelectorAll('.preset-line-btn');
    btns.forEach(function (btn) {
      var isMatch = btn.getAttribute('data-preset-line') === key;
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });
  }

  function solveCustomBresenham(x0, y0, x1, y1) {
    var summaryEl = document.getElementById('solverSummaryCards');
    var tbody = document.getElementById('customSolverTableBody');
    var svg = document.getElementById('customSolverSvg');
    if (!summaryEl || !tbody || !svg) return;

    var rawDx = x1 - x0;
    var rawDy = y1 - y0;
    var dx = Math.abs(rawDx);
    var dy = Math.abs(rawDy);
    var sx = x0 < x1 ? 1 : x0 > x1 ? -1 : 0;
    var sy = y0 < y1 ? 1 : y0 > y1 ? -1 : 0;

    syncPresetButtons(x0, y0, x1, y1);

    // Boundary Case 0: Identical endpoints (dx = 0, dy = 0)
    if (dx === 0 && dy === 0) {
      summaryEl.innerHTML =
        '<div class="card-surface p-2.5 rounded-lg"><div class="text-xs" style="color:var(--study-muted)">Δx , Δy</div><div class="font-mono font-bold text-sm" dir="ltr">Δx=0, Δy=0</div></div>' +
        '<div class="card-surface p-2.5 rounded-lg"><div class="text-xs" style="color:var(--study-muted)">الحالة (Case)</div><div class="font-bold text-xs">نقطة واحدة (Single Point)</div></div>' +
        '<div class="card-surface p-2.5 rounded-lg"><div class="text-xs" style="color:var(--study-muted)">الثوابت</div><div class="font-mono font-bold text-xs" dir="ltr">0 , 0</div></div>' +
        '<div class="card-surface p-2.5 rounded-lg"><div class="text-xs" style="color:var(--study-muted)">معامل البداية p_0</div><div class="font-mono font-bold text-sm cg-text-blue" dir="ltr">p0 = 0</div></div>';

      tbody.innerHTML =
        '<tr>' +
        '<td class="p-2 font-mono font-bold" dir="ltr">0</td>' +
        '<td class="p-2 font-mono font-bold" dir="ltr">0</td>' +
        '<td class="p-2 text-xs font-bold cg-text-emerald">نقطتا البداية والنهاية متطابقتان ⟹ بكسل واحد فقط</td>' +
        '<td class="p-2 font-mono font-bold cg-text-blue" dir="ltr">(' + x0 + ', ' + y0 + ')</td>' +
        '<td class="p-2 font-mono text-xs" dir="ltr">End (Single Pixel)</td>' +
        '</tr>';

      renderCustomPlotSvg([[x0, y0]]);
      return;
    }

    var steep = dy > dx;
    var fastDelta = steep ? dy : dx;
    var slowDelta = steep ? dx : dy;
    var c1 = 2 * slowDelta;
    var c2 = 2 * slowDelta - 2 * fastDelta;
    var p0 = 2 * slowDelta - fastDelta;

    var caseLabel;
    if (dx === 0) {
      caseLabel = 'خط رأسي مباشر (Δx = 0, m = ∞)';
    } else if (dy === 0) {
      caseLabel = 'خط أفقي مباشر (Δy = 0, m = 0)';
    } else if (steep) {
      caseLabel = 'ميل حاد |m| > 1 (المحور السريع Y)';
    } else if (rawDx * rawDy < 0) {
      caseLabel = 'ميل سالب خفيف (-1 ≤ m < 0)';
    } else {
      caseLabel = 'قياسية 0 < m ≤ 1 (المحور السريع X)';
    }

    summaryEl.innerHTML =
      '<div class="card-surface p-2.5 rounded-lg"><div class="text-xs" style="color:var(--study-muted)">Δx , Δy</div><div class="font-mono font-bold text-sm" dir="ltr">Δx=' + dx + ', Δy=' + dy + '</div></div>' +
      '<div class="card-surface p-2.5 rounded-lg"><div class="text-xs" style="color:var(--study-muted)">الحالة (Case)</div><div class="font-bold text-xs">' + caseLabel + '</div></div>' +
      '<div class="card-surface p-2.5 rounded-lg"><div class="text-xs" style="color:var(--study-muted)">الثوابت</div><div class="font-mono font-bold text-xs" dir="ltr">' + c1 + ' , ' + c2 + '</div></div>' +
      '<div class="card-surface p-2.5 rounded-lg"><div class="text-xs" style="color:var(--study-muted)">معامل البداية p_0</div><div class="font-mono font-bold text-sm cg-text-blue" dir="ltr">p0 = ' + p0 + '</div></div>';

    var pk = p0;
    var cx = x0;
    var cy = y0;
    var steps = [];
    var points = [[cx, cy]];

    for (var k = 0; k < fastDelta; k++) {
      var prevPk = pk;
      var decisionText = '';
      var calcText = '';

      if (!steep) {
        cx += sx;
        if (prevPk < 0) {
          pk = prevPk + c1;
          decisionText = 'سالب (<0) ⟹ ثبت y';
          calcText = prevPk + ' + ' + c1 + ' = ' + pk;
        } else {
          cy += sy;
          pk = prevPk + c2;
          var yVerb = sy < 0 ? 'نقص y بـ 1' : 'زود y بـ 1';
          decisionText = 'موجب/صفر (≥0) ⟹ ' + yVerb;
          calcText = prevPk + ' + (' + c2 + ') = ' + pk;
        }
      } else {
        cy += sy;
        if (prevPk < 0) {
          pk = prevPk + c1;
          decisionText = 'سالب (<0) ⟹ ثبت x';
          calcText = prevPk + ' + ' + c1 + ' = ' + pk;
        } else {
          cx += sx;
          pk = prevPk + c2;
          var xVerb = sx < 0 ? 'نقص x بـ 1' : 'زود x بـ 1';
          decisionText = 'موجب/صفر (≥0) ⟹ ' + xVerb;
          calcText = prevPk + ' + (' + c2 + ') = ' + pk;
        }
      }

      points.push([cx, cy]);
      steps.push({
        k: k,
        pk: prevPk,
        decisionText: decisionText,
        pt: [cx, cy],
        calcText: k === fastDelta - 1 ? 'وصلنا للنهاية' : calcText
      });
    }

    tbody.innerHTML = steps
      .map(function (s) {
        return (
          '<tr>' +
          '<td class="p-2 font-mono font-bold" dir="ltr">' + s.k + '</td>' +
          '<td class="p-2 font-mono font-bold" dir="ltr">' + s.pk + '</td>' +
          '<td class="p-2 text-xs font-bold ' + (s.pk >= 0 ? 'cg-text-emerald' : 'cg-text-amber') + '">' + s.decisionText + '</td>' +
          '<td class="p-2 font-mono font-bold cg-text-blue" dir="ltr">(' + s.pt[0] + ', ' + s.pt[1] + ')</td>' +
          '<td class="p-2 font-mono text-xs" dir="ltr">' + s.calcText + '</td>' +
          '</tr>'
        );
      })
      .join('');

    renderCustomPlotSvg(points);
  }

  function renderCustomPlotSvg(points) {
    var svg = document.getElementById('customSolverSvg');
    if (!svg || !points.length) return;

    var xs = points.map(function (p) {
      return p[0];
    });
    var ys = points.map(function (p) {
      return p[1];
    });
    var minX = Math.min.apply(null, xs);
    var maxX = Math.max.apply(null, xs);
    var minY = Math.min.apply(null, ys);
    var maxY = Math.max.apply(null, ys);

    var cols = Math.max(2, maxX - minX + 1);
    var rows = Math.max(2, maxY - minY + 1);
    var cell = Math.min(34, Math.floor(310 / Math.max(cols, rows)));
    var ox = 56;
    var oy = 22;
    var html = '';

    for (var r = 0; r < rows; r++) {
      var yVal = maxY - r;
      var py = oy + r * cell;
      html += '<text x="' + (ox - 8) + '" y="' + (py + cell / 2 + 4) + '" text-anchor="end" font-size="10" font-family="monospace" font-weight="bold" fill="var(--study-ink)">' + yVal + '</text>';

      for (var c = 0; c < cols; c++) {
        var xVal = minX + c;
        var px = ox + c * cell;
        var isOn = points.some(function (p) {
          return p[0] === xVal && p[1] === yVal;
        });
        html += '<rect x="' + px + '" y="' + py + '" width="' + cell + '" height="' + cell + '" fill="' + (isOn ? 'var(--cg-svg-soft-blue)' : 'transparent') + '" stroke="var(--study-line)" stroke-width="1"/>';
        if (isOn) {
          html += '<circle cx="' + (px + cell / 2) + '" cy="' + (py + cell / 2) + '" r="' + Math.max(3, cell * 0.22) + '" fill="var(--study-accent)"/>';
        }
      }
    }

    for (var col = 0; col < cols; col++) {
      var xLabel = minX + col;
      var cx = ox + col * cell + cell / 2;
      html += '<text x="' + cx + '" y="' + (oy + rows * cell + 16) + '" text-anchor="middle" font-size="10" font-family="monospace" font-weight="bold" fill="var(--study-ink)">' + xLabel + '</text>';
    }

    svg.innerHTML = html;
  }

  function loadPresetLine(x0, y0, x1, y1) {
    var inpX0 = document.getElementById('inpX0');
    var inpY0 = document.getElementById('inpY0');
    var inpX1 = document.getElementById('inpX1');
    var inpY1 = document.getElementById('inpY1');
    if (inpX0) inpX0.value = String(x0);
    if (inpY0) inpY0.value = String(y0);
    if (inpX1) inpX1.value = String(x1);
    if (inpY1) inpY1.value = String(y1);
    solveCustomBresenham(x0, y0, x1, y1);
  }

  window.loadPresetLine = loadPresetLine;
  window.solveCustomBresenham = solveCustomBresenham;

  /* =========================================================================
   * 5. QUIZ ENGINE (34 QUESTIONS ACROSS #sec1..#sec6 AND #sec7)
   * ========================================================================= */
  var quizFocusTarget = null;

  function renderQuizCard(q, idx, prefix) {
    var chosen = userAnswers[q.id];
    var isAnswered = chosen !== undefined;
    var isCorrect = chosen === q.correct;
    var cardId = prefix + '-' + q.id;
    var promptText = q.qEn || q.question || '';
    var explanationText = q.ammiya || q.explanation || '';

    var optionsHtml = q.options
      .map(function (opt, oIdx) {
        var stateClass = '';
        var iconHtml = '';
        var isSelected = isAnswered && oIdx === chosen;
        if (isAnswered) {
          if (oIdx === q.correct) {
            stateClass = 'correct-choice';
            iconHtml = '<span class="cg-text-emerald font-bold" aria-hidden="true">✓</span>';
          } else if (oIdx === chosen) {
            stateClass = 'incorrect-choice';
            iconHtml = '<span class="cg-text-danger font-bold" aria-hidden="true">✗</span>';
          } else {
            stateClass = 'opacity-75';
          }
        }
        return (
          '<button type="button" data-q-id="' + q.id + '" data-opt-idx="' + oIdx + '" data-prefix="' + prefix + '" aria-pressed="' + (isSelected ? 'true' : 'false') + '" onclick="handleQuizAnswer(\'' + q.id + '\', ' + oIdx + ', \'' + prefix + '\')" class="quiz-opt-btn w-full text-left p-3 rounded-xl font-medium text-sm flex items-center justify-between gap-2 ' + stateClass + '" dir="ltr">' +
          '<span>' + opt + '</span>' +
          iconHtml +
          '</button>'
        );
      })
      .join('');

    var feedbackHtml = '';
    if (isAnswered) {
      var borderCls = isCorrect ? 'border-emerald-600' : 'border-amber-600';
      var titleCls = isCorrect ? 'cg-text-emerald' : 'cg-text-danger';
      var titleText = isCorrect
        ? '✅ إجابة صحيحة! عاش يا بطل (Explanation بالعامية):'
        : '❌ إجابة غير صحيحة — ولا يهمك، افهم الفكرة بالعامية المصرية:';
      feedbackHtml =
        '<div class="mt-3 p-4 rounded-xl border-r-4 ' + borderCls + ' subtle-surface ar-block space-y-1 text-sm">' +
        '<div class="font-extrabold ' + titleCls + '">' + titleText + '</div>' +
        '<p class="leading-relaxed">' + explanationText + '</p>' +
        '</div>';
    }

    var badgeText = q.type === 'MCQ' ? 'Multiple Choice' : 'True / False';
    var badgeTone = q.type === 'MCQ' ? 'cg-text-blue' : 'cg-text-purple';

    return (
      '<article id="' + cardId + '" class="card-surface rounded-xl p-5 space-y-3" data-qid="' + q.id + '" data-question-id="' + q.id + '">' +
      '<div class="flex items-center justify-between gap-2">' +
      '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold subtle-surface ' + badgeTone + '" dir="ltr">' + badgeText + '</span>' +
      '<span class="text-xs font-mono" style="color:var(--study-muted)" dir="ltr">#' + (idx + 1) + '</span>' +
      '</div>' +
      '<div class="font-bold text-base en-block" dir="ltr">' + promptText + '</div>' +
      '<div class="grid grid-cols-1 ' + (q.type === 'TF' ? 'sm:grid-cols-2' : '') + ' gap-2 pt-1">' +
      optionsHtml +
      '</div>' +
      feedbackHtml +
      '</article>'
    );
  }

  function renderAllQuizzes() {
    var questions = getQuestions();
    ['sec1', 'sec2', 'sec3', 'sec4', 'sec5', 'sec6'].forEach(function (sec) {
      var container = document.getElementById('quiz-' + sec);
      if (!container) return;
      var secQuestions = questions.filter(function (q) {
        return q.section === sec;
      });
      container.innerHTML = secQuestions
        .map(function (q, i) {
          return renderQuizCard(q, i, sec);
        })
        .join('');
    });

    var allContainer = document.getElementById('quiz-all');
    if (allContainer) {
      allContainer.innerHTML = questions
        .map(function (q, i) {
          return renderQuizCard(q, i, 'all');
        })
        .join('');
    }

    updateScoreUI();
  }

  function handleQuizAnswer(qId, selectedIndex, prefix) {
    userAnswers[qId] = selectedIndex;
    storage.setJSON(STORAGE_KEY_QUIZ, userAnswers);
    quizFocusTarget = { qId: qId, selectedIndex: selectedIndex, prefix: prefix || 'sec1' };
    renderAllQuizzes();

    var questions = getQuestions();
    var q = questions.find(function (item) {
      return item.id === qId;
    });
    var statusEl = document.getElementById('quiz-answer-status');
    if (statusEl && q) {
      var isCorrect = selectedIndex === q.correct;
      statusEl.textContent = (isCorrect ? 'إجابة صحيحة: ' : 'إجابة غير صحيحة: ') + (q.ammiya || '');
    }

    if (quizFocusTarget) {
      var selector =
        'button[data-q-id="' +
        quizFocusTarget.qId +
        '"][data-opt-idx="' +
        quizFocusTarget.selectedIndex +
        '"][data-prefix="' +
        quizFocusTarget.prefix +
        '"]';
      var targetBtn = document.querySelector(selector);
      if (!targetBtn) {
        targetBtn = document.querySelector(
          'button[data-q-id="' + quizFocusTarget.qId + '"][data-opt-idx="' + quizFocusTarget.selectedIndex + '"]'
        );
      }
      if (targetBtn) {
        targetBtn.focus();
      }
      quizFocusTarget = null;
    }
  }

  window.handleQuizAnswer = handleQuizAnswer;

  function updateScoreUI() {
    var questions = getQuestions();
    var total = questions.length;
    var correctCount = 0;
    var answeredCount = 0;

    questions.forEach(function (q) {
      if (userAnswers[q.id] !== undefined) {
        answeredCount++;
        if (userAnswers[q.id] === q.correct) correctCount++;
      }
    });

    var scoreBadge = document.getElementById('scoreBadge');
    if (scoreBadge) {
      scoreBadge.textContent = correctCount + ' / ' + total;
    }

    var progress = document.getElementById('globalQuizProgress');
    if (progress) {
      var pct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
      progress.style.width = pct + '%';
      progress.setAttribute('aria-valuenow', String(pct));
    }
  }

  /* =========================================================================
   * 6. SECTION NAVIGATION, READING CONTROLS, TOC DRAWER, BREADCRUMB
   * ========================================================================= */
  function setActiveSectionTab(secId) {
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      var target = btn.getAttribute('data-section') || btn.getAttribute('data-target');
      var isActive = target === secId;
      btn.classList.toggle('active', isActive);
      if (isActive) {
        btn.setAttribute('aria-current', 'true');
      } else {
        btn.removeAttribute('aria-current');
      }
    });
  }

  function switchSection(secId, options) {
    var opts = options || {};
    var targetEl = document.getElementById(secId);
    if (!targetEl) return;

    setActiveSectionTab(secId);

    if (opts.scroll !== false) {
      var prefersReducedMotion =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      targetEl.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  }

  window.switchSection = switchSection;

  function syncToolbarOffset() {
    var header = document.getElementById('mainReadingHeader');
    if (!header) return;
    var height = Math.ceil(header.getBoundingClientRect().height);
    if (height > 0) {
      document.documentElement.style.setProperty('--cg-toolbar-height', height + 'px');
    }
  }

  function setGraphicsBreadcrumb() {
    document.documentElement.setAttribute('data-study-course', 'computer-graphics');
    var breadcrumbs = document.querySelector('.study-portal-bar nav[aria-label="التنقل في المقرر"], .study-ActionBar-breadcrumbs');
    if (!breadcrumbs) return;

    breadcrumbs.innerHTML = '';

    var courseLink = document.createElement('a');
    courseLink.href = '../../subject.html?id=computer-graphics&kind=lectures';
    courseLink.textContent = 'الرسم بالحاسوب';

    var separator = document.createElement('span');
    separator.textContent = '/';
    separator.setAttribute('aria-hidden', 'true');

    var currentLecture = document.createElement('span');
    currentLecture.textContent = 'المحاضرة 3: أوليات الإخراج وخوارزمية بريزنهام';
    currentLecture.setAttribute('aria-current', 'page');

    breadcrumbs.append(courseLink, separator, currentLecture);
  }

  function revealTargetFromHash() {
    var rawHash = decodeURIComponent(window.location.hash || '').replace(/^#/, '');
    if (!rawHash) return;

    var target = document.getElementById(rawHash);
    if (!target) return;

    var section = target.classList.contains('study-section')
      ? target
      : target.closest('.study-section');

    if (section && section.id) {
      setActiveSectionTab(section.id);
    }

    syncToolbarOffset();
    requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }

  var fontScale = parseFloat(storage.getString(STORAGE_KEY_FONT, '1')) || 1;
  var lineHeights = [
    { val: '1.9', label: 'تباعد: عادي' },
    { val: '2.25', label: 'تباعد: مريح جداً' },
    { val: '2.55', label: 'تباعد: واسع للتركيز' }
  ];
  var currentSpacingIdx = parseInt(storage.getString(STORAGE_KEY_SPACING, '1'), 10);
  if (isNaN(currentSpacingIdx) || currentSpacingIdx < 0 || currentSpacingIdx >= lineHeights.length) {
    currentSpacingIdx = 1;
  }

  function applyReadingPrefs() {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
    var sp = lineHeights[currentSpacingIdx] || lineHeights[1];
    document.documentElement.style.setProperty('--reading-line-height', sp.val);
    var label = document.getElementById('fontSizeLabel');
    if (label) label.textContent = Math.round(fontScale * 100) + '%';
    var spBtn = document.getElementById('btnLineSpacing');
    if (spBtn) spBtn.textContent = sp.label;
  }

  function syncThemeControls() {
    var activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-reading', 'theme-sepia');
    document.body.classList.add('theme-' + activeTheme);

    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
      var isSelected = btn.getAttribute('data-theme-btn') === activeTheme;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
  }

  function setTheme(theme) {
    if (window.PortalTheme && typeof window.PortalTheme.set === 'function') {
      window.PortalTheme.set(theme);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      storage.setString('sem2_theme', theme);
    }
    syncThemeControls();
  }

  /* =========================================================================
   * 7. INITIALIZATION
   * ========================================================================= */
  document.addEventListener('DOMContentLoaded', function () {
    setGraphicsBreadcrumb();
    syncToolbarOffset();
    window.addEventListener('resize', syncToolbarOffset);

    applyReadingPrefs();
    syncThemeControls();

    var observer = new MutationObserver(syncThemeControls);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    renderScreenCoordSvg(2, 1);
    renderJaggiesSvg();
    renderD1D2Svg();
    renderSolvedExample();
    solveCustomBresenham(2, 3, 7, 6);
    renderAllQuizzes();

    // Font size controls
    var btnFontInc = document.getElementById('btnFontInc');
    var btnFontDec = document.getElementById('btnFontDec');
    if (btnFontInc) {
      btnFontInc.addEventListener('click', function () {
        fontScale = Math.min(1.35, +(fontScale + 0.08).toFixed(2));
        storage.setString(STORAGE_KEY_FONT, String(fontScale));
        applyReadingPrefs();
      });
    }
    if (btnFontDec) {
      btnFontDec.addEventListener('click', function () {
        fontScale = Math.max(0.85, +(fontScale - 0.08).toFixed(2));
        storage.setString(STORAGE_KEY_FONT, String(fontScale));
        applyReadingPrefs();
      });
    }

    // Line spacing control
    var btnLineSpacing = document.getElementById('btnLineSpacing');
    if (btnLineSpacing) {
      btnLineSpacing.addEventListener('click', function () {
        currentSpacingIdx = (currentSpacingIdx + 1) % lineHeights.length;
        storage.setString(STORAGE_KEY_SPACING, String(currentSpacingIdx));
        applyReadingPrefs();
      });
    }

    // Theme controls
    var btnThemeLight = document.getElementById('btnThemeLight');
    var btnThemeDark = document.getElementById('btnThemeDark');
    var btnThemeSepia = document.getElementById('btnThemeSepia');
    if (btnThemeLight) {
      btnThemeLight.addEventListener('click', function () {
        setTheme('light');
      });
    }
    if (btnThemeDark) {
      btnThemeDark.addEventListener('click', function () {
        setTheme('dark');
      });
    }
    if (btnThemeSepia) {
      btnThemeSepia.addEventListener('click', function () {
        setTheme('reading');
      });
    }

    // Top Navigation Pills
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var secId = btn.getAttribute('data-section') || btn.getAttribute('data-target');
        if (secId) switchSection(secId);
      });
    });

    // Solved Example Stepper Controls
    var btnExPrev = document.getElementById('btnExPrev');
    var btnExNext = document.getElementById('btnExNext');
    var btnExAll = document.getElementById('btnExAll');
    if (btnExPrev) {
      btnExPrev.addEventListener('click', function () {
        setExStep(currentExStep - 1);
      });
    }
    if (btnExNext) {
      btnExNext.addEventListener('click', function () {
        setExStep(currentExStep < 10 ? currentExStep + 1 : 1);
      });
    }
    if (btnExAll) {
      btnExAll.addEventListener('click', function () {
        setExStep(10);
      });
    }

    // Custom Solver Button
    var btnSolveCustom = document.getElementById('btnSolveCustom');
    if (btnSolveCustom) {
      btnSolveCustom.addEventListener('click', function () {
        var x0 = parseInt(document.getElementById('inpX0').value, 10) || 0;
        var y0 = parseInt(document.getElementById('inpY0').value, 10) || 0;
        var x1 = parseInt(document.getElementById('inpX1').value, 10) || 0;
        var y1 = parseInt(document.getElementById('inpY1').value, 10) || 0;
        solveCustomBresenham(x0, y0, x1, y1);
      });
    }

    // Reset All Quizzes Button
    var btnResetAllQuizzes = document.getElementById('btnResetAllQuizzes');
    if (btnResetAllQuizzes) {
      btnResetAllQuizzes.addEventListener('click', function () {
        userAnswers = {};
        storage.setJSON(STORAGE_KEY_QUIZ, userAnswers);
        renderAllQuizzes();
        var statusEl = document.getElementById('quiz-answer-status');
        if (statusEl) statusEl.textContent = 'تم تصفير جميع إجابات الكويزات.';
      });
    }

    // TOC Drawer Controls with Accessible Focus Return
    var tocDrawer = document.getElementById('sidebar-toc');
    var tocBackdrop = document.getElementById('toc-backdrop');
    var btnOpenToc = document.getElementById('btn-open-toc');
    var btnCloseToc = document.getElementById('btn-close-toc');

    var toggleToc = function (open, shouldReturnFocus) {
      if (!tocDrawer || !tocBackdrop) return;
      tocDrawer.classList.toggle('open', open);
      tocBackdrop.classList.toggle('open', open);
      if (btnOpenToc) btnOpenToc.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        if (btnCloseToc) btnCloseToc.focus();
      } else if (shouldReturnFocus && btnOpenToc) {
        btnOpenToc.focus();
      }
    };

    if (btnOpenToc) {
      btnOpenToc.addEventListener('click', function () {
        var isOpen = tocDrawer && tocDrawer.classList.contains('open');
        toggleToc(!isOpen, false);
      });
    }
    if (btnCloseToc) {
      btnCloseToc.addEventListener('click', function () {
        toggleToc(false, true);
      });
    }
    if (tocBackdrop) {
      tocBackdrop.addEventListener('click', function () {
        toggleToc(false, true);
      });
    }
    if (tocDrawer) {
      tocDrawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          var href = a.getAttribute('href') || '';
          if (href.startsWith('#sec')) {
            setActiveSectionTab(href.slice(1));
          }
          toggleToc(false, false);
        });
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && tocDrawer && tocDrawer.classList.contains('open')) {
        e.preventDefault();
        toggleToc(false, true);
      }
    });

    revealTargetFromHash();
    window.addEventListener('hashchange', revealTargetFromHash);
  });
})();
