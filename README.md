# streamlit-custom-component

Streamlit component for scrollable navigation in single-page applications (i.e., scrollspy behavior).

## Installation instructions

```sh
pip install streamlit-custom-component
```

## Usage instructions

`scroll_navigation_bar()` requires anchor_ids, a list of anchor ids to list for navigation.

```python
# Create a dummy streamlit page 
import streamlit as st
anchor_ids = [f"anchor {num}" for num in range(10)]]
for anchor in anchor_ids:
    st.subheader(anchor,anchor=anchor)
    st.write(["content "]*100)

# Add a scroll navigation bar for anchors
from screamlit_scroll_navigation import scroll_navigation_bar
with st.sidebar():
    scroll_navigation_bar(anchor_ids)```
```

### force_anchor

When setting force_anchor to an anchor's id, this argument simulates clicking on the navigation bar button corresponding to that anchor.

## Example
```sh
streamlit run example.py
```