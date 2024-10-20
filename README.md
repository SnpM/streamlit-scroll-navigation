# streamlit-custom-component

Streamlit component for scrollable navigation in single-page applications (i.e., scroll spy behavior).

## Installation instructions

```sh
pip install streamlit-custom-component
```

## Examples

```python
import streamlit as st
from streamlit_scroll_navigation import scroll_navigation_bar

# Dummy page setup
anchor_ids = ["Introduction", "Settings", "Body", "Report", "Conclusion"]
anchor_icons = ["house", "gear", "body", "clipboard", "door"]
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
```