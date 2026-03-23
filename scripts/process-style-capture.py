#!/usr/bin/env python3
"""
SPLOSE STYLE PROCESSOR
======================
Takes the JSON export from the recorder script and produces
an organised reference folder with:

  output/
    design-tokens/
      colours.md          - All colours found across the app
      typography.md       - Font families, sizes, weights
      spacing.md          - Common padding/margin values
      shadows.md          - Box shadows
      borders.md          - Border radii, widths, colours
      css-variables.md    - All CSS custom properties
    components/
      buttons.md          - Button styles
      inputs.md           - Form input styles
      cards.md            - Card/panel styles
      tables.md           - Table styles
      navigation.md       - Nav/sidebar/header styles
      modals.md           - Modal/dialog styles
      typography.md       - Heading and text styles
      misc.md             - Other component styles
    screenshots/
      {route-name}.jpg    - Screenshot per page
    page-structures/
      {route-name}.md     - DOM structure per page
    raw/
      all-css-rules.css   - Every CSS rule concatenated
      stylesheets.md      - Index of all stylesheets loaded
    summary.md            - Overview document for Claude

Usage:
    # v2 split format (data file + screenshot files):
    python3 process-style-capture.py splose-data-final.json [output_dir] [screenshot_files...]

    # v1 single-file format (still supported):
    python3 process-style-capture.py splose-styles-full.json [output_dir]

    # Examples:
    python3 process-style-capture.py splose-data-final.json splose-style-reference splose-screenshots-*.json
    python3 process-style-capture.py splose-data-final.json splose-style-reference
"""

import json
import glob as globmod
import os
import sys
import re
import base64
from collections import Counter, defaultdict
from pathlib import Path


def sanitise_route(route):
    """Turn a URL route into a safe filename."""
    route = route.strip('/')
    if not route:
        return 'home'
    return re.sub(r'[^a-zA-Z0-9_-]', '_', route)[:80]


def extract_colours(captures):
    """Extract all unique colours from computed styles."""
    colour_counter = Counter()
    colour_usage = defaultdict(set)  # colour -> set of contexts

    for page in captures:
        for el in page.get('computedStyles', []):
            styles = el.get('computedStyles', {})
            for prop in ['color', 'backgroundColor', 'borderColor']:
                val = styles.get(prop, '')
                if val and val != 'rgba(0, 0, 0, 0)' and val != 'transparent':
                    colour_counter[val] += 1
                    context = f"{el.get('tagName', '?')}.{el.get('className', '').split()[0] if el.get('className') else '?'}"
                    colour_usage[val].add(f"{prop} on {context}")

    return colour_counter, colour_usage


def extract_typography(captures):
    """Extract all font-related values."""
    fonts = Counter()
    sizes = Counter()
    weights = Counter()
    line_heights = Counter()

    for page in captures:
        for el in page.get('computedStyles', []):
            styles = el.get('computedStyles', {})
            if styles.get('fontFamily'):
                fonts[styles['fontFamily']] += 1
            if styles.get('fontSize'):
                sizes[styles['fontSize']] += 1
            if styles.get('fontWeight'):
                weights[styles['fontWeight']] += 1
            if styles.get('lineHeight'):
                line_heights[styles['lineHeight']] += 1

    return fonts, sizes, weights, line_heights


def extract_spacing(captures):
    """Extract common spacing values (padding, margin, gap)."""
    paddings = Counter()
    margins = Counter()
    gaps = Counter()

    for page in captures:
        for el in page.get('computedStyles', []):
            styles = el.get('computedStyles', {})
            for direction in ['Top', 'Right', 'Bottom', 'Left']:
                p = styles.get(f'padding{direction}', '')
                m = styles.get(f'margin{direction}', '')
                if p and p != '0px':
                    paddings[p] += 1
                if m and m != '0px':
                    margins[m] += 1
            if styles.get('gap') and styles['gap'] != 'normal':
                gaps[styles['gap']] += 1

    return paddings, margins, gaps


