import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib";
import React, { ReactNode } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

interface State {
  activeAnchorId: string;
}

function postMessageScroll(anchorId: string): void {
  console.log("postMessageScroll", anchorId);
  window.parent.postMessage({ method: "scroll", anchor_id: anchorId }, "*");
}
function postMessageRegister(): void {
  window.parent.postMessage({ method: "register" }, "*");
}
function postMessageTrackAnchors(anchor_ids: string[]): void {
  window.parent.postMessage({ method: "trackAnchors", anchor_ids: anchor_ids }, "*");
}
function postMessageUpdateActiveAnchor(anchorId: string): void {
  window.parent.postMessage({ method: "updateActiveAnchor", anchor_id: anchorId }, "*");
}



class SidebarMenu extends StreamlitComponentBase<State> {

  public state = { activeAnchorId: "" }; 

  // Handle menu item click
  private handleMenuClick = (anchorId: string) => {
    this.setState({ activeAnchorId: anchorId });
    postMessageScroll(anchorId);
    postMessageUpdateActiveAnchor(anchorId);
    Streamlit.setComponentValue(anchorId);
  };

  public componentDidMount(): void {
    const { anchor_ids, force_anchor } = this.getCleanedArgs();
    if (this.state.activeAnchorId === "") {
      this.setState({ activeAnchorId: anchor_ids[0] });
    }
    postMessageRegister();
    postMessageTrackAnchors(anchor_ids);
    postMessageUpdateActiveAnchor(this.state.activeAnchorId);
    window.addEventListener("message", this.handleMessage.bind(this));
  }
  private handleMessage(event: MessageEvent) {
    const {method} = event.data;
    if (method === "updateActiveAnchor") {
      const { anchor_id } = event.data;
      if (anchor_id && typeof anchor_id === "string") {
        this.setState({ activeAnchorId: anchor_id });
      }
    }
  }

  private getCleanedArgs() {
    let { anchor_ids, anchor_labels, anchor_icons, force_anchor } = this.props.args;

    // anchor_ids is required
    if (anchor_ids == null || !Array.isArray(anchor_ids) || !anchor_ids.every((a) => typeof a === "string")) {
      throw new Error("Invalid anchors: anchors must be a list of strings.");
    }

    // anchor_labels is an optional list
    if (anchor_labels == null) {
      anchor_labels = anchor_ids;
    }
    else {
      if (!Array.isArray(anchor_labels) || !anchor_labels.every((a) => typeof a === "string")) {
        throw new Error("Invalid anchor_labels: anchor_labels must be a list of strings.");
      }
    }

    // anchor_icons is an optional list
    if (anchor_icons == null) {
      // List of null icons
      anchor_icons = new Array(anchor_ids.length).fill(null);
    }
    else {
      if ((!Array.isArray(anchor_icons) || !anchor_icons.every((a) => typeof a === "string"))) {
        throw new Error("Invalid anchor_icons: anchor_icons must be a list of strings.");
      }
    }

    // force_anchor is an optional string
    if (force_anchor != null && typeof force_anchor !== "string") {
      throw new Error("Invalid force_anchor: force_anchor must be a string.");
    }
    return { anchor_ids, anchor_labels, anchor_icons, force_anchor };
  }

  // Render menu items dynamically based on props from Streamlit
  public renderMenuItems = (): ReactNode => {
    const { activeAnchorId: activeAnchorId } = this.state;

    const { anchor_ids, anchor_labels = anchor_ids, anchor_icons, force_anchor } = this.getCleanedArgs();

    return anchor_ids.map((anchor: string, index: number) => (
      <div
        key={anchor}
        onClick={() => this.handleMenuClick(anchor)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "15px 20px",
          backgroundColor: activeAnchorId === anchor ? "#4A4A4A" : "transparent",
          color: activeAnchorId === anchor ? "#fff" : "#FFD700",
          cursor: "pointer",
          fontWeight: activeAnchorId === anchor ? "bold" : "normal",
          borderRadius: "8px",
          marginBottom: "10px"
        }}
      >
        {/* Render Bootstrap icon if provided */}
        {anchor_icons && anchor_icons[index] && (
          <i className={`bi ${anchor_icons[index]}`} style={{ marginRight: "10px", fontSize: "18px" }}></i>
        )}
        <span>{anchor_labels[index]}</span>
      </div>
    ));
  };

  // Render sidebar
  public render = (): ReactNode => {
    return (
      <div style={styles.sidebarContainer}>
        <div style={styles.menuTitle}>Menu</div>
        <div>{this.renderMenuItems()}</div>
      </div>
    );
  };
}

// Styles for the sidebar container and title
const styles = {
  sidebarContainer: {
    backgroundColor: "#333",
    height: "100vh",
    padding: "20px",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    width: "250px"
  },
  menuTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "20px",
  }
};

export default withStreamlitConnection(SidebarMenu);