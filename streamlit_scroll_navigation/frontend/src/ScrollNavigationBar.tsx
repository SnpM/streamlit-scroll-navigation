import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { CSSProperties } from "react";

interface State {
  activeAnchorId: string;
}

//This React component handles the presentation and user input of the ScrollNavigationBar
//It interfaces with the parent window via CrossOriginInterface.js (COI)
class ScrollNavigationBar extends StreamlitComponentBase<State> {
  public state = { activeAnchorId: "" };
  private disable_scroll: boolean = false;
  private mounted = false;

  // Send message to COI
  postMessage(COI_method: string,
    data?: {
      anchor_id?: string;
      anchor_ids?:string[];
      auto_update_anchor?: boolean
      styles?: { [key: string]: CSSProperties }
      disable_scroll?: boolean
    }): boolean {
    const { key } = this.props.args;
    if (key == null || typeof key !== "string") {
      throw new Error("Invalid key: key must be a string.");
    }
    window.parent.postMessage({ COI_method, key, ...data }, "*");

    console.debug("postMessage from ", key, ": ", COI_method, data);
    return true;
  }

  
  postRegister(auto_update_anchor:boolean): void {
    this.postMessage("register", { auto_update_anchor } );
  }
  postUpdateConfig(): void {
    let styles = this.styles;
    let disable_scroll = this.disable_scroll;
    this.postMessage("updateConfig", {styles, disable_scroll} );
  }
  postScroll(anchor_id: string): void {
    this.postMessage("scroll", { anchor_id });
  }
  postTrackAnchors(anchor_ids: string[]): void {
    this.postMessage("trackAnchors", { anchor_ids });
  }
  postUpdateActiveAnchor(anchor_id: string): void {
    const { auto_update_anchor } = this.getCleanedArgs();
    if (auto_update_anchor)
      this.postMessage("updateActiveAnchor", { anchor_id });
  }

  // Handle menu item click
  private handleMenuClick = (anchorId: string) => {
    // Update active anchor for component and COI
    this.setState({ activeAnchorId: anchorId });
    this.postUpdateActiveAnchor(anchorId);

    // Scroll to anchor with COI
    this.postScroll(anchorId);

    //Send component value to Streamlit
    Streamlit.setComponentValue(anchorId);
  };

  public componentDidMount(): void {
    const { anchor_ids, auto_update_anchor, disable_scroll} = this.getCleanedArgs();
    const initialAnchorId = anchor_ids[0];

    this.disable_scroll = disable_scroll;

    // Register component
    this.postRegister(auto_update_anchor);
    // Send styles to COI
    this.postUpdateConfig();
    // Tell COI to track anchors for visibility
    this.postTrackAnchors(anchor_ids);
    // Set initial active anchor for component and COI
    this.setState({ activeAnchorId: initialAnchorId });
    this.postUpdateActiveAnchor(anchor_ids[0]);
    // Listen for messages from COI
    window.addEventListener("message", this.handleMessage.bind(this));

    //Send component value to streamlit
    Streamlit.setComponentValue(initialAnchorId);
    
    this.mounted = true;
  }
  
  componentDidUpdate(): void {
    // Call streamlit's componentDidUpdate
    super.componentDidUpdate();
    
    const { anchor_ids, force_anchor } = this.getCleanedArgs();
    // If force_anchor is provided, simulate clicking on it
    if (force_anchor != null) {
      if (anchor_ids.includes(force_anchor)) {
        this.handleMenuClick(force_anchor);
      } else {
        throw new Error("Invalid force_anchor: force_anchor must be one of the anchor_ids.");
      }
    }
  }

  // Handle messages from COI
  private handleMessage(event: MessageEvent) {
    const { COMPONENT_method, key } = event.data;
    // Check if message is for this component
    if (COMPONENT_method == null || key == null) {
      return;
    }
    if (key !== this.props.args.key) {
      return;
    }

    console.debug("handleMessage", event.data);
    if (COMPONENT_method === "updateActiveAnchor") {
      const { anchor_id } = event.data;
      if (anchor_id && typeof anchor_id === "string") {
        this.setState({ activeAnchorId: anchor_id });

        //Send back to Streamlit
        Streamlit.setComponentValue(anchor_id);
      }
    }
  }

