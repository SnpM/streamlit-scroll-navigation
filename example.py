# Setup
import streamlit as st
from streamlit_scroll_navigation import scroll_navbar
st.set_page_config(page_title="Scroll Navigation Demo")

# Anchor IDs and icons
anchor_ids = ["About", "Features", "Settings", "Pricing", "Contact"]
anchor_icons = ["info-circle", "lightbulb", "gear", "tag", "envelope"]

# 1. vertical menu in sidebar
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

# 3. Custom anchor labels with no icons
st.subheader("Example 3")
scroll_navbar(
    anchor_ids,
    key="navbar3",
    anchor_labels=[
        "About Us - We're awesome!",
        "Features - Explore our Product",
        "Settings - Tailor your Experience",
        "Pricing - Spend Money to Make Money",
        "Get in Touch - We're here to help"
    ],
    orientation="horizontal")

# 4. CSS style definitions
st.subheader("Example 4")
scroll_navbar(
    anchor_ids=anchor_ids,
    key="navbar4",
    orientation="horizontal",
    override_styles={
        "navbarButtonBase": {
            "backgroundColor": "#007bff",  # Set a custom button background color
            "color": "#ffffff",  # Set custom text color
        },
        "navbarButtonHover": {
            "backgroundColor": "#0056b3",  # Set a custom hover color for the buttons
        },
        "navigationBarBase": {
            "backgroundColor": "#f8f9fa",  # Change the navigation bar background color
        }
    })

# 5. Force anchor
st.subheader("Example 5")
force_settings = None
if st.button("Go to Settings"):
    force_settings = "Settings"
scroll_navbar(
        anchor_ids,
        key="navbar5",
        anchor_icons=anchor_icons,
        orientation="horizontal",
        force_anchor=force_settings)

# 6. Retrieve active anchor
with st.sidebar:
    st.subheader("Example 6")
    active_anchor = scroll_navbar(
        anchor_ids,
        key="navbar6",
        orientation="vertical")
    st.write(f"{active_anchor} is active in Example 6")
    
# 7. Misc:
#   Disable automatic active anchor updates, instant scrolling
#   Instant snap scrolling
with st.sidebar:
    st.subheader("Example 7")
    scroll_navbar(
        anchor_ids=anchor_ids,
        key="navbar7",
        orientation="vertical",
        auto_update_anchor=False,
        disable_scroll=True)
    
# Dummy page setup
for anchor_id in anchor_ids:
    st.subheader(anchor_id,anchor=anchor_id)
    st.write("content " * 100)