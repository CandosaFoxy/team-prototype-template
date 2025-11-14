/**
 * This script automatically fetches your 'tokens.json' file,
 * converts all your tokens into CSS variables, and
 * injects them into the <head> of your prototype.
 */

// This function runs when the page loads
document.addEventListener('DOMContentLoaded', () => {
  loadDesignTokens();
});

async function loadDesignTokens() {
  try {
    // 1. Fetch the tokens.json file
    const response = await fetch('tokens.json');
    if (!response.ok) {
      throw new Error('Could not load tokens.json');
    }
    const tokens = await response.json();

    // 2. Create a <style> tag to hold our variables
    const styleTag = document.createElement('style');
    styleTag.id = 'figma-design-tokens';

    // 3. Build the CSS string
    let cssString = ':root {\n';

    // This function recursively finds all tokens
    function parseTokens(obj, path = '') {
      for (const key in obj) {
        const newPath = path ? `${path}-${key}` : key;
        const value = obj[key];

        if (typeof value === 'object' && value.value) {
          // This is a design token
          const cssVarName = `--${newPath.replace(/\./g, '-')}`;
          cssString += `  ${cssVarName}: ${value.value};\n`;
        } else if (typeof value === 'object' && !value.value) {
          // This is a group, dig deeper
          parseTokens(value, newPath);
        }
      }
    }

    // Start parsing from the top level
    parseTokens(tokens);

    cssString += '}'; // Close :root

    // 4. Add the CSS string to the <style> tag
    styleTag.innerHTML = cssString;

    // 5. Add the <style> tag to the document's <head>
    document.head.appendChild(styleTag);

  } catch (error) {
    console.error('Error loading design tokens:', error);
  }
}