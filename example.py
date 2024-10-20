import streamlit as st
from streamlit_scroll_navigation import scroll_navigation_bar

# Generate anchors
anchor_ids = []
for i in range(0, 10):
    anchor_ids.append(f"anchor{i}")
    
# Labels and icons for horizontal navigation bar
odds = range(1, len(anchor_ids), 2) # i.e. 1, 3, 5, 7, 9
odd_anchor_ids = [anchor_ids[i] for i in odds]
odd_anchor_labels = ["One", "Three", "Five", "Seven", "Nine"]

# Vertical navigation bar in sidebar
with st.sidebar:
    force_anchor = None
    if st.button("Force Anchor 2"):
        force_anchor = "anchor2"
    # anchor_ids is only required parameter
    # Setting force_anchor to a string will simulate clicking on an anchor
    scroll_navigation_bar(anchor_ids=anchor_ids, force_anchor=force_anchor)

# Horizontal navigation bar of even anchors
scroll_navigation_bar(
    anchor_ids=odd_anchor_ids,
    key="Othernavbar" ,
    anchor_labels=odd_anchor_labels,
    anchor_icons=["gear", "heart", "star", "cloud", "camera"],
    orientation="horizontal")


# Generate page content with anchors
lorem_ipsum = """
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
"""
for anchor in anchor_ids:
    st.subheader(anchor,anchor=anchor)
    st.write(lorem_ipsum)
