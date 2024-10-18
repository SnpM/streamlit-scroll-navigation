import streamlit as st
from scroll_navigation import scroll_navigation


anchor_ids = ["anchor1", "anchor2", "anchor3", "anchor4"]

with st.sidebar:
    scroll_navigation(anchor_ids=anchor_ids)

lorem_ipsum = """
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
"""
for anchor in anchor_ids:
    st.subheader(anchor,anchor=anchor)
    st.write(lorem_ipsum)