def extract_shadows(captures):
    """Extract unique box shadows."""
    shadows = Counter()
    for page in captures:
        for el in page.get('computedStyles', []):
            val = el.get('computedStyles', {}).get('boxShadow', '')
            if val and val != 'none':
                shadows[val] += 1
    return shadows


def extract_borders(captures):
    """Extract border radii and styles."""
    radii = Counter()
    borders = Counter()
    for page in captures:
        for el in page.get('computedStyles', []):
            styles = el.get('computedStyles', {})
            if styles.get('borderRadius') and styles['borderRadius'] != '0px':
                radii[styles['borderRadius']] += 1
            if styles.get('border') and styles['border'] != '0px none rgb(0, 0, 0)':
                borders[styles['border']] += 1
    return radii, borders


def extract_css_variables(captures):
    """Merge CSS variables from all pages."""
    variables = {}
    for page in captures:
        css = page.get('css', {})
        for name, value in css.get('cssVariables', {}).items():
            variables[name] = value
    return variables


def categorise_element(el):
    """Categorise an element into a component type."""
    tag = el.get('tagName', '').lower()
    cls = (el.get('className', '') or '').lower()
    selector = (el.get('selector', '') or '').lower()

    if tag == 'button' or 'btn' in cls or 'button' in cls:
        return 'buttons'
    if tag in ('input', 'select', 'textarea') or 'input' in cls or 'field' in cls:
        return 'inputs'
    if 'card' in cls or 'panel' in cls or 'paper' in cls:
        return 'cards'
    if tag in ('table', 'th', 'td', 'tr') or 'table' in cls or 'grid' in cls:
        return 'tables'
    if tag in ('nav', 'header') or 'nav' in cls or 'sidebar' in cls or 'header' in cls or 'menu' in cls:
        return 'navigation'
    if 'modal' in cls or 'dialog' in cls or 'drawer' in cls:
        return 'modals'
    if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p') or 'text' in cls or 'title' in cls:
        return 'typography'
    return 'misc'


def format_counter(counter, limit=30):
    """Format a Counter as a markdown list sorted by frequency."""
    lines = []
    for val, count in counter.most_common(limit):
        lines.append(f"- `{val}` (used {count} times)")
    return '\n'.join(lines)


def write_design_tokens(captures, output_dir):
    """Write design token files."""
    tokens_dir = output_dir / 'design-tokens'
    tokens_dir.mkdir(parents=True, exist_ok=True)

    # Colours
    colour_counter, colour_usage = extract_colours(captures)
    with open(tokens_dir / 'colours.md', 'w') as f:
        f.write("# Colour Tokens\n\n")
        f.write("All colours extracted from the Splose app, sorted by frequency of use.\n\n")
        for val, count in colour_counter.most_common(80):
            usages = list(colour_usage[val])[:5]
            usage_str = ', '.join(usages)
            f.write(f"- `{val}` -- used {count} times -- {usage_str}\n")

    # Typography
    fonts, sizes, weights, line_heights = extract_typography(captures)
    with open(tokens_dir / 'typography.md', 'w') as f:
        f.write("# Typography Tokens\n\n")
        f.write("## Font Families\n\n")
        f.write(format_counter(fonts) + "\n\n")
        f.write("## Font Sizes\n\n")
        f.write(format_counter(sizes) + "\n\n")
        f.write("## Font Weights\n\n")
        f.write(format_counter(weights) + "\n\n")
        f.write("## Line Heights\n\n")
        f.write(format_counter(line_heights) + "\n\n")

    # Spacing
    paddings, margins, gaps = extract_spacing(captures)
    with open(tokens_dir / 'spacing.md', 'w') as f:
        f.write("# Spacing Tokens\n\n")
        f.write("## Padding Values\n\n")
        f.write(format_counter(paddings) + "\n\n")
        f.write("## Margin Values\n\n")
        f.write(format_counter(margins) + "\n\n")
        f.write("## Gap Values\n\n")
        f.write(format_counter(gaps) + "\n\n")

    # Shadows
    shadows = extract_shadows(captures)
    with open(tokens_dir / 'shadows.md', 'w') as f:
        f.write("# Box Shadow Tokens\n\n")
        f.write(format_counter(shadows) + "\n\n")

    # Borders
    radii, borders = extract_borders(captures)
    with open(tokens_dir / 'borders.md', 'w') as f:
        f.write("# Border Tokens\n\n")
        f.write("## Border Radii\n\n")
        f.write(format_counter(radii) + "\n\n")
        f.write("## Border Styles\n\n")
        f.write(format_counter(borders) + "\n\n")

    # CSS Variables
    variables = extract_css_variables(captures)
    with open(tokens_dir / 'css-variables.md', 'w') as f:
        f.write("# CSS Custom Properties (Variables)\n\n")
        f.write("All CSS variables defined on :root across the app.\n\n")
        # Group by prefix
        groups = defaultdict(list)
        for name, value in sorted(variables.items()):
            prefix = name.split('-')[2] if len(name.split('-')) > 2 else 'other'
            groups[prefix].append((name, value))
        for prefix, props in sorted(groups.items()):
            f.write(f"## {prefix}\n\n")
            for name, value in props:
                f.write(f"- `{name}`: `{value}`\n")
            f.write("\n")


