import streamlit as st
from scroll_navigation import scroll_navigation


anchor_ids = ["anchor1", "anchor2", "anchor3", "anchor4", "anchor5"]
for i in range(6, 11):
    anchor_ids.append(f"anchor{i}")
    
even_anchor_ids = anchor_ids[::2]

with st.sidebar:
    force_anchor = None
    if st.button("Force Anchor 2"):
        force_anchor = "anchor2"
    scroll_navigation(anchor_ids=anchor_ids, force_anchor=force_anchor)

scroll_navigation(anchor_ids=even_anchor_ids,
                  key="Othernavbar" ,
                  anchor_labels=["Apple", "Orange", "Banana", "Watermelon", "Grape", "Strawberry"], orientation="horizontal")
lorem_ipsum = """
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
"""
for anchor in anchor_ids:
    st.subheader(anchor,anchor=anchor)
    st.write(lorem_ipsum)
