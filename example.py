# Create a dummy streamlit page 
import streamlit as st
from streamlit_scroll_navigation import scroll_navbar

# Anchor IDs and icons
anchor_ids = ["About", "Features", "Settings", "Pricing", "Contact"]
anchor_icons = ["info-circle", "lightbulb", "gear", "tag", "envelope"]

# 1. as sidebar menu
with st.sidebar:
    scroll_navbar(
        anchor_ids,
        key="navbar1",
        anchor_icons=anchor_icons)

# 2. horizontal menu
scroll_navbar(
        anchor_ids,
        key = "navbar2",
        anchor_icons=anchor_icons,
        orientation="horizontal")

# 3. Custom anchor labels
scroll_navbar(
    anchor_ids,
    key="navbar3",
    anchor_labels=["About Us", "Our Features", "Settings", "Pricing", "Contact"],
    anchor_icons=anchor_icons,
    orientation="horizontal")

# 4. CSS style definitions
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
active_anchor = scroll_navbar(
    anchor_ids,
    key="navbar6",
    orientation="horizontal")
st.write(f"{active_anchor} is active")

# Dummy page setup
for anchor_id in anchor_ids:
    st.subheader(anchor_id)
    st.write("content " * 100)