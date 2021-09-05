function getProp(props, key) {
    // Polyfill doesn't provide an array
    return typeof props.get(key) !== 'string' ? props.get(key)[0] : props.get(key);
  }
  
  /**
   * Calculate brightness value by RGB or HEX color.
   * @param color (String) The color value in RGB or HEX (for example: #000000 || #000 || rgb(0,0,0) || rgba(0,0,0,0))
   * @returns (Number) The brightness value (dark) 0 ... 255 (light)
   */
  function brightnessByColor(color) {
    color = '' + color;
    const isHEX = color.indexOf('#') === 0;
    const isRGB = color.indexOf('rgb') === 0;
  
    let r, g, b;
    if (isHEX) {
      const m = color.substr(1).match(color.length === 7 ? /(\S{2})/g : /(\S{1})/g);
      if (m) {
        r = parseInt(m[0], 16);
        g = parseInt(m[1], 16);
        b = parseInt(m[2], 16);
      }
    }
    if (isRGB) {
      const m = color.match(/(\d+){3}/g);
      if (m) {
        r = m[0];
        g = m[1];
        b = m[2];
      }
    }
    if (typeof r !== 'undefined') return (r * 299 + g * 587 + b * 114) / 1000;
  }
  
  // eslint-disable-next-line
  registerPaint(
    'speechifyHighlight',
    class {
      static get contextOptions() {
        return { alpha: true };
      }
  
      static get inputProperties() {
        return [
          '--speechifyHighlightWordInfo',
          '--speechifyHighlightSentenceInfo',
          '--speechifyElemColor',
        ];
      }
  
      paint(ctx, _, props) {
        const useDarkColors = brightnessByColor(getProp(props, '--speechifyElemColor')) > 160;
  
        const wordPositions = getProp(props, '--speechifyHighlightWordInfo')
          .split(',')
          .map(Number);
        const sentencePositions = getProp(props, '--speechifyHighlightSentenceInfo')
          .split(',')
          .map(Number);
  
        const wordVec4s = new Array(wordPositions.length / 4)
          .fill(0)
          .map((_, i) => wordPositions.slice(i * 4, i * 4 + 4));
  
        const sentenceVec4s = new Array(sentencePositions.length / 4)
          .fill(0)
          .map((_, i) => sentencePositions.slice(i * 4, i * 4 + 4));
  
        ctx.fillStyle = useDarkColors ? '#232f3d' : '#b4d5fe';
        for (const sentenceVec4 of sentenceVec4s) ctx.fillRect(...sentenceVec4);
  
        ctx.fillStyle = useDarkColors ? '#304866' : '#77b3fd';
        for (const wordVec4 of wordVec4s) ctx.fillRect(...wordVec4);
      }
    },
  );