def write_component_styles(captures, output_dir):
    """Write component-level style reference files."""
    comp_dir = output_dir / 'components'
    comp_dir.mkdir(parents=True, exist_ok=True)

    # Group elements by component type
    components = defaultdict(list)
    for page in captures:
        for el in page.get('computedStyles', []):
            cat = categorise_element(el)
            components[cat].append({
                'page': page.get('route', ''),
                **el,
            })

    for cat, elements in components.items():
        with open(comp_dir / f'{cat}.md', 'w') as f:
            f.write(f"# {cat.title()} Component Styles\n\n")
            f.write(f"Extracted from {len(elements)} element instances across the app.\n\n")

            # Deduplicate by class name to show unique variants
            seen_classes = set()
            for el in elements:
                cls_key = el.get('className', '')[:100]
                if cls_key in seen_classes:
                    continue
                seen_classes.add(cls_key)

                f.write(f"### `<{el.get('tagName', '?')}>` on {el.get('page', '?')}\n\n")
                if el.get('className'):
                    f.write(f"**Class:** `{el['className'][:200]}`\n\n")
                if el.get('textPreview'):
                    f.write(f"**Text preview:** {el['textPreview']}\n\n")

                styles = el.get('computedStyles', {})
                f.write("```css\n")
                for prop, val in sorted(styles.items()):
                    if val and val != 'none' and val != 'normal' and val != 'auto' \
                       and val != '0px' and val != 'rgba(0, 0, 0, 0)' \
                       and val != 'static' and val != 'visible':
                        # Convert camelCase to kebab-case
                        kebab = re.sub(r'([A-Z])', r'-\1', prop).lower()
                        f.write(f"{kebab}: {val};\n")
                f.write("```\n\n---\n\n")


def write_screenshots(captures, output_dir, screenshot_items=None):
    """Save screenshots as image files.

    Supports two formats:
    - v1: screenshots embedded in captures as page.screenshot
    - v2: screenshots passed separately as screenshot_items list of {route, screenshot}
    """
    ss_dir = output_dir / 'screenshots'
    ss_dir.mkdir(parents=True, exist_ok=True)

    index_lines = ["# Screenshots Index\n\n"]
    saved_count = 0

    # Build a lookup from route to page data for titles/viewports
    page_lookup = {}
    for page in captures:
        page_lookup[page.get('route', '')] = page

    # Collect all screenshot entries from both sources
    entries = []

    # v1 format: screenshots embedded in captures
    for page in captures:
        screenshot = page.get('screenshot')
        if screenshot:
            entries.append({
                'route': page.get('route', 'unknown'),
                'screenshot': screenshot,
            })

    # v2 format: separate screenshot items
    if screenshot_items:
        for item in screenshot_items:
            if item.get('screenshot'):
                entries.append(item)

    for entry in entries:
        route = entry.get('route', 'unknown')
        screenshot = entry['screenshot']
        route_name = sanitise_route(route)
        filename = f"{route_name}.jpg"

        # Strip data URL prefix
        if ',' in screenshot:
            img_data = screenshot.split(',', 1)[1]
        else:
            img_data = screenshot

        try:
            with open(ss_dir / filename, 'wb') as f:
                f.write(base64.b64decode(img_data))
            saved_count += 1

            page = page_lookup.get(route, {})
            index_lines.append(f"## {route}\n\n")
            index_lines.append(f"**Title:** {page.get('title', 'N/A')}\n\n")
            vp = page.get('viewport', {})
            index_lines.append(f"**Viewport:** {vp.get('width', '?')}x{vp.get('height', '?')}\n\n")
            index_lines.append(f"![{route_name}]({filename})\n\n---\n\n")
        except Exception as e:
            print(f"  Warning: Could not save screenshot for {route_name}: {e}")

    with open(ss_dir / 'index.md', 'w') as f:
        f.writelines(index_lines)

    return saved_count


