# Setup
import streamlit as st
from streamlit_scroll_navigation import scroll_navbar

n = 20
anchors = [f"anchor{num}" for num in range(n)]

with st.sidebar:
    scroll_navbar(anchors)
    scroll_navbar(anchors, key="navbar2")

for anchor in anchors:
    st.subheader(anchor, anchor=anchor)
    st.write("content "*100)