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

class ScrollNavigationBar extends StreamlitComponentBase<State> {
  public state = { activeAnchorId: "" };

  postMessage(COI_method: string, data?: { anchor_id?: string; anchor_ids?: string[] }) {
    const { key } = this.props.args;
    if (key == null || typeof key !== "string") {
      throw new Error("Invalid key: key must be a string.");
    }

    const { anchor_id, anchor_ids } = data || {};
    window.parent.postMessage({ COI_method, key, anchor_id, anchor_ids }, "*");
  }

  postScroll(anchor_id: string): void {
    this.postMessage("scroll", { anchor_id });
    console.debug("postScroll", anchor_id);
  }
  postRegister(): void {
    this.postMessage("register");
  }
  postTrackAnchors(anchor_ids: string[]): void {
    this.postMessage("trackAnchors", { anchor_ids });
  }
  postUpdateActiveAnchor(anchor_id: string): void {
    this.postMessage("updateActiveAnchor", { anchor_id });
  }

  // Handle menu item click
  private handleMenuClick = (anchorId: string) => {
    this.setState({ activeAnchorId: anchorId });
    this.postScroll(anchorId);
    this.postUpdateActiveAnchor(anchorId);

    //Send back to Streamlit
    Streamlit.setComponentValue(anchorId);
  };

  public componentDidMount(): void {
    const { anchor_ids } = this.getCleanedArgs();
    const initialAnchorId = anchor_ids[0];
    this.postRegister();
    this.postTrackAnchors(anchor_ids);
    this.setState({ activeAnchorId: initialAnchorId });
    this.postUpdateActiveAnchor(anchor_ids[0]);
    window.addEventListener("message", this.handleMessage.bind(this));

    //Send back to streamlit
    Streamlit.setComponentValue(initialAnchorId);
  }

  componentDidUpdate(): void {
    super.componentDidUpdate();
    const { anchor_ids, force_anchor } = this.getCleanedArgs();
    if (force_anchor != null) {
      if (anchor_ids.includes(force_anchor)) {
        this.handleMenuClick(force_anchor);
      } else {
        throw new Error("Invalid force_anchor: force_anchor must be one of the anchor_ids.");
      }
    }
  }

  private handleMessage(event: MessageEvent) {
    const { COMPONENT_method, key } = event.data;
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

  private getCleanedArgs() {
    let { key, anchor_ids, anchor_labels, anchor_icons, force_anchor, orientation, override_styles } = this.props.args;
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
      // Check if override_styles contains relevant keys
      const style_keys = Object.keys(styles);
      for (const key of Object.keys(override_styles)) {
        if (!style_keys.includes(key)) {
          throw new Error(`Invalid override_styles key: ${key} is not a valid style key.`);
        }
      }
    }

    return { anchor_ids, anchor_labels, anchor_icons, force_anchor, key, orientation, override_styles };
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
          ...styles.navbarButtonBase,
          //Use horizontal or vertical navbarButton
          ...styles[isHorizontal ? "navbarButtonHorizontal" : "navbarButtonVertical"],
          //Set active style if active
          ...(activeAnchorId === anchor_id ? styles.navbarButtonActive : {}),
        }}

        //Change style on hover
        onMouseEnter={(e) => {
          //Apply ...styles.navbarButtonHover
          e.currentTarget.style.backgroundColor = styles.navbarButtonHover.backgroundColor || "";
          e.currentTarget.style.color = styles.navbarButtonHover.color || "";
        }}
        //Reset style on mouse leave
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
          const newStyle: CSSProperties = {
            backgroundColor: styles.navbarButtonBase.backgroundColor,
            color: styles.navbarButtonBase.color,
            ...(activeAnchorId === anchor_id ? styles.navbarButtonActive : {}),
          }
          e.currentTarget.style.backgroundColor = newStyle.backgroundColor || "";
          e.currentTarget.style.color = newStyle.color || "";
        }}
      >
        {/* Render Bootstrap icon if provided */}

        <span>
          {anchor_icons && anchor_icons[index] && (
            <i className={`${ScrollNavigationBar.getBiName(anchor_icons[index])}`}
              style={styles.navbarButtonIcon}></i>)}
          {anchor_labels[index]
          }</span>
      </div>
    ));
  };

  // Render sidebar with dynamic orientation handling
  public render = (): ReactNode => {
    const { orientation, override_styles } = this.getCleanedArgs();

    //Update styles with override_styles
    // Deep merge override_styles into styles
    const mergeDeep = (target: any, source: any) => {
      for (const key in source) {
        if (source[key] instanceof Object && key in target) {
          Object.assign(source[key], mergeDeep(target[key], source[key]));
        }
      }
      Object.assign(target || {}, source);
      return target;
    };
    mergeDeep(styles, override_styles);
    // Adjust layout direction based on orientation
    const isHorizontal = orientation === "horizontal";
    return (
      <div style={{
        //Use base navigation bar style
        ...styles.navigationBarBase,
        //Set horizontal or vertical style
        ...styles[isHorizontal ? "navigationBarHorizontal" : "navigationBarVertical"],
      }}>
        <div style={{ display: "flex", flexDirection: isHorizontal ? "row" : "column", width: "100%" }}>
          {this.renderMenuItems()}
        </div>
      </div>
    );
  };
}

const styles: { [key: string]: CSSProperties } = {
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
    padding: "10px",
    paddingTop: "17px",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    justifyContent: "center",
    borderRadius: "15px",
  },
  navigationBarHorizontal: {
    flexDirection: "row",
    height: "auto",
    overflowX: "auto",  // Enable horizontal scrolling
    whiteSpace: "nowrap", // Prevent wrapping of items
    scrollbarWidth: "none",  // Hides scrollbar for Firefox
    msOverflowStyle: "none",  // Hides scrollbar for IE
    WebkitOverflowScrolling: "touch",  // Enables smooth scrolling on iOS
  },
  navigationBarVertical: {
    flexDirection: "column",
    height: "100vh",
  }
};
<style scoped>{`.navigationBarHorizontal::-webkit-scrollbar {display: none;}`}</style>

export default withStreamlitConnection(ScrollNavigationBar);