  private getCleanedArgs(): {
    anchor_ids: string[],
    anchor_labels: string[],
    anchor_icons: string[],
    force_anchor: string,
    key: string,
    orientation: string,
    override_styles: { [key: string]: CSSProperties },
    auto_update_anchor: boolean,
    disable_scroll: boolean }
  {
    let { key, anchor_ids, anchor_labels, anchor_icons, force_anchor, orientation, override_styles, auto_update_anchor, disable_scroll} = this.props.args;
    //key is required
    if (key == null || typeof key !== "string") {
      throw new Error("Invalid key: key must be a string.");
    }

    // anchor_ids is required
    if (anchor_ids == null || !Array.isArray(anchor_ids) || !anchor_ids.every((a) => typeof a === "string")) {
      throw new Error("Invalid anchors: anchors must be a list of strings.");
    }

    // anchor_labels is an optional list
    if (anchor_labels == null) {
      anchor_labels = anchor_ids;
    } else {
      if (!Array.isArray(anchor_labels) || !anchor_labels.every((a) => typeof a === "string")) {
        throw new Error("Invalid anchor_labels: anchor_labels must be a list of strings with length matching anchor_ids.");
      }
    }

    // anchor_icons is an optional list
    if (anchor_icons == null) {
      // List of null icons
      anchor_icons = new Array(anchor_ids.length).fill(null);
    } else {
      if (!Array.isArray(anchor_icons) || !anchor_icons.every((a) => typeof a === "string")) {
        throw new Error("Invalid anchor_icons: anchor_icons must be a list of strings with length matching anchor_ids.");
      }
    }

    // force_anchor is an optional string
    if (force_anchor != null && typeof force_anchor !== "string") {
      throw new Error("Invalid force_anchor: force_anchor must be a string.");
    }

    //orientation is an optional string. If not provided, default to "vertical"
    //If provided, it must be "vertical" or "horizontal"
    if (orientation == null) {
      orientation = "vertical";
    } else {
      if (orientation !== "vertical" && orientation !== "horizontal") {
        throw new Error("Invalid orientation: orientation must be 'vertical' or 'horizontal'.");
      }
    }

    //button_style is an optional dictionary with CSS styles that override the styles in styles
    if (override_styles == null) {
      override_styles = {};
    } else {
      if (typeof override_styles !== "object" || Array.isArray(override_styles)) {
        throw new Error("Invalid override_styles: override_styles must be an object.");
      }

      /* Commenting out to allow for any style key
      // Check if override_styles contains relevant keys
      const style_keys = Object.keys(this.styles);
      for (const key of Object.keys(override_styles)) {
        if (!style_keys.includes(key)) {
          throw new Error(`Invalid override_styles key: ${key} is not a valid style key.`);
        }
      }*/
    }

    //auto_update_active is an optional boolean
    //If not provided, default to true
    //If provided, it must be a boolean
    if (auto_update_anchor == null) {
      auto_update_anchor = true;
    } else {
      if (typeof auto_update_anchor !== "boolean") {
        throw new Error("Invalid auto_update_anchor: auto_update_anchor must be a boolean.");
      }
    }

    //disable_scroll is an optional boolean
    //If not provided, default to false
    //If provided, it must be a boolean
    if (disable_scroll == null) {
      disable_scroll = false;
    } else {
      if (typeof disable_scroll !== "boolean") {
        throw new Error("Invalid disable_scroll: disable_scroll must be a boolean.");
      }
    }

    return { anchor_ids, anchor_labels, anchor_icons, force_anchor, key, orientation, override_styles, auto_update_anchor, disable_scroll};
  }

  static getBiName(icon: string) {
    //If bi prefix is not provided, add it
    if (!icon.startsWith("bi-")) {
      return "bi-" + icon;
    }
    return icon;
  }