def write_page_structures(captures, output_dir):
    """Write simplified DOM structures."""
    struct_dir = output_dir / 'page-structures'
    struct_dir.mkdir(parents=True, exist_ok=True)

    def render_tree(node, indent=0):
        if not node or not isinstance(node, dict):
            return ''
        tag = node.get('tag', '?')
        cls = node.get('className', '')
        id_str = node.get('id', '')
        role = node.get('role', '')

        label_parts = [f"<{tag}>"]
        if id_str:
            label_parts.append(f'id="{id_str}"')
        if cls:
            # Show first 3 classes
            classes = cls.split()[:3]
            label_parts.append(f'class="{" ".join(classes)}"')
        if role:
            label_parts.append(f'role="{role}"')

        prefix = '  ' * indent
        line = prefix + ' '.join(label_parts)

        if node.get('text'):
            line += f'  "{node["text"]}"'

        lines = [line]
        for child in node.get('children', []):
            child_str = render_tree(child, indent + 1)
            if child_str:
                lines.append(child_str)
        return '\n'.join(lines)

    for page in captures:
        route_name = sanitise_route(page.get('route', 'unknown'))
        dom = page.get('domStructure')
        if not dom:
            continue

        with open(struct_dir / f'{route_name}.md', 'w') as f:
            f.write(f"# Page Structure: {page.get('route', '/')}\n\n")
            f.write(f"**Title:** {page.get('title', 'N/A')}\n\n")
            f.write(f"**URL:** {page.get('url', 'N/A')}\n\n")
            f.write("```\n")
            f.write(render_tree(dom))
            f.write("\n```\n")


def write_raw_css(captures, output_dir):
    """Write concatenated CSS rules and stylesheet index."""
    raw_dir = output_dir / 'raw'
    raw_dir.mkdir(parents=True, exist_ok=True)

    all_rules = set()
    stylesheet_index = ["# Stylesheet Index\n\n"]
    seen_hrefs = set()

    for page in captures:
        css = page.get('css', {})
        for sheet in css.get('stylesheets', []):
            href = sheet.get('href', '(inline)')
            if href not in seen_hrefs:
                seen_hrefs.add(href)
                blocked = ' (CORS blocked)' if sheet.get('blocked') else ''
                rule_count = len(sheet.get('rules', []))
                stylesheet_index.append(f"- `{href}` -- {rule_count} rules{blocked}\n")

            for rule in sheet.get('rules', []):
                all_rules.add(rule)

        for inline in css.get('inlineStyles', []):
            content = inline.get('content', '')
            if content.strip():
                all_rules.add(f"/* Inline style block */\n{content}")

    with open(raw_dir / 'all-css-rules.css', 'w') as f:
        f.write("/* All CSS rules extracted from Splose app */\n")
        f.write(f"/* Total unique rules: {len(all_rules)} */\n\n")
        for rule in sorted(all_rules):
            f.write(rule + '\n\n')

    with open(raw_dir / 'stylesheets.md', 'w') as f:
        f.writelines(stylesheet_index)


