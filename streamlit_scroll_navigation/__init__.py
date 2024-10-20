import os
import streamlit.components.v1 as components
from typing import *
import requests

dev_url = "http://localhost:3001"
parent_dir = os.path.dirname(os.path.abspath(__file__))
build_dir = os.path.join(parent_dir, "frontend/build")


_RELEASE = True
COMPONENT_NAME="scroll_navigation_bar"
if not _RELEASE:
    _component_func = components.declare_component(
        COMPONENT_NAME,
        url=dev_url,
    )
else:
    _component_func = components.declare_component(COMPONENT_NAME, path=build_dir)
    
def inject_crossorigin_interface():
    """Inject the CrossOriginInterface script into the parent scope."""
    content = None
    if _RELEASE:
        interface_script_path = os.path.join(build_dir, "CrossOriginInterface.min.js")    
        content = open(interface_script_path).read()
    else:
        # Load the script from dev_url
        response = requests.get(f"{dev_url}/CrossOriginInterface.js")
        content = response.text
        pass
    # Run bootloader script in parent and hide div
    components.html(
        f"""
        <script>
            frameElement.parentElement.style.display = 'none';
            if (!window.parent.COI_injected) {{
            window.parent.COI_injected = true;
            var script = window.parent.document.createElement('script');
            script.text = `{content}`;
            script.type = 'text/javascript';
            window.parent.document.head.appendChild(script);
        }}
        </script>
        """,
        height=0,
        width=0,
    )
def instantiate_crossorigin_interface(key):
    """Instantiate the CrossOriginInterface in the parent scope that responds to messages for key."""
    components.html(
        f"""
        <script>
        frameElement.parentElement.style.display = 'none';
        window.parent.instantiateCrossOriginInterface('{key}');
        </script>
        """,
        height=0,
        width=0,
    )

def scroll_navigation_bar(
    anchor_ids: Collection[str],
    key: str = 'scroll_navigation_bar_default',
    anchor_icons: Collection[str] = None,
    anchor_labels: Collection[str] = None,
    force_anchor: str = None,
    orientation: Literal['vertical', 'horizontal'] = 'vertical',
    override_styles: Dict[str, str] = {},
    ) -> str:
    """
    Creates a scroll navigation bar component.
    Parameters:
        anchor_ids (Collection[str]): A collection of anchor IDs that can be navigated to.
        key (str, optional):
            A unique key for this component. Any component beyond the first one should specify a key.
            Defaults to 'scroll_navigation_bar_default'.
        anchor_icons (Collection[str], optional):
            A collection of icons for each navigation button.
            Each icon corresponds to an anchor in anchor_ids.
            Defaults to None.
        anchor_labels (Collection[str], optional):
            A collection of labels for each navigation button. 
            Each label corresponds to an anchor in anchor_ids.
            If None, the anchor IDs will be used. Defaults to None.
        force_anchor (str, optional):
            An anchor ID to force navigation to.
            Setting this will simulate clicking on an anchor. Defaults to None.
        orientation (Literal['vertical', 'horizontal'], optional):
            The orientation of the navigation bar. Defaults to 'vertical'.
        override_styles (Dict[str, str], optional): A dictionary of styles to override default styles. Defaults to {}.
    Returns:
        str: The ID of the anchor that is currently selected.
    """
    
    inject_crossorigin_interface()
    instantiate_crossorigin_interface(key)
    component_value = _component_func(
        anchor_ids=anchor_ids,
        key=key,
        anchor_icons=anchor_icons,
        anchor_labels=anchor_labels,
        force_anchor=force_anchor,
        orientation=orientation,
        override_styles=override_styles,
    )
    return component_value