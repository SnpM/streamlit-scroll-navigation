# streamlit-scroll-navigation

scroll_navbar is a Streamlit component that
enables scroll-based navigation for
seamless single-page applications. It features:

- Silky smooth scroll and anchor animations
- Configurable navbar icons
- Highly configurable CSS

## Installation

```sh
pip install streamlit-scroll-navigation
```

## Usage


## Examples

```python
# Create a dummy streamlit page 
import streamlit as st
from streamlit_scroll_navigation import scroll_navbar

# Dummy page setup
anchor_ids = ["About", "Features", "Settings", "Pricing", "Contact"]
anchor_icons = ["info-circle", "lightbulb", "gear", "tag", "envelope"]
for anchor_id in anchor_ids:
    st.subheader(anchor_id)
    st.write(["content "] * 100)

# 1. as sidebar menu
with st.sidebar:
    scroll_navbar(
        anchor_ids,
        anchor_icons=anchor_icons)

# 2. horizontal menu
scroll_navbar(
        anchor_ids,
        anchor_icons=anchor_icons,
        orientation="horizontal")

# 3. CSS style definitions
scroll_navbar(
    key="example_key",
    anchor_ids=["section1", "section2", "section3"],
    anchor_labels=["Section 1", "Section 2", "Section 3"],
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

# 4. Force anchor
force_body = None
if st.button("Go to Body"):
    force_body = "Body"
scroll_navbar(
        anchor_ids,
        anchor_icons=anchor_icons,
        orientation="horizontal",
        force_anchor=force_body)

# Retrieving active anchor
active_anchor = scroll_navbar(
    anchor_ids,
    orientation="horizontal")
st.write(f"{active_anchor} is active")
```

### Override Styles
The override_styles argument allows you to customize the styles for scroll_navbar component. This property accepts an object containing specific style overrides that will be merged with the base styles defined in the component. By using this option, you can modify the appearance of the navigation bar to better fit your design requirements.

Below is a list of style keys available for customization:

`navbarButtonBase:` Styles for the basic appearance of each navigation button.
`navbarButtonHorizontal:` Styles specific to horizontally oriented navigation buttons.
`navbarButtonVertical:` Styles specific to vertically oriented navigation buttons.
`navbarButtonActive:` Styles applied to the currently active navigation button.
`navbarButtonHover:` Styles applied to buttons when hovered.
`navigationBarBase:` Styles for the base navigation bar container.
`navigationBarHorizontal:` Styles specific to a horizontally oriented navigation bar.
`navigationBarVertical:` Styles specific to a vertically oriented navigation bar.

## Details
This component is built on React.
It uses parent DOM injection to enable cross-origin interactions.
The API and default aesthetic are inspired by victoryhb's [streamlit-option-menu](https://github.com/victoryhb/streamlit-option-menu).