def write_summary(captures, output_dir, variables):
    """Write a summary document for Claude to use as reference."""
    colour_counter, _ = extract_colours(captures)
    fonts, sizes, weights, _ = extract_typography(captures)
    shadows = extract_shadows(captures)
    radii, _ = extract_borders(captures)

    routes = [p.get('route', '/') for p in captures]

    with open(output_dir / 'summary.md', 'w') as f:
        f.write("# Splose App Style Reference -- Summary\n\n")
        f.write(f"**Exported:** {captures[0].get('timestamp', 'N/A') if captures else 'N/A'}\n\n")
        f.write(f"**Base URL:** {captures[0].get('url', '').split('/')[0:3] if captures else 'N/A'}\n\n")
        f.write(f"**Pages captured:** {len(captures)}\n\n")

        f.write("## Routes Captured\n\n")
        for route in sorted(routes):
            f.write(f"- `{route}`\n")
        f.write("\n")

        f.write("## Quick Reference: Key Design Tokens\n\n")

        f.write("### Primary Colours (top 15)\n\n")
        for val, count in colour_counter.most_common(15):
            f.write(f"- `{val}` ({count} uses)\n")
        f.write("\n")

        f.write("### Font Families\n\n")
        for val, count in fonts.most_common(5):
            f.write(f"- `{val}` ({count} uses)\n")
        f.write("\n")

        f.write("### Font Sizes (top 10)\n\n")
        for val, count in sizes.most_common(10):
            f.write(f"- `{val}` ({count} uses)\n")
        f.write("\n")

        f.write("### Border Radii\n\n")
        for val, count in radii.most_common(10):
            f.write(f"- `{val}` ({count} uses)\n")
        f.write("\n")

        f.write("### Box Shadows (top 5)\n\n")
        for val, count in shadows.most_common(5):
            f.write(f"- `{val}`\n")
        f.write("\n")

        if variables:
            f.write("### Key CSS Variables (first 30)\n\n")
            for i, (name, value) in enumerate(sorted(variables.items())):
                if i >= 30:
                    f.write(f"\n... and {len(variables) - 30} more (see design-tokens/css-variables.md)\n")
                    break
                f.write(f"- `{name}`: `{value}`\n")
            f.write("\n")

        f.write("## Folder Guide\n\n")
        f.write("- **design-tokens/**: Colours, typography, spacing, shadows, borders, CSS variables\n")
        f.write("- **components/**: Computed styles grouped by component type (buttons, inputs, cards, etc.)\n")
        f.write("- **screenshots/**: Visual reference image per page\n")
        f.write("- **page-structures/**: Simplified DOM tree per page\n")
        f.write("- **raw/**: All CSS rules concatenated plus stylesheet index\n")
        f.write("\n")
        f.write("## Usage Tips for Claude\n\n")
        f.write("When recreating Splose UI in a React prototype:\n\n")
        f.write("1. Start with **css-variables.md** to set up your CSS custom properties\n")
        f.write("2. Reference **colours.md** and **typography.md** for exact token values\n")
        f.write("3. Check **components/{type}.md** for the computed styles of specific elements\n")
        f.write("4. Use **screenshots/** as visual targets to match against\n")
        f.write("5. Use **page-structures/** to understand layout hierarchy\n")


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 process-style-capture.py <data_json> [output_dir] [screenshot_json_files...]")
        print("")
        print("Examples:")
        print("  python3 process-style-capture.py splose-data-final.json")
        print("  python3 process-style-capture.py splose-data-final.json splose-style-reference splose-screenshots-*.json")
        print("  python3 process-style-capture.py splose-styles-full.json  (v1 single-file format)")
        sys.exit(1)

    json_path = sys.argv[1]

    # Figure out output dir and screenshot files from remaining args
    output_dir = Path('splose-style-reference')
    screenshot_files = []

    remaining_args = sys.argv[2:]
    if remaining_args:
        # First non-json arg is the output dir, rest are screenshot files
        # But also support glob patterns that the shell may have expanded
        first = remaining_args[0]
        if first.endswith('.json'):
            # All args are screenshot files, use default output dir
            screenshot_files = remaining_args
        else:
            output_dir = Path(first)
            screenshot_files = remaining_args[1:]

    # Expand any glob patterns in screenshot files
    expanded_ss_files = []
    for pattern in screenshot_files:
        matches = globmod.glob(pattern)
        if matches:
            expanded_ss_files.extend(sorted(matches))
        else:
            expanded_ss_files.append(pattern)
    screenshot_files = expanded_ss_files

    # ── Load main data file ───────────────────────────────────
    print(f"Loading {json_path}...")
    with open(json_path, 'r') as f:
        data = json.load(f)

    captures = data.get('captures', [])
    print(f"Found {len(captures)} page captures")

    # ── Handle rescue-v3-lean format (sharedCSS at top level) ─
    shared_css = data.get('sharedCSS')
    if shared_css:
        print("Detected rescue-v3-lean format (shared CSS)")
        print(f"  Stylesheets: {len(shared_css.get('stylesheets', []))}")
        print(f"  Inline styles: {len(shared_css.get('inlineStyles', []))}")
        print(f"  CSS variables: {len(shared_css.get('cssVariables', {}))}")
        # Inject sharedCSS into every capture so the rest of the pipeline works
        for cap in captures:
            if 'css' not in cap or not cap['css']:
                cap['css'] = shared_css

    if not captures:
        print("No captures found in the file!")
        sys.exit(1)

    # ── Load screenshot files (v2 split format) ───────────────
    all_screenshots = []
    if screenshot_files:
        print(f"Loading {len(screenshot_files)} screenshot file(s)...")
        for ss_path in screenshot_files:
            try:
                with open(ss_path, 'r') as f:
                    ss_data = json.load(f)
                items = ss_data.get('screenshots', [])
                all_screenshots.extend(items)
                print(f"  {ss_path}: {len(items)} screenshots")
            except Exception as e:
                print(f"  Warning: Could not load {ss_path}: {e}")
        print(f"Total screenshots loaded: {len(all_screenshots)}")
    else:
        # Check if this is a v1 file with embedded screenshots
        embedded = sum(1 for p in captures if p.get('screenshot'))
        if embedded:
            print(f"Found {embedded} embedded screenshots (v1 format)")

    # Also auto-discover screenshot files next to the data file
    if not screenshot_files and not any(p.get('screenshot') for p in captures):
        data_dir = Path(json_path).parent
        auto_found = sorted(data_dir.glob('splose-screenshots-*.json'))
        if auto_found:
            print(f"Auto-discovered {len(auto_found)} screenshot file(s) next to data file:")
            for ss_path in auto_found:
                try:
                    with open(ss_path, 'r') as f:
                        ss_data = json.load(f)
                    items = ss_data.get('screenshots', [])
                    all_screenshots.extend(items)
                    print(f"  {ss_path}: {len(items)} screenshots")
                except Exception as e:
                    print(f"  Warning: Could not load {ss_path}: {e}")
            print(f"Total screenshots loaded: {len(all_screenshots)}")

    print(f"Output directory: {output_dir}")
    output_dir.mkdir(parents=True, exist_ok=True)

    variables = extract_css_variables(captures)

    print("Writing design tokens...")
    write_design_tokens(captures, output_dir)

    print("Writing component styles...")
    write_component_styles(captures, output_dir)

    print("Saving screenshots...")
    total_screenshots = write_screenshots(captures, output_dir, all_screenshots if all_screenshots else None)

    print("Writing page structures...")
    write_page_structures(captures, output_dir)

    print("Writing raw CSS...")
    write_raw_css(captures, output_dir)

    print("Writing summary...")
    write_summary(captures, output_dir, variables)

    # Quick stats
    total_colours = len(extract_colours(captures)[0])
    total_vars = len(variables)

    print("\n" + "=" * 50)
    print("DONE!")
    print(f"  Pages:       {len(captures)}")
    print(f"  Colours:     {total_colours} unique")
    print(f"  CSS vars:    {total_vars}")
    print(f"  Screenshots: {total_screenshots}")
    print(f"  Output:      {output_dir}/")
    print("=" * 50)


if __name__ == '__main__':
    main()
