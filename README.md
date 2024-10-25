# streamlit-scroll-navigation

This package enables scroll-based navigation for
seamless single-page Streamlit applications.
Use it for portfolios, data stories, or any Streamlit application that presents multiple sections on the same page. It features:

* **Smooth Animations**: Scrolling to anchors on the page feels fluid and seamless.
* **Anchor tracking**: As the user scrolls, the active anchor automatically updates to the nearest visible anchor.
* **Configurable Icons**: Customize Bootstrap icons for each navigation option to give your app a personal touch.
* **Customizable Styles**: Edit CSS attributes with the override_styles parameter for additional customization.
* **Styled with Bootstrap**: The component comes styled with Bootstrap for a sleek and responsive design.

Video demo:

https://github.com/user-attachments/assets/7c353b89-bbc7-4795-80ac-aef0c808c725

App demo: https://scrollnav-demo.streamlit.app/

## Installation

```sh
pip install streamlit-scroll-navigation
```

## Usage

`scroll_navbar()` creates a navigation bar with buttons that scroll the page to anchor IDs. It is highly customizable, supporting various orientations, labels, icons, and styles. 

- `anchor_ids` ( `Collection[str]` ):  
  A collection of anchor IDs that represent the sections or points to navigate to.
  **Required**.

- `key` ( `str`, optional ):  
  A unique key for the component. Each navbar must have a unique key for cross-origin message handling.  
  **Default**: `'scroll_navbar_default'`.

- `anchor_icons` ( `Collection[str]`, optional ):  
  Icons corresponding to each navigation button. The order of icons provided should correspond to the order of `anchor_ids`. If not provided, no icons will be displayed.  
  **Default**: `None`.

- `anchor_labels` ( `Collection[str]`, optional ):  
  Labels for each navigation button. The order of labels provided should correspond to the order of `anchor_ids`. If not provided, the anchor IDs will be used as labels.  
  **Default**: `None`.

- `force_anchor` ( `str`, optional ):  
  A specific anchor ID to automatically navigate to. This simulates clicking on an anchor.  
  **Default**: `None`.

- `orientation` ( `Literal['vertical', 'horizontal']`, optional ):  
  The orientation of the navigation bar, either `vertical` or `horizontal`.  
  **Default**: `'vertical'`.

- `override_styles` ( `Dict[str, str]`, optional ):  
  A dictionary to override the default styles of the component, allowing further customization.  
  **Default**: `{}`.

- `auto_update_anchor` ( `bool`, optional ):  
  If true, the highlighted anchor will automatically update to the next nearest anchor when the current one is scrolled out of view.  
  **Default**: `True`.
  
- `disable_scroll` (`bool`, optional):
  If True, navigation will snap instantly to anchors.
  **Default**: `False`.

## Examples

```python
import streamlit as st
from streamlit_scroll_navigation import scroll_navbar

# Anchor IDs and icons
anchor_ids = ["About", "Features", "Settings", "Pricing", "Contact"]
anchor_icons = ["info-circle", "lightbulb", "gear", "tag", "envelope"]

# 1. as sidebar menu
with st.sidebar:
    st.subheader("Example 1")
    scroll_navbar(
        anchor_ids,
        anchor_labels=None, # Use anchor_ids as labels
        anchor_icons=anchor_icons)

# 2. horizontal menu
st.subheader("Example 2")
scroll_navbar(
        anchor_ids,
        key = "navbar2",
        anchor_icons=anchor_icons,
        orientation="horizontal")

# Dummy page setup
for anchor_id in anchor_ids:
    st.subheader(anchor_id,anchor=anchor_id)
    st.write("content " * 100)
```

### Styles Overrides
The `override_styles` argument allows you to customize the styles for scroll_navbar component. This property accepts an object containing specific style overrides that will be merged with the base styles defined in the component. By using this option, you can modify the appearance of the navigation bar to better fit your design requirements.

Below is a list of style keys available for customization:

- `navbarButtonBase`: Base button styling with dark background, white text, pointer cursor, and smooth color transitions.
- `navbarButtonHorizontal` & `navbarButtonVertical`: Orientation-specific properties for horizontal or vertical button alignment.
- `navbarButtonActive`: Style for active anchor buttons. Sets the background color and font weight.
- `navbarButtonHover`: Style for hovered buttons. Sets the background colors and font weight.
- `navigationBarBase`: Core styling for the navigation bar container, setting background, padding, and flexbox layout.
- `navigationBarHorizontal` & `navigationBarVertical`: Orientation-specific properties for the navigation bar.
- `anchorEmphasis`: Style for emphasizing the anchor after a delay. Scales up the element slightly for visual emphasis.

## Contributions

Contributions are welcome! If you’d like to contribute, follow these steps:

1. Fork [the repository](https://github.com/SnpM/streamlit-scroll-navigation).
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear messages.
4. Open a pull request, and provide a detailed description of your changes.

Feel free to create issues or feature requests as well.

This component is built on React.
It uses parent DOM injection to enable cross-origin interactions (see [`__init__.py`](https://github.com/SnpM/streamlit-scroll-navigation/blob/main/streamlit_scroll_navigation/__init__.py)).
The API and styles are inspired by victoryhb's [streamlit-option-menu](https://github.com/victoryhb/streamlit-option-menu).

