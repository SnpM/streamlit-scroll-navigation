# Create a dummy streamlit page 
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

# 3. Custom anchor labels with no icons
st.subheader("Example 3")
scroll_navbar(
    anchor_ids,
    key="navbar3",
    anchor_labels=["About Us", "The Features", "The Settings", "The Pricing", "Contact Us"],
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
    }
)

# 5. Force anchor
st.subheader("Example 5")
force_body = None
if st.button("Go to Body"):
    force_body = "Body"
scroll_navbar(
        anchor_ids,
        key="5",
        anchor_icons=anchor_icons,
        orientation="horizontal",
        force_anchor=force_body)

# 6. Retrieve active anchor
with st.sidebar:
    st.subheader("Example 6")
    active_anchor = scroll_navbar(
        anchor_ids,
        key="navbar6",
        orientation="vertical")
    st.write(f"{active_anchor} is active")

# Dummy page setup
for anchor_id in anchor_ids:
    st.subheader(anchor_id,anchor=anchor_id)
    st.write("content " * 100)