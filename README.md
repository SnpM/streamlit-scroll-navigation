# streamlit-scroll-navigation

scroll_navigation_bar is a Streamlit component that
gives developers scroll navigation to create
seamless single-page sites. It features:

- Silky smooth scroll and anchor animations
- Configurable icons for each navigation option
- Highly configurable CSS

## Installation instructions

```sh
pip install streamlit-scroll-navigation
```

## Examples

```python
import streamlit as st
from streamlit_scroll_navigation import scroll_navigation_bar

# Dummy page setup
anchor_ids = ["About", "Features", "Settings", "Pricing", "Contact"]
anchor_icons = ["info-circle", "lightbulb", "gear", "tag", "envelope"]
for anchor_id in anchor_ids:
    st.subheader(anchor_id)
    st.write(["content "] * 100)

# 1. as sidebar menu
with st.sidebar:
    scroll_navigation_bar(
        anchor_ids,
        anchor_icons=anchor_icons)

# 2. horizontal menu
scroll_navigation_bar(
        anchor_ids,
        anchor_icons=anchor_icons,
        orientation="horizontal")

# 3. CSS style definitions

# 4. Force anchor
force_body = None
if st.button("Go to Body"):
    force_body = "Body"
scroll_navigation_bar(
        anchor_ids,
        anchor_icons=anchor_icons,
        orientation="horizontal",
        force_anchor=force_body)

# Retrieving active anchor
active_anchor = scroll_navigation_bar(
    anchor_ids,
    orientation="horizontal")
st.write(f"{active_anchor} is active")
```

## Details
This component is built on React.
It uses parent DOM injection to enable cross-origin interactions.
The API and default aesthetic are inspired by victoryhb's [streamlit-option-menu](https://github.com/victoryhb/streamlit-option-menu).
