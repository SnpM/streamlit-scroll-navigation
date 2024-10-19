import streamlit as st
from scroll_navigation import scroll_navigation_bar

# Generate anchors
anchor_ids = []
for i in range(1, 11):
    anchor_ids.append(f"anchor{i}")
evens = range(1, len(anchor_ids), 2)
even_anchor_ids = [anchor_ids[i] for i in evens]
even_anchor_labels = [f"{i+1}" for i in evens]

with st.sidebar:
    force_anchor = None
    if st.button("Force Anchor 2"):
        force_anchor = "anchor2"
    scroll_navigation_bar(anchor_ids=anchor_ids, force_anchor=force_anchor)

scroll_navigation_bar(
    anchor_ids=even_anchor_ids,
    key="Othernavbar" ,
    anchor_labels=even_anchor_labels,
    anchor_icons=["gear", "heart", "star", "home", "camera", "cloud"],
    orientation="horizontal")
lorem_ipsum = """
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
"""
for anchor in anchor_ids:
    st.subheader(anchor,anchor=anchor)
    st.write(lorem_ipsum)
