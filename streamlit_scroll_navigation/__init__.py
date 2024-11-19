import os
import streamlit.components.v1 as components
from typing import *
import requests
import streamlit as st

dev_url = "http://localhost:3000"
parent_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(parent_dir, "frontend/build")

_RELEASE = True
COMPONENT_NAME="scroll_navbar"
if not _RELEASE:
    _component_func = components.declare_component(
        COMPONENT_NAME,
        url=dev_url,
    )
else:
    _component_func = components.declare_component(COMPONENT_NAME, path=build_dir)
    
def inject_crossorigin_interface():
    """Inject the CrossOriginInterface script into the parent scope."""
    
    # Load text content of COI
    content = None
    if _RELEASE:
        interface_script_path = os.path.join(build_dir, "CrossOriginInterface.min.js")    
        content = open(interface_script_path).read()
    else:
        # Load the script from dev_url
        response = requests.get(f"{dev_url}/CrossOriginInterface.js")
        content = response.text
    
    # Run COI content in parent
    # This works because streamlit.components.v1.html() creates an iframe from same domain as the parent scope
    # Same domain can bypass sandbox restrictions to create an interface for cross-origin iframes
    # This allows custom components to interact with parent scope
    components.html(
        f"""<script>
frameElement.parentElement.style.display = 'none';
if (!window.parent.COI_injected) {{
    window.parent.COI_injected = true;
    var script = window.parent.document.createElement('script');
    script.text = `{content}`;
    script.type = 'text/javascript';
    window.parent.document.head.appendChild(script);
}}
</script>""",
        height=0,
        width=0,
    )
def instantiate_crossorigin_interface(key):
    """Instantiate the CrossOriginInterface in the parent scope that responds to messages for key."""
    components.html(
        f"""<script>
frameElement.parentElement.style.display = 'none';
window.parent.instantiateCrossOriginInterface('{key}');
</script>""",
        height=0,
        width=0,
    )

class ForceAnchor:
    anchor:str
    def __init__(self):
        self.anchor = None
    
    def push(self, anchor):
        self.anchor = anchor
        
    def pop(self):
        anchor = self.anchor
        self.anchor = None
        return anchor

@st.fragment()
def scroll_navbar(
    anchor_ids: Collection[str],
    key: str = 'scroll_navbar_default',
    anchor_icons: Collection[str] = None,
    anchor_labels: Collection[str] = None,
    force_anchor: ForceAnchor = None,
    orientation: Literal['vertical', 'horizontal'] = 'vertical',
    override_styles: Dict[str, str] = {},
    auto_update_anchor: bool = True,
    disable_scroll: bool = False,
    ) -> str:
    """
    Creates a scroll navigation bar component.
    Parameters:
        anchor_ids (Collection[str]): A collection of anchor IDs that can be navigated to.
        key (str, optional):
            A unique key for this component. Any component beyond the first one should specify a key.
            Defaults to 'scroll_navbar_default'.
        anchor_icons (Collection[str], optional):
            A collection of icons for each navigation button.
            Each icon corresponds to an anchor in anchor_ids.
            Defaults to None.
        anchor_labels (Collection[str], optional):
            A collection of labels for each navigation button. 
            Each label corresponds to an anchor in anchor_ids.
            If None, the anchor IDs will be used. Defaults to None.
        force_anchor (str, ForceAnchor):
            A ForceAnchor object to push anchors to programatically select.
            Setting this and pushing an anchor ID will simulate clicking on an anchor. Defaults to None.
        orientation (Literal['vertical', 'horizontal'], optional):
            The orientation of the navigation bar. Defaults to 'vertical'.
        override_styles (Dict[str, str], optional):
            A dictionary of styles to override default styles. Defaults to {}.
        auto_update_anchor (bool, optional):
            If True, the highlighted anchor will automatically update to the next nearest anchor when the current one is scrolled out of view.
            Defaults to True.
        disable_scroll (bool, optional):
            If True, navigation will snap instantly to anchors.
            Defaults to False.
    Returns:
        str: The ID of the anchor that is currently selected.
    Example:
        ```# Create a dummy streamlit page 
        import streamlit as st
        anchor_ids = [f"anchor {num}" for num in range(10)]]
        for anchor in anchor_ids:
            st.subheader(anchor,anchor=anchor)
            st.write(["content "]*100)
            
        # Add a scroll navigation bar for anchors
        from screamlit_scroll_navigation import scroll_navbar
        with st.sidebar():
            scroll_navbar(anchor_ids)```
    """
    
    inject_crossorigin_interface()
    instantiate_crossorigin_interface(key)
    # Pop the anchor string from ForceAnchor object
    force_anchor_str = force_anchor.pop() if force_anchor else None
    component_value = _component_func(
        anchor_ids=anchor_ids,
        key=key,
        anchor_icons=anchor_icons,
        anchor_labels=anchor_labels,
        force_anchor=force_anchor_str,
        orientation=orientation,
        override_styles=override_styles,
        auto_update_anchor=auto_update_anchor,
        disable_scroll=disable_scroll,
    )
    return component_value