  // Render menu items dynamically based on props from Streamlit
  public renderMenuItems = (): ReactNode => {
    const { activeAnchorId } = this.state;
    const { anchor_ids, anchor_labels, anchor_icons, orientation } = this.getCleanedArgs();

    // Determine if orientation is horizontal or vertical
    const isHorizontal = orientation === "horizontal";

    return anchor_ids.map((anchor_id: string, index: number) => (
      <div
        key={anchor_id}
        onClick={() => this.handleMenuClick(anchor_id)}
        //This is navbar button style
        style={{
          //Apply base navbarButton style
          ...this.styles.navbarButtonBase,
          //Use horizontal or vertical navbarButton
          ...this.styles[isHorizontal ? "navbarButtonHorizontal" : "navbarButtonVertical"],
          //Set active style if active
          ...(activeAnchorId === anchor_id ? this.styles.navbarButtonActive : {}),
        }}

        //Change style on hover
        onMouseEnter={(e) => {
          //Apply ...styles.navbarButtonHover
          const newStyle: CSSProperties = {
            ...this.styles.navbarButtonHover,
          }
          e.currentTarget.style.backgroundColor = newStyle.backgroundColor || "";
          e.currentTarget.style.color = newStyle.color || "";
        }}
        //Reset style on mouse leave
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
          const newStyle: CSSProperties = {
            backgroundColor: this.styles.navbarButtonBase.backgroundColor,
            color: this.styles.navbarButtonBase.color,
            ...(activeAnchorId === anchor_id ? this.styles.navbarButtonActive : {}),
          }
          e.currentTarget.style.backgroundColor = newStyle.backgroundColor || "";
          e.currentTarget.style.color = newStyle.color || "";
        }}
      >
        <span>
          {anchor_icons && anchor_icons[index] && (
            <i className={`${ScrollNavigationBar.getBiName(anchor_icons[index])}`}
              style={this.styles.navbarButtonIcon}></i>)}
          {anchor_labels[index]
          }</span>
      </div>
    ));
  };

  // Render sidebar with dynamic orientation handling
  public render = (): ReactNode => {
    const { orientation, override_styles, disable_scroll} = this.getCleanedArgs();

    if (this.mounted) {
      // Deep merge override_styles into styles
      const mergeDeep = (target: any, source: any) => {
        let changed = false;
        for (const key in source) {
          if (source[key] instanceof Object && key in target) {
            const { changed: childChanged } = mergeDeep(target[key], source[key]);
            if (childChanged) {
              changed = true;
            }
          } else {
            if (target[key] !== source[key]) {
              target[key] = source[key];
              changed = true;
            }
          }
        }
        return { result: target, changed };
      };
      let { changed } = mergeDeep(this.styles, override_styles);

      // Update disable_scroll if it has changed
      if (disable_scroll !== this.disable_scroll) {
        this.disable_scroll = disable_scroll;
        changed = true;
      }

      //Communicate new styles and other config to COI
      if (changed) {
        this.postUpdateConfig()
      }
    }

    // Adjust layout direction based on orientation
    const isHorizontal = orientation === "horizontal";
    return (
      <div style={{
        //Use base navigation bar style
        ...this.styles.navigationBarBase,
        //Set horizontal or vertical style
        ...this.styles[isHorizontal ? "navigationBarHorizontal" : "navigationBarVertical"],
      }}>
        <div style={{ display: "flex", flexDirection: isHorizontal ? "row" : "column", width: "100%" }}>
          {this.renderMenuItems()}
        </div>
      </div>
    );
  };


  public styles: { [key: string]: CSSProperties } = {
    navbarButtonBase: {
      backgroundColor: "#333",
      color: "#fff",
      cursor: "pointer",
      borderRadius: "2px",
      textAlign: "left",
      width: "100%",
      transition: "background-color 0.3s, color 0.3s",
      fontSize: "16px"
    },
    navbarButtonHorizontal:
    {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      padding: "15px 20px",
      margin: "0 5px",
      flexGrow: 1,
      whiteSpace: "nowrap"
    },
    navbarButtonVertical: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "15px 20px",
      margin: "0px 0",
    },
    navbarButtonActive: {
      backgroundColor: "#4A4A4A",
      color: "#fff",
      fontWeight: "bold",
    },
    navbarButtonHover: {
      backgroundColor: "#555",
      color: "#fff",
    },
    navbarButtonIcon: {
      marginRight: "10px",
    },
    navigationBarBase: {
      backgroundColor: "#333",
      padding: "10px 10px",  // Padding 10px from top and bottom
      color: "#fff",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      justifyContent: "center",
      borderRadius: "10px",
      height: "auto",
    },
    navigationBarHorizontal: {
      paddingLeft: "5px",
      paddingRight: "5px",
      flexDirection: "row",
      overflowX: "auto",  // Enable horizontal scrolling
      whiteSpace: "nowrap", // Prevent wrapping of items
      scrollbarWidth: "none",  // Hides scrollbar for Firefox
      msOverflowStyle: "none",  // Hides scrollbar for IE
      WebkitOverflowScrolling: "touch",  // Enables smooth scrolling on iOS
    },
    navigationBarVertical: {
      flexDirection: "column",
    },
    // Anchor emphasis style; after .2s delay, scale up the element 
    anchorEmphasis: {
      transition: 'transform 0.4s ease-in-out 0.2s',
      transform: 'scale(1.04)',  // Scale up the element
    }
  }
}
<style>{`.navigationBarHorizontal::-webkit-scrollbar {display: none;}`}</style>


export default withStreamlitConnection(ScrollNavigationBar);