import os
import streamlit.components.v1 as components

script_directory = os.path.dirname(os.path.abspath(__file__))

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = False

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.

COMPONENT_NAME="ScrollNavigationBar"

if not _RELEASE:
    _component_func = components.declare_component(
        # We give the component a simple, descriptive name ("my_component"
        # does not fit this bill, so please choose something better for your
        # own component :)
        COMPONENT_NAME,
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        url="http://localhost:3001",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component(COMPONENT_NAME, path=build_dir)
    
def inject_crossorigin_interface():
    interface_script_path = os.path.join(script_directory, "CrossOriginInterface.js")
    content = open(interface_script_path).read()
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
    # Instantiate a COI object in the parent frame and hide div
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

from typing import *
# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the component function returned by
# `declare_component` and call it done. The wrapper allows us to customize
# our component's API: we can pre-process its input args, post-process its
# output value, and add a docstring for users.
def scroll_navigation(
    anchor_ids:Collection[str],
    key:str='scroll_navigation_default',
    anchor_icons:Collection[str]=None,
    anchor_labels:Collection[str]=None,
    force_anchor:str=None,
    orientation:Literal['vertical','horizontal']='vertical',
    ):
    inject_crossorigin_interface()
    instantiate_crossorigin_interface(key)
    component_value = _component_func(
        anchor_ids=anchor_ids,
        key=key,
        anchor_icons=anchor_icons,
        anchor_labels=anchor_labels,
        force_anchor=force_anchor,
        orientation=orientation,
    )

    # We could modify the value returned from the component if we wanted.
    # There's no need to do this in our simple example - but it's an option.
    return component